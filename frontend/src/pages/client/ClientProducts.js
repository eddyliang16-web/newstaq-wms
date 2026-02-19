import React, { useState, useEffect } from 'react';
import { Package, Edit2, Search, Weight, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ClientProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    weight: 0,
    min_stock_level: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      weight: product.weight || 0,
      min_stock_level: product.min_stock_level || 0
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await api.put(`/products/${editingProduct.id}`, formData);
      alert('Produit mis à jour avec succès !');
      setShowEditModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!user?.client_id) {
      alert('Erreur : Impossible de déterminer votre identifiant client');
      return;
    }
    
    try {
      await api.post('/products', {
        client_id: user.client_id,
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        unit_weight: formData.weight,
        min_stock_level: formData.min_stock_level,
        barcode: ''
      });
      alert('Produit créé avec succès !');
      setShowCreateModal(false);
      setFormData({
        sku: '',
        name: '',
        description: '',
        category: '',
        weight: 0,
        min_stock_level: 0
      });
      fetchProducts();
    } catch (error) {
      console.error('Erreur création produit:', error);
      alert('Erreur : ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await api.delete(`/products/${productToDelete.id}`);
      alert('Produit supprimé avec succès !');
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur : ' + (error.response?.data?.detail || 'Impossible de supprimer le produit'));
    }
  };

  const getStockStatus = (product) => {
    const stock = product.total_stock || 0;
    const minLevel = product.min_stock_level || 0;
    
    if (stock === 0) {
      return { text: 'Rupture', color: '#ef4444', bg: '#fee2e2' };
    } else if (stock < minLevel) {
      return { text: 'Stock faible', color: '#f59e0b', bg: '#fef3c7' };
    } else {
      return { text: 'Disponible', color: '#10b981', bg: '#d1fae5' };
    }
  };

  if (loading) {
    return <div style={styles.loading}>Chargement de vos produits...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Mes Produits</h1>
          <p style={styles.subtitle}>{filteredProducts.length} produit(s)</p>
        </div>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Mes Produits</h1>
            <p style={styles.subtitle}>{filteredProducts.length} produit(s)</p>
          </div>
          <button 
            style={styles.addButton}
            onClick={() => {
              setFormData({
                sku: '',
                name: '',
                description: '',
                category: '',
                weight: 0,
                min_stock_level: 0
              });
              setShowCreateModal(true);
            }}
          >
            <Plus size={20} />
            Ajouter un Produit
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Rechercher par nom, SKU ou catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Tableau des produits */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Nom du Produit</th>
              <th style={styles.th}>Catégorie</th>
              <th style={styles.th}>Poids (g)</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Seuil Min</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => {
              const status = getStockStatus(product);
              return (
                <tr 
                  key={product.id} 
                  style={index % 2 === 0 ? styles.tr : styles.trEven}
                >
                  <td style={styles.td}>
                    <span style={styles.sku}>{product.sku}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.productName}>{product.name}</div>
                    {product.description && (
                      <div style={styles.productDesc}>{product.description}</div>
                    )}
                  </td>
                  <td style={styles.td}>
                    {product.category && (
                      <span style={styles.category}>{product.category}</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.weightContainer}>
                      <Weight size={16} color="#64748b" />
                      <span style={styles.weightText}>{product.weight || 0} g</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.stockNumber}>{product.total_stock || 0}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.minStock}>{product.min_stock_level || 0}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: status.bg,
                      color: status.color
                    }}>
                      {status.text}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit(product)}
                      style={styles.editButton}
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <td style={styles.td}>
                      <button 
                        onClick={() => handleEdit(product)}
                        style={styles.editButton}
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteConfirm(true);
                        }}
                        style={styles.deleteButton}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div style={styles.emptyState}>
          <Package size={48} color="#cbd5e1" />
          <p style={styles.emptyText}>Aucun produit trouvé</p>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && (
        <div style={styles.modal} onClick={() => setShowEditModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Modifier le Produit</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nom du Produit *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={styles.textarea}
                  rows="3"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Catégorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Weight size={16} style={{verticalAlign: 'middle', marginRight: '0.25rem'}} />
                    Poids (grammes) *
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
                    style={styles.input}
                    min="0"
                    required
                  />
                  <span style={styles.helpText}>
                    Poids unitaire du produit en grammes
                  </span>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Seuil de Stock Minimum *</label>
                  <input
                    type="number"
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({...formData, min_stock_level: parseInt(e.target.value) || 0})}
                    style={styles.input}
                    min="0"
                    required
                  />
                  <span style={styles.helpText}>
                    Alerte si stock inférieur à cette valeur
                  </span>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>
                <button type="submit" style={styles.submitButton}>
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de création */}
{showCreateModal && (
  <div style={styles.modal} onClick={() => setShowCreateModal(false)}>
    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>Ajouter un Nouveau Produit</h2>
        <button 
          onClick={() => setShowCreateModal(false)}
          style={styles.closeButton}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleCreate} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>SKU *</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({...formData, sku: e.target.value})}
            style={styles.input}
            placeholder="Ex: PROD-001"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nom du Produit *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={styles.input}
            placeholder="Ex: T-Shirt Blanc M"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={styles.textarea}
            rows="3"
            placeholder="Description du produit..."
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Catégorie</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            style={styles.input}
            placeholder="Ex: Textile"
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Weight size={16} style={{verticalAlign: 'middle', marginRight: '0.25rem'}} />
              Poids (grammes) *
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
              style={styles.input}
              min="0"
              placeholder="150"
              required
            />
            <span style={styles.helpText}>
              Poids unitaire du produit en grammes
            </span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Seuil de Stock Minimum *</label>
            <input
              type="number"
              value={formData.min_stock_level}
              onChange={(e) => setFormData({...formData, min_stock_level: parseInt(e.target.value) || 0})}
              style={styles.input}
              min="0"
              placeholder="10"
              required
            />
            <span style={styles.helpText}>
              Alerte si stock inférieur à cette valeur
            </span>
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button 
            type="button"
            onClick={() => setShowCreateModal(false)}
            style={styles.cancelButton}
          >
            Annuler
          </button>
          <button type="submit" style={styles.submitButton}>
            Créer le Produit
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    {/* Modal de confirmation de suppression */}
{showDeleteConfirm && productToDelete && (
  <div style={styles.modal} onClick={() => setShowDeleteConfirm(false)}>
    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>⚠️ Confirmer la suppression</h2>
        <button 
          onClick={() => setShowDeleteConfirm(false)}
          style={styles.closeButton}
        >
          ×
        </button>
      </div>

      <div style={{padding: '1.5rem'}}>
        <p style={{marginBottom: '1rem', color: '#475569'}}>
          Êtes-vous sûr de vouloir supprimer ce produit ?
        </p>
        
        <div style={{
          backgroundColor: '#f1f5f9',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
        }}>
          <p><strong>SKU :</strong> {productToDelete.sku}</p>
          <p><strong>Nom :</strong> {productToDelete.name}</p>
          <p><strong>Stock actuel :</strong> {productToDelete.total_stock || 0}</p>
        </div>

        {productToDelete.total_stock > 0 && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            padding: '1rem',
            borderRadius: '0.5rem',
            color: '#92400e',
          }}>
            <p>⚠️ <strong>Attention :</strong> Ce produit a du stock en entrepôt. La suppression sera impossible.</p>
          </div>
        )}

        <p style={{marginTop: '1rem', fontSize: '0.875rem', color: '#64748b'}}>
          Cette action est <strong>irréversible</strong>.
        </p>
      </div>

      <div style={styles.modalFooter}>
        <button 
          onClick={() => setShowDeleteConfirm(false)}
          style={styles.cancelButton}
        >
          Annuler
        </button>
        <button 
          onClick={handleDelete}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          Supprimer définitivement
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    color: '#64748b',
    marginTop: '0.5rem',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '2rem',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f8fafc',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
    borderBottom: '1px solid #e2e8f0',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  trEven: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '1rem',
    fontSize: '0.875rem',
    color: '#334155',
  },
  sku: {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
  },
  productName: {
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: '0.25rem',
  },
  productDesc: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  category: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  weightContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  weightText: {
    fontWeight: '500',
    color: '#0f172a',
  },
  stockNumber: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  minStock: {
    color: '#64748b',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  editButton: {
    padding: '0.5rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    color: '#3b82f6',
    display: 'inline-flex',
    alignItems: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  emptyText: {
    marginTop: '1rem',
    color: '#64748b',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.125rem',
    color: '#64748b',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: 0,
  },
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#f1f5f9',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#64748b',
  },
  form: {
    padding: '1.5rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  helpText: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  modalFooter: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteButton: {
    padding: '0.5rem',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.5rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
  helpText: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
};

export default ClientProducts;

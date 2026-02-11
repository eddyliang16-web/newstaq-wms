import React, { useState, useEffect } from 'react';
import { Package, Plus, Eye, Calendar, Weight, Truck, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // États pour les modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptDetails, setReceiptDetails] = useState(null);
  
  // États pour la création
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [createFormData, setCreateFormData] = useState({
    client_id: '',
    supplier_name: '',
    expected_date: '',
    notes: '',
    products: []
  });

  useEffect(() => {
    fetchReceipts();
    fetchClients();
    fetchProducts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await api.get('/receipts');
      setReceipts(response.data);
    } catch (error) {
      console.error('Erreur chargement réceptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  const handleViewDetails = async (receiptId) => {
    try {
      const response = await api.get(`/receipts/${receiptId}/details`);
      setReceiptDetails(response.data);
      setSelectedReceipt(receiptId);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      alert('Erreur lors du chargement des détails');
    }
  };

  const handleCreateReceipt = async (e) => {
    e.preventDefault();
    
    if (createFormData.products.length === 0) {
      alert('Veuillez ajouter au moins un produit');
      return;
    }
    
    try {
      await api.post('/receipts/create', createFormData);
      alert('Réception créée avec succès !');
      setShowCreateModal(false);
      fetchReceipts();
      
      // Réinitialiser le formulaire
      setCreateFormData({
        client_id: '',
        supplier_name: '',
        expected_date: '',
        notes: '',
        products: []
      });
    } catch (error) {
      console.error('Erreur création réception:', error);
      alert('Erreur lors de la création de la réception');
    }
  };

  const addProductToReceipt = () => {
    setCreateFormData(prev => ({
      ...prev,
      products: [...prev.products, { product_id: '', expected_quantity: 1, lot_number: '', expiry_date: '' }]
    }));
  };

  const removeProductFromReceipt = (index) => {
    setCreateFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateReceiptProduct = (index, field, value) => {
    setCreateFormData(prev => ({
      ...prev,
      products: prev.products.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: { text: 'Planifiée', color: '#3b82f6', bg: '#dbeafe' },
      in_progress: { text: 'En cours', color: '#f59e0b', bg: '#fef3c7' },
      completed: { text: 'Complétée', color: '#10b981', bg: '#d1fae5' }
    };
    return statusConfig[status] || statusConfig.planned;
  };

  const filteredReceipts = filterStatus === 'all' 
    ? receipts 
    : receipts.filter(receipt => receipt.status === filterStatus);

  const statusCounts = {
    all: receipts.length,
    planned: receipts.filter(r => r.status === 'planned').length,
    in_progress: receipts.filter(r => r.status === 'in_progress').length,
    completed: receipts.filter(r => r.status === 'completed').length
  };

  if (loading) {
    return <div style={styles.loading}>Chargement des réceptions...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion des Réceptions</h1>
          <p style={styles.subtitle}>{filteredReceipts.length} réception(s)</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={styles.createButton}>
          <Plus size={20} />
          Créer une Réception
        </button>
      </div>

      {/* Filtres par statut */}
      <div style={styles.filterContainer}>
        <button
          onClick={() => setFilterStatus('all')}
          style={filterStatus === 'all' ? styles.filterButtonActive : styles.filterButton}
        >
          Toutes ({statusCounts.all})
        </button>
        <button
          onClick={() => setFilterStatus('planned')}
          style={filterStatus === 'planned' ? styles.filterButtonActive : styles.filterButton}
        >
          Planifiées ({statusCounts.planned})
        </button>
        <button
          onClick={() => setFilterStatus('in_progress')}
          style={filterStatus === 'in_progress' ? styles.filterButtonActive : styles.filterButton}
        >
          En cours ({statusCounts.in_progress})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          style={filterStatus === 'completed' ? styles.filterButtonActive : styles.filterButton}
        >
          Complétées ({statusCounts.completed})
        </button>
      </div>

      {/* Grille des réceptions */}
      <div style={styles.receiptsGrid}>
        {filteredReceipts.map(receipt => {
          const status = getStatusBadge(receipt.status);
          
          return (
            <div key={receipt.id} style={styles.receiptCard}>
              <div style={styles.receiptHeader}>
                <div>
                  <h3 style={styles.receiptNumber}>{receipt.receipt_number}</h3>
                  <p style={styles.receiptSupplier}>
                    <Truck size={16} />
                    {receipt.supplier_name}
                  </p>
                </div>
                <span style={{...styles.badge, backgroundColor: status.bg, color: status.color}}>
                  {status.text}
                </span>
              </div>

              <div style={styles.receiptBody}>
                <div style={styles.receiptInfo}>
                  <Calendar size={16} color="#64748b" />
                  <div>
                    <div style={styles.receiptLabel}>Date attendue</div>
                    <div style={styles.receiptValue}>
                      {new Date(receipt.expected_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                {receipt.received_date && (
                  <div style={styles.receiptInfo}>
                    <CheckCircle size={16} color="#10b981" />
                    <div>
                      <div style={styles.receiptLabel}>Date de réception</div>
                      <div style={styles.receiptValue}>
                        {new Date(receipt.received_date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                )}

                {receipt.notes && (
                  <div style={styles.receiptNotes}>
                    <span style={styles.notesLabel}>Notes:</span> {receipt.notes}
                  </div>
                )}
              </div>

              <div style={styles.receiptFooter}>
                <button 
                  onClick={() => handleViewDetails(receipt.id)}
                  style={styles.detailsButton}
                >
                  <Eye size={16} />
                  Voir Détails
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReceipts.length === 0 && (
        <div style={styles.emptyState}>
          <Package size={48} color="#cbd5e1" />
          <p style={styles.emptyText}>Aucune réception trouvée</p>
        </div>
      )}

      {/* Modal de Création */}
      {showCreateModal && (
        <div style={styles.modal} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Créer une Nouvelle Réception</h2>
              <button onClick={() => setShowCreateModal(false)} style={styles.closeButton}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Client *</label>
                <select
                  value={createFormData.client_id}
                  onChange={(e) => setCreateFormData({...createFormData, client_id: e.target.value})}
                  style={styles.select}
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nom du Fournisseur *</label>
                  <input
                    type="text"
                    value={createFormData.supplier_name}
                    onChange={(e) => setCreateFormData({...createFormData, supplier_name: e.target.value})}
                    style={styles.input}
                    placeholder="Fournisseur XYZ"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Date Attendue *</label>
                  <input
                    type="date"
                    value={createFormData.expected_date}
                    onChange={(e) => setCreateFormData({...createFormData, expected_date: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>Produits Attendus *</h3>
                  <button type="button" onClick={addProductToReceipt} style={styles.addProductButton}>
                    <Plus size={16} />
                    Ajouter un Produit
                  </button>
                </div>

                {createFormData.products.length === 0 && (
                  <p style={styles.helpText}>Cliquez sur "Ajouter un Produit" pour commencer</p>
                )}

                {createFormData.products.map((product, index) => (
                  <div key={index} style={styles.productGroup}>
                    <div style={styles.productRow}>
                      <select
                        value={product.product_id}
                        onChange={(e) => updateReceiptProduct(index, 'product_id', e.target.value)}
                        style={{...styles.select, flex: 2}}
                        required
                      >
                        <option value="">Sélectionner un produit</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        value={product.expected_quantity}
                        onChange={(e) => updateReceiptProduct(index, 'expected_quantity', parseInt(e.target.value) || 1)}
                        style={{...styles.input, flex: 1}}
                        min="1"
                        placeholder="Quantité"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => removeProductFromReceipt(index)}
                        style={styles.removeButton}
                        title="Retirer ce produit"
                      >
                        ×
                      </button>
                    </div>

                    <div style={styles.productRow}>
                      <input
                        type="text"
                        value={product.lot_number}
                        onChange={(e) => updateReceiptProduct(index, 'lot_number', e.target.value)}
                        style={{...styles.input, flex: 1}}
                        placeholder="Numéro de lot (optionnel)"
                      />

                      <input
                        type="date"
                        value={product.expiry_date}
                        onChange={(e) => updateReceiptProduct(index, 'expiry_date', e.target.value)}
                        style={{...styles.input, flex: 1}}
                        placeholder="Date d'expiration"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  value={createFormData.notes}
                  onChange={(e) => setCreateFormData({...createFormData, notes: e.target.value})}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Notes additionnelles sur cette réception..."
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={styles.cancelButton}>
                  Annuler
                </button>
                <button type="submit" style={styles.submitButton}>
                  Créer la Réception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Détails */}
      {showDetailsModal && receiptDetails && (
        <div style={styles.modal} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Détails de la Réception</h2>
              <button onClick={() => setShowDetailsModal(false)} style={styles.closeButton}>
                ×
              </button>
            </div>

            <div style={styles.detailsContainer}>
              <div style={styles.detailsSection}>
                <h3 style={styles.detailsSectionTitle}>Informations Générales</h3>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    <Calendar size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Date d'Expédition</div>
                      <div style={styles.detailValue}>
                        {new Date(receiptDetails.receipt.expected_date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <CheckCircle size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Date de Réception</div>
                      <div style={styles.detailValue}>
                        {receiptDetails.receipt.received_date 
                          ? new Date(receiptDetails.receipt.received_date).toLocaleDateString('fr-FR')
                          : 'En attente'}
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Truck size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Fournisseur</div>
                      <div style={styles.detailValue}>{receiptDetails.receipt.supplier_name}</div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Package size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Produits Reçus</div>
                      <div style={styles.detailValue}>{receiptDetails.total_products} unités</div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Weight size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Poids Total</div>
                      <div style={styles.detailValue}>{receiptDetails.total_weight} g</div>
                    </div>
                  </div>
                </div>

                {receiptDetails.receipt.notes && (
                  <div style={styles.notesBox}>
                    <strong>Notes:</strong>
                    <p>{receiptDetails.receipt.notes}</p>
                  </div>
                )}
              </div>

              <div style={styles.detailsSection}>
                <h3 style={styles.detailsSectionTitle}>Produits Reçus</h3>
                <table style={styles.detailsTable}>
                  <thead>
                    <tr>
                      <th style={styles.detailsTableHeader}>Produit</th>
                      <th style={styles.detailsTableHeader}>SKU</th>
                      <th style={styles.detailsTableHeader}>Quantité Attendue</th>
                      <th style={styles.detailsTableHeader}>Quantité Reçue</th>
                      <th style={styles.detailsTableHeader}>Poids Unit.</th>
                      <th style={styles.detailsTableHeader}>Poids Total</th>
                      <th style={styles.detailsTableHeader}>N° Lot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptDetails.lines.map((line, index) => (
                      <tr key={index} style={index % 2 === 0 ? styles.detailsTableRow : styles.detailsTableRowEven}>
                        <td style={styles.detailsTableCell}>{line.product.name}</td>
                        <td style={styles.detailsTableCell}>
                          <span style={styles.skuBadge}>{line.product.sku}</span>
                        </td>
                        <td style={styles.detailsTableCell}>{line.expected_quantity}</td>
                        <td style={styles.detailsTableCell}>
                          <strong>{line.received_quantity}</strong>
                        </td>
                        <td style={styles.detailsTableCell}>{line.product.weight || 0} g</td>
                        <td style={styles.detailsTableCell}>
                          <strong>{(line.received_quantity * (line.product.weight || 0))} g</strong>
                        </td>
                        <td style={styles.detailsTableCell}>
                          {line.lot_number || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
  createButton: {
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
  },
  filterContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    color: '#64748b',
  },
  filterButtonActive: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    color: 'white',
    fontWeight: '500',
  },
  receiptsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  receiptCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    padding: '1.5rem',
  },
  receiptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9',
  },
  receiptNumber: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
  },
  receiptSupplier: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  receiptBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  receiptInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  receiptLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  receiptValue: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#0f172a',
  },
  receiptNotes: {
    fontSize: '0.875rem',
    color: '#475569',
    backgroundColor: '#f8fafc',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
  },
  notesLabel: {
    fontWeight: '500',
    color: '#334155',
  },
  receiptFooter: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '1rem',
  },
  detailsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f8fafc',
    color: '#3b82f6',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
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
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
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
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: 'white',
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
  section: {
    marginBottom: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  addProductButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    color: '#3b82f6',
  },
  productGroup: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  productRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    alignItems: 'center',
  },
  removeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '0.5rem',
    border: '1px solid #fee2e2',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    fontSize: '1.5rem',
    cursor: 'pointer',
    flexShrink: 0,
  },
  helpText: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontStyle: 'italic',
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
  detailsContainer: {
    padding: '1.5rem',
  },
  detailsSection: {
    marginBottom: '2rem',
  },
  detailsSectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e2e8f0',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  detailItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginBottom: '0.25rem',
  },
  detailValue: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#0f172a',
  },
  notesBox: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
  },
  detailsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  detailsTableHeader: {
    padding: '0.75rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  detailsTableRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  detailsTableRowEven: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
  },
  detailsTableCell: {
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: '#334155',
  },
  skuBadge: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    backgroundColor: '#f1f5f9',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    color: '#64748b',
  },
};

export default Receipts;

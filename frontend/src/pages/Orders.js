import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Eye, Clock, Package, Weight, Calendar, MapPin, User, Mail, Filter } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // États pour les modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // États pour la création
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [createFormData, setCreateFormData] = useState({
    client_id: '',
    customer_name: '',
    customer_email: '',
    shipping_address: '',
    products: [],
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchClients();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
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

  const handleViewDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/details`);
      setOrderDetails(response.data);
      setSelectedOrder(orderId);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      alert('Erreur lors du chargement des détails');
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    if (createFormData.products.length === 0) {
      alert('Veuillez ajouter au moins un produit');
      return;
    }
    
    try {
      await api.post('/orders/create', createFormData);
      alert('Commande créée avec succès !');
      setShowCreateModal(false);
      fetchOrders();
      
      // Réinitialiser le formulaire
      setCreateFormData({
        client_id: '',
        customer_name: '',
        customer_email: '',
        shipping_address: '',
        products: [],
        priority: 'medium',
        notes: ''
      });
    } catch (error) {
      console.error('Erreur création commande:', error);
      alert('Erreur lors de la création de la commande');
    }
  };

  const addProductToOrder = () => {
    setCreateFormData(prev => ({
      ...prev,
      products: [...prev.products, { product_id: '', quantity: 1 }]
    }));
  };

  const removeProductFromOrder = (index) => {
    setCreateFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateOrderProduct = (index, field, value) => {
    setCreateFormData(prev => ({
      ...prev,
      products: prev.products.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'En attente', color: '#f59e0b', bg: '#fef3c7' },
      picking: { text: 'Préparation', color: '#3b82f6', bg: '#dbeafe' },
      packed: { text: 'Emballé', color: '#8b5cf6', bg: '#ede9fe' },
      shipped: { text: 'Expédié', color: '#10b981', bg: '#d1fae5' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { text: 'Basse', color: '#64748b', bg: '#f1f5f9' },
      medium: { text: 'Moyenne', color: '#3b82f6', bg: '#dbeafe' },
      high: { text: 'Haute', color: '#f59e0b', bg: '#fef3c7' },
      urgent: { text: 'Urgente', color: '#ef4444', bg: '#fee2e2' }
    };
    return priorityConfig[priority] || priorityConfig.medium;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    picking: orders.filter(o => o.status === 'picking').length,
    packed: orders.filter(o => o.status === 'packed').length,
    shipped: orders.filter(o => o.status === 'shipped').length
  };

  if (loading) {
    return <div style={styles.loading}>Chargement des commandes...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion des Commandes</h1>
          <p style={styles.subtitle}>{filteredOrders.length} commande(s)</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={styles.createButton}>
          <Plus size={20} />
          Créer une Commande
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
          onClick={() => setFilterStatus('pending')}
          style={filterStatus === 'pending' ? styles.filterButtonActive : styles.filterButton}
        >
          En attente ({statusCounts.pending})
        </button>
        <button
          onClick={() => setFilterStatus('picking')}
          style={filterStatus === 'picking' ? styles.filterButtonActive : styles.filterButton}
        >
          Préparation ({statusCounts.picking})
        </button>
        <button
          onClick={() => setFilterStatus('packed')}
          style={filterStatus === 'packed' ? styles.filterButtonActive : styles.filterButton}
        >
          Emballé ({statusCounts.packed})
        </button>
        <button
          onClick={() => setFilterStatus('shipped')}
          style={filterStatus === 'shipped' ? styles.filterButtonActive : styles.filterButton}
        >
          Expédié ({statusCounts.shipped})
        </button>
      </div>

      {/* Grille des commandes */}
      <div style={styles.ordersGrid}>
        {filteredOrders.map(order => {
          const status = getStatusBadge(order.status);
          const priority = getPriorityBadge(order.priority);
          
          return (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={styles.orderNumber}>{order.order_number}</h3>
                  <p style={styles.orderDate}>
                    {new Date(order.order_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div style={styles.badges}>
                  <span style={{...styles.badge, backgroundColor: status.bg, color: status.color}}>
                    {status.text}
                  </span>
                  <span style={{...styles.badge, backgroundColor: priority.bg, color: priority.color}}>
                    {priority.text}
                  </span>
                </div>
              </div>

              <div style={styles.orderBody}>
                <div style={styles.orderInfo}>
                  <User size={16} color="#64748b" />
                  <span style={styles.orderText}>{order.customer_name}</span>
                </div>
                <div style={styles.orderInfo}>
                  <Mail size={16} color="#64748b" />
                  <span style={styles.orderText}>{order.customer_email}</span>
                </div>
                <div style={styles.orderInfo}>
                  <MapPin size={16} color="#64748b" />
                  <span style={styles.orderText}>{order.shipping_address}</span>
                </div>
                {order.tracking_number && (
                  <div style={styles.orderInfo}>
                    <Package size={16} color="#64748b" />
                    <span style={styles.orderText}>Tracking: {order.tracking_number}</span>
                  </div>
                )}
                {order.external_platform && order.external_platform !== 'manual' && (
                  <div style={styles.orderInfo}>
                    <ShoppingCart size={16} color="#64748b" />
                    <span style={styles.orderText}>Origine: {order.external_platform}</span>
                  </div>
                )}
              </div>

              <div style={styles.orderFooter}>
                <button 
                  onClick={() => handleViewDetails(order.id)}
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

      {filteredOrders.length === 0 && (
        <div style={styles.emptyState}>
          <ShoppingCart size={48} color="#cbd5e1" />
          <p style={styles.emptyText}>Aucune commande trouvée</p>
        </div>
      )}

      {/* Modal de Création */}
      {showCreateModal && (
        <div style={styles.modal} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Créer une Nouvelle Commande</h2>
              <button onClick={() => setShowCreateModal(false)} style={styles.closeButton}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateOrder} style={styles.form}>
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
                  <label style={styles.label}>Nom du Client Final *</label>
                  <input
                    type="text"
                    value={createFormData.customer_name}
                    onChange={(e) => setCreateFormData({...createFormData, customer_name: e.target.value})}
                    style={styles.input}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Client Final *</label>
                  <input
                    type="email"
                    value={createFormData.customer_email}
                    onChange={(e) => setCreateFormData({...createFormData, customer_email: e.target.value})}
                    style={styles.input}
                    placeholder="client@email.com"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Adresse de Livraison *</label>
                <textarea
                  value={createFormData.shipping_address}
                  onChange={(e) => setCreateFormData({...createFormData, shipping_address: e.target.value})}
                  style={styles.textarea}
                  rows="3"
                  placeholder="123 Rue Example, 75001 Paris"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Priorité</label>
                <select
                  value={createFormData.priority}
                  onChange={(e) => setCreateFormData({...createFormData, priority: e.target.value})}
                  style={styles.select}
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>Produits *</h3>
                  <button type="button" onClick={addProductToOrder} style={styles.addProductButton}>
                    <Plus size={16} />
                    Ajouter un Produit
                  </button>
                </div>

                {createFormData.products.length === 0 && (
                  <p style={styles.helpText}>Cliquez sur "Ajouter un Produit" pour commencer</p>
                )}

                {createFormData.products.map((product, index) => (
                  <div key={index} style={styles.productRow}>
                    <select
                      value={product.product_id}
                      onChange={(e) => updateOrderProduct(index, 'product_id', e.target.value)}
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
                      value={product.quantity}
                      onChange={(e) => updateOrderProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                      style={{...styles.input, flex: 1}}
                      min="1"
                      placeholder="Qté"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => removeProductFromOrder(index)}
                      style={styles.removeButton}
                      title="Retirer ce produit"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  value={createFormData.notes}
                  onChange={(e) => setCreateFormData({...createFormData, notes: e.target.value})}
                  style={styles.textarea}
                  rows="2"
                  placeholder="Notes additionnelles..."
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={styles.cancelButton}>
                  Annuler
                </button>
                <button type="submit" style={styles.submitButton}>
                  Créer la Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Détails */}
      {showDetailsModal && orderDetails && (
        <div style={styles.modal} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Détails de la Commande</h2>
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
                      <div style={styles.detailLabel}>Date de Commande</div>
                      <div style={styles.detailValue}>
                        {new Date(orderDetails.order.order_date).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Clock size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Date de Préparation</div>
                      <div style={styles.detailValue}>
                        {orderDetails.order.preparation_date 
                          ? new Date(orderDetails.order.preparation_date).toLocaleString('fr-FR')
                          : 'Non démarrée'}
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Package size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Date de Récupération</div>
                      <div style={styles.detailValue}>
                        {orderDetails.order.pickup_date 
                          ? new Date(orderDetails.order.pickup_date).toLocaleString('fr-FR')
                          : 'Non récupérée'}
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <ShoppingCart size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Origine</div>
                      <div style={styles.detailValue}>
                        {orderDetails.platform === 'manual' ? 'Manuelle' : orderDetails.platform}
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Package size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Nombre de Produits</div>
                      <div style={styles.detailValue}>{orderDetails.total_products} unités</div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Weight size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Poids Total</div>
                      <div style={styles.detailValue}>{orderDetails.total_weight} g</div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <User size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Client Final</div>
                      <div style={styles.detailValue}>{orderDetails.order.customer_name}</div>
                    </div>
                  </div>

                  <div style={styles.detailItem}>
                    <Mail size={20} color="#64748b" />
                    <div>
                      <div style={styles.detailLabel}>Email</div>
                      <div style={styles.detailValue}>{orderDetails.order.customer_email}</div>
                    </div>
                  </div>
                </div>

                <div style={styles.detailItem}>
                  <MapPin size={20} color="#64748b" />
                  <div style={{flex: 1}}>
                    <div style={styles.detailLabel}>Adresse de Livraison</div>
                    <div style={styles.detailValue}>{orderDetails.order.shipping_address}</div>
                  </div>
                </div>
              </div>

              <div style={styles.detailsSection}>
                <h3 style={styles.detailsSectionTitle}>Produits Commandés</h3>
                <table style={styles.detailsTable}>
                  <thead>
                    <tr>
                      <th style={styles.detailsTableHeader}>Produit</th>
                      <th style={styles.detailsTableHeader}>SKU</th>
                      <th style={styles.detailsTableHeader}>Quantité</th>
                      <th style={styles.detailsTableHeader}>Poids Unit.</th>
                      <th style={styles.detailsTableHeader}>Poids Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.lines.map((line, index) => (
                      <tr key={index} style={index % 2 === 0 ? styles.detailsTableRow : styles.detailsTableRowEven}>
                        <td style={styles.detailsTableCell}>{line.product.name}</td>
                        <td style={styles.detailsTableCell}>
                          <span style={styles.skuBadge}>{line.product.sku}</span>
                        </td>
                        <td style={styles.detailsTableCell}>{line.quantity_ordered}</td>
                        <td style={styles.detailsTableCell}>{line.product.weight || 0} g</td>
                        <td style={styles.detailsTableCell}>
                          <strong>{(line.quantity_ordered * (line.product.weight || 0))} g</strong>
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
    transition: 'all 0.2s',
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
    transition: 'all 0.2s',
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
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    padding: '1.5rem',
    transition: 'all 0.2s',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9',
  },
  orderNumber: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
  },
  orderDate: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  badges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-end',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  orderBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  orderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  orderText: {
    fontSize: '0.875rem',
    color: '#475569',
  },
  orderFooter: {
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
    transition: 'all 0.2s',
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
  productRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
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

export default Orders;

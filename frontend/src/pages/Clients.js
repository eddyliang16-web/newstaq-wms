import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Mail, Phone, MapPin, Building, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',  // Ajouté pour le backend
    company_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    siren: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_email: '',
    contact_phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.company_name.trim()) {
      errors.company_name = 'Nom de l\'entreprise requis';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide';
    }
    
    if (!formData.siren.trim()) {
      errors.siren = 'Numéro SIREN requis';
    } else if (!/^\d{9}$/.test(formData.siren)) {
      errors.siren = 'SIREN doit contenir 9 chiffres';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Adresse requise';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'Ville requise';
    }
    
    if (!formData.postal_code.trim()) {
      errors.postal_code = 'Code postal requis';
    }
    
    if (!formData.contact_first_name.trim()) {
      errors.contact_first_name = 'Prénom de l\'interlocuteur requis';
    }
    
    if (!formData.contact_last_name.trim()) {
      errors.contact_last_name = 'Nom de l\'interlocuteur requis';
    }
    
    if (!formData.contact_email.trim()) {
      errors.contact_email = 'Email de l\'interlocuteur requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      errors.contact_email = 'Email invalide';
    }
    
    if (!formData.contact_phone.trim()) {
      errors.contact_phone = 'Téléphone de l\'interlocuteur requis';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Ajouter name = company_name pour le backend
      const dataToSend = {
        ...formData,
        name: formData.company_name
      };
      
      const response = await api.post('/clients/create', dataToSend);
      
      setSubmitSuccess({
        message: 'Client créé avec succès !',
        details: response.data
      });
      
      // Rafraîchir la liste des clients
      fetchClients();
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setShowCreateModal(false);
        setSubmitSuccess(null);
        setFormData({
          name: '',
          company_name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postal_code: '',
          country: 'France',
          siren: '',
          contact_first_name: '',
          contact_last_name: '',
          contact_email: '',
          contact_phone: ''
        });
      }, 3000);
      
    } catch (error) {
      console.error('Erreur création client:', error);
      alert('Erreur lors de la création du client');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion des Clients</h1>
          <p style={styles.subtitle}>{clients.length} client(s) actif(s)</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={styles.createButton}>
          <Plus size={20} />
          Créer un Nouveau Client
        </button>
      </div>

      {/* Liste des clients */}
      <div style={styles.clientsGrid}>
        {clients.map(client => (
          <div key={client.id} style={styles.clientCard}>
            <div style={styles.clientHeader}>
              <div style={styles.clientAvatar}>
                <Building size={32} color="#3b82f6" />
              </div>
              <div style={styles.clientInfo}>
                <h3 style={styles.clientName}>{client.name}</h3>
                <span style={styles.clientCode}>{client.code}</span>
              </div>
            </div>
            
            <div style={styles.clientDetails}>
              <div style={styles.detailRow}>
                <Mail size={16} color="#64748b" />
                <span style={styles.detailText}>{client.email}</span>
              </div>
              
              {client.phone && (
                <div style={styles.detailRow}>
                  <Phone size={16} color="#64748b" />
                  <span style={styles.detailText}>{client.phone}</span>
                </div>
              )}
              
              {client.address && (
                <div style={styles.detailRow}>
                  <MapPin size={16} color="#64748b" />
                  <span style={styles.detailText}>{client.address}</span>
                </div>
              )}
            </div>
            
            <div style={styles.clientFooter}>
              <button 
                style={styles.viewButton}
                onClick={() => {
                  setSelectedClient(client);
                  setShowDetailModal(true);
                }}
              >
                Voir Détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div style={styles.modal} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Créer un Nouveau Client</h2>
              <button 
                onClick={() => setShowCreateModal(false)} 
                style={styles.closeButton}
              >
                ×
              </button>
            </div>
            
            {submitSuccess ? (
              <div style={styles.successMessage}>
                <div style={styles.successIcon}>✓</div>
                <h3 style={styles.successTitle}>{submitSuccess.message}</h3>
                <div style={styles.successDetails}>
                  <p><strong>Code client:</strong> {submitSuccess.details.client_code}</p>
                  <p><strong>Username:</strong> {submitSuccess.details.username}</p>
                  <p><strong>Mot de passe:</strong> {submitSuccess.details.default_password}</p>
                  <p style={styles.warningText}>
                    ⚠️ Transmettez ces identifiants au client de manière sécurisée
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Informations Entreprise */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Informations Entreprise</h3>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Nom de l'Entreprise *
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      style={formErrors.company_name ? styles.inputError : styles.input}
                      placeholder="SARL Example"
                    />
                    {formErrors.company_name && (
                      <span style={styles.errorText}>{formErrors.company_name}</span>
                    )}
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email Entreprise *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={formErrors.email ? styles.inputError : styles.input}
                        placeholder="contact@entreprise.com"
                      />
                      {formErrors.email && (
                        <span style={styles.errorText}>{formErrors.email}</span>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Numéro SIREN *</label>
                    <input
                      type="text"
                      name="siren"
                      value={formData.siren}
                      onChange={handleInputChange}
                      style={formErrors.siren ? styles.inputError : styles.input}
                      placeholder="123456789 (9 chiffres)"
                      maxLength="9"
                    />
                    {formErrors.siren && (
                      <span style={styles.errorText}>{formErrors.siren}</span>
                    )}
                  </div>
                </div>

                {/* Adresse */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Adresse</h3>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Adresse *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={formErrors.address ? styles.inputError : styles.input}
                      placeholder="123 rue Example"
                    />
                    {formErrors.address && (
                      <span style={styles.errorText}>{formErrors.address}</span>
                    )}
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Ville *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        style={formErrors.city ? styles.inputError : styles.input}
                        placeholder="Paris"
                      />
                      {formErrors.city && (
                        <span style={styles.errorText}>{formErrors.city}</span>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Code Postal *</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        style={formErrors.postal_code ? styles.inputError : styles.input}
                        placeholder="75001"
                      />
                      {formErrors.postal_code && (
                        <span style={styles.errorText}>{formErrors.postal_code}</span>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Pays</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* Interlocuteur */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Coordonnées de l'Interlocuteur</h3>
                  
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Prénom *</label>
                      <input
                        type="text"
                        name="contact_first_name"
                        value={formData.contact_first_name}
                        onChange={handleInputChange}
                        style={formErrors.contact_first_name ? styles.inputError : styles.input}
                        placeholder="Jean"
                      />
                      {formErrors.contact_first_name && (
                        <span style={styles.errorText}>{formErrors.contact_first_name}</span>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Nom *</label>
                      <input
                        type="text"
                        name="contact_last_name"
                        value={formData.contact_last_name}
                        onChange={handleInputChange}
                        style={formErrors.contact_last_name ? styles.inputError : styles.input}
                        placeholder="Dupont"
                      />
                      {formErrors.contact_last_name && (
                        <span style={styles.errorText}>{formErrors.contact_last_name}</span>
                      )}
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email *</label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        style={formErrors.contact_email ? styles.inputError : styles.input}
                        placeholder="jean.dupont@entreprise.com"
                      />
                      {formErrors.contact_email && (
                        <span style={styles.errorText}>{formErrors.contact_email}</span>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Téléphone *</label>
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        style={formErrors.contact_phone ? styles.inputError : styles.input}
                        placeholder="+33 6 12 34 56 78"
                      />
                      {formErrors.contact_phone && (
                        <span style={styles.errorText}>{formErrors.contact_phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div style={styles.modalFooter}>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    style={styles.cancelButton}
                  >
                    Annuler
                  </button>
                  <button type="submit" style={styles.submitButton}>
                    Créer le Client
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailModal && selectedClient && (
        <div style={styles.modal} onClick={() => setShowDetailModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Détails du Client</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div style={{padding: '1.5rem'}}>
              {/* Informations entreprise */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Informations de l'Entreprise</h3>
                
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Code Client</span>
                    <span style={styles.detailValue}>{selectedClient.code}</span>
                  </div>
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Raison Sociale</span>
                    <span style={styles.detailValue}>{selectedClient.company_name}</span>
                  </div>
                  
                  {selectedClient.siren && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>SIREN</span>
                      <span style={styles.detailValue}>{selectedClient.siren}</span>
                    </div>
                  )}
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Email</span>
                    <span style={styles.detailValue}>{selectedClient.email}</span>
                  </div>
                  
                  {selectedClient.phone && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Téléphone</span>
                      <span style={styles.detailValue}>{selectedClient.phone}</span>
                    </div>
                  )}
                  
                  {selectedClient.address && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Adresse</span>
                      <span style={styles.detailValue}>
                        {selectedClient.address}
                        {selectedClient.city && `, ${selectedClient.city}`}
                        {selectedClient.postal_code && ` ${selectedClient.postal_code}`}
                        {selectedClient.country && `, ${selectedClient.country}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              {(selectedClient.contact_first_name || selectedClient.contact_last_name) && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Interlocuteur</h3>
                  
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Nom</span>
                      <span style={styles.detailValue}>
                        {selectedClient.contact_first_name} {selectedClient.contact_last_name}
                      </span>
                    </div>
                    
                    {selectedClient.contact_email && (
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Email</span>
                        <span style={styles.detailValue}>{selectedClient.contact_email}</span>
                      </div>
                    )}
                    
                    {selectedClient.contact_phone && (
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Téléphone</span>
                        <span style={styles.detailValue}>{selectedClient.contact_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Statut */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Statut</h3>
                
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Actif</span>
                    <span style={{
                      ...styles.detailValue,
                      color: selectedClient.active ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {selectedClient.active ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  
                  {selectedClient.created_at && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Date de création</span>
                      <span style={styles.detailValue}>
                        {new Date(selectedClient.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  style={styles.submitButton}
                >
                  Fermer
                </button>
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
  clientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  clientCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    padding: '1.5rem',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  clientHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  clientAvatar: {
    width: '64px',
    height: '64px',
    backgroundColor: '#dbeafe',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
  },
  clientCode: {
    fontSize: '0.875rem',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    marginTop: '0.25rem',
    display: 'inline-block',
  },
  clientDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  detailText: {
    fontSize: '0.875rem',
    color: '#475569',
  },
  clientFooter: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1rem',
  },
  viewButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8fafc',
    color: '#3b82f6',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
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
    maxWidth: '800px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
  },
  form: {
    padding: '1.5rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e2e8f0',
  },
  formGroup: {
    marginBottom: '1rem',
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
    transition: 'all 0.2s',
  },
  inputError: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #ef4444',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
  },
  errorText: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: '0.25rem',
  },
  modalFooter: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    padding: '1.5rem',
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
  successMessage: {
    padding: '3rem',
    textAlign: 'center',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    margin: '0 auto 1.5rem',
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '1.5rem',
  },
  successDetails: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    textAlign: 'left',
  },
  warningText: {
    marginTop: '1rem',
    color: '#f59e0b',
    fontWeight: '500',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  detailLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '1rem',
    color: '#0f172a',
  },
};

export default Clients;

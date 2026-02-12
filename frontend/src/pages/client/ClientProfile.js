import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Building, Save, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

const ClientProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.current_password) {
      newErrors.current_password = 'Mot de passe actuel requis';
    }
    
    if (!passwordData.new_password) {
      newErrors.new_password = 'Nouveau mot de passe requis';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (!passwordData.confirm_password) {
      newErrors.confirm_password = 'Confirmation requise';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Les mots de passe ne correspondent pas';
    }
    
    if (passwordData.current_password && passwordData.new_password && 
        passwordData.current_password === passwordData.new_password) {
      newErrors.new_password = 'Le nouveau mot de passe doit être différent de l\'ancien';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      await api.post('/users/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setSuccessMessage('Mot de passe changé avec succès !');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setShowPasswordForm(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      if (error.response?.data?.detail === 'Mot de passe actuel incorrect') {
        setErrors({ current_password: 'Mot de passe actuel incorrect' });
      } else {
        setErrors({ general: 'Erreur lors du changement de mot de passe' });
      }
    }
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  if (!user) {
    return <div style={styles.error}>Impossible de charger le profil</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mon Profil</h1>
        <p style={styles.subtitle}>Gérer vos informations personnelles</p>
      </div>

      {successMessage && (
        <div style={styles.successAlert}>
          <div style={styles.successIcon}>✓</div>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Informations du profil */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderIcon}>
            <User size={24} color="#3b82f6" />
          </div>
          <h2 style={styles.cardTitle}>Informations Personnelles</h2>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <User size={16} color="#64748b" />
                Nom d'utilisateur
              </div>
              <div style={styles.infoValue}>{user.username}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <User size={16} color="#64748b" />
                Nom complet
              </div>
              <div style={styles.infoValue}>{user.name}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <Mail size={16} color="#64748b" />
                Email
              </div>
              <div style={styles.infoValue}>{user.email}</div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <Building size={16} color="#64748b" />
                Type de compte
              </div>
              <div style={styles.infoValue}>
                <span style={styles.roleClient}>
                  Compte Client
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderIcon}>
            <Lock size={24} color="#3b82f6" />
          </div>
          <h2 style={styles.cardTitle}>Sécurité</h2>
        </div>

        <div style={styles.cardBody}>
          {!showPasswordForm ? (
            <div style={styles.securityInfo}>
              <p style={styles.securityText}>
                Pour des raisons de sécurité, nous vous recommandons de changer régulièrement votre mot de passe.
              </p>
              <button 
                onClick={() => setShowPasswordForm(true)}
                style={styles.changePasswordButton}
              >
                <Lock size={16} />
                Changer mon Mot de Passe
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} style={styles.passwordForm}>
              {errors.general && (
                <div style={styles.errorAlert}>{errors.general}</div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Mot de passe actuel *</label>
                <div style={styles.passwordInputWrapper}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => {
                      setPasswordData({...passwordData, current_password: e.target.value});
                      setErrors({...errors, current_password: ''});
                    }}
                    style={errors.current_password ? styles.inputError : styles.input}
                    placeholder="Votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeButton}
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.current_password && (
                  <span style={styles.errorText}>{errors.current_password}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nouveau mot de passe *</label>
                <div style={styles.passwordInputWrapper}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => {
                      setPasswordData({...passwordData, new_password: e.target.value});
                      setErrors({...errors, new_password: ''});
                    }}
                    style={errors.new_password ? styles.inputError : styles.input}
                    placeholder="Au moins 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeButton}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.new_password && (
                  <span style={styles.errorText}>{errors.new_password}</span>
                )}
                <span style={styles.helpText}>
                  Le mot de passe doit contenir au moins 8 caractères
                </span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirmer le nouveau mot de passe *</label>
                <div style={styles.passwordInputWrapper}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => {
                      setPasswordData({...passwordData, confirm_password: e.target.value});
                      setErrors({...errors, confirm_password: ''});
                    }}
                    style={errors.confirm_password ? styles.inputError : styles.input}
                    placeholder="Retapez le nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <span style={styles.errorText}>{errors.confirm_password}</span>
                )}
              </div>

              <div style={styles.formActions}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                    setErrors({});
                  }}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>
                <button type="submit" style={styles.saveButton}>
                  <Save size={16} />
                  Enregistrer le Nouveau Mot de Passe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
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
  card: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    marginBottom: '2rem',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  cardHeaderIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#dbeafe',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
  },
  cardBody: {
    padding: '1.5rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#0f172a',
    fontWeight: '500',
  },
  roleClient: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  securityInfo: {
    textAlign: 'center',
    padding: '2rem',
  },
  securityText: {
    color: '#64748b',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  changePasswordButton: {
    display: 'inline-flex',
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
  passwordForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155',
  },
  passwordInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    paddingRight: '3rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
  },
  inputError: {
    width: '100%',
    padding: '0.75rem',
    paddingRight: '3rem',
    border: '2px solid #ef4444',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
  },
  eyeButton: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
  },
  errorText: {
    fontSize: '0.75rem',
    color: '#ef4444',
  },
  helpText: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
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
  saveButton: {
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
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#d1fae5',
    border: '1px solid #10b981',
    borderRadius: '0.5rem',
    color: '#065f46',
    marginBottom: '1.5rem',
  },
  successIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  errorAlert: {
    padding: '1rem',
    backgroundColor: '#fee2e2',
    border: '1px solid #ef4444',
    borderRadius: '0.5rem',
    color: '#991b1b',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.125rem',
    color: '#64748b',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.125rem',
    color: '#ef4444',
  },
};

export default ClientProfile;

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Package, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Vérifier la validité du token au chargement
    const verifyToken = async () => {
      if (!token) {
        setStatus({
          type: 'error',
          message: 'Token de réinitialisation manquant'
        });
        setIsValidating(false);
        return;
      }

      try {
        const response = await api.get(`/auth/verify-reset-token/${token}`);
        if (response.data.valid) {
          setTokenValid(true);
          setEmail(response.data.email);
        } else {
          setStatus({
            type: 'error',
            message: response.data.message || 'Ce lien de réinitialisation est invalide ou a expiré.'
          });
        }
      } catch (error) {
        setStatus({
          type: 'error',
          message: 'Impossible de vérifier le lien de réinitialisation.'
        });
      } finally {
        setIsValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Validations
    if (password.length < 6) {
      setStatus({
        type: 'error',
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        new_password: password
      });

      setStatus({
        type: 'success',
        message: 'Mot de passe réinitialisé avec succès ! Redirection...'
      });

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '40px',
      width: '100%',
      maxWidth: '450px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    logoText: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#3b82f6',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#334155',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      position: 'absolute',
      left: '12px',
      color: '#94a3b8',
    },
    eyeIcon: {
      position: 'absolute',
      right: '12px',
      color: '#94a3b8',
      cursor: 'pointer',
    },
    input: {
      width: '100%',
      padding: '12px 45px 12px 45px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s',
    },
    submitButton: {
      padding: '14px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '10px',
    },
    message: {
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    successMessage: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #10b981',
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #ef4444',
    },
    backLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '20px',
      color: '#64748b',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s',
    },
    spinner: {
      textAlign: 'center',
      padding: '40px',
      color: '#64748b',
    },
  };

  if (isValidating) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}>
            <p>Vérification du lien...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoWrapper}>
              <Package size={32} color="#3b82f6" />
              <span style={styles.logoText}>NEWSTAQ</span>
            </div>
            <h1 style={styles.title}>Lien invalide</h1>
          </div>

          <div style={{...styles.message, ...styles.errorMessage}}>
            {status.message}
          </div>

          <Link 
            to="/forgot-password" 
            style={{...styles.submitButton, textAlign: 'center', textDecoration: 'none', marginTop: '20px'}}
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoWrapper}>
            <Package size={32} color="#3b82f6" />
            <span style={styles.logoText}>NEWSTAQ</span>
          </div>
          <h1 style={styles.title}>Nouveau mot de passe</h1>
          <p style={styles.subtitle}>
            Pour : {email}
          </p>
        </div>

        {status.message && (
          <div style={{
            ...styles.message,
            ...(status.type === 'success' ? styles.successMessage : styles.errorMessage)
          }}>
            {status.type === 'success' && <CheckCircle size={18} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nouveau mot de passe</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmer le mot de passe</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez votre mot de passe"
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <div 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || status.type === 'success'}
            style={{
              ...styles.submitButton,
              opacity: (isSubmitting || status.type === 'success') ? 0.7 : 1,
              cursor: (isSubmitting || status.type === 'success') ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => !isSubmitting && status.type !== 'success' && (e.target.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => !isSubmitting && status.type !== 'success' && (e.target.style.backgroundColor = '#3b82f6')}
          >
            {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <Link 
          to="/login" 
          style={styles.backLink}
          onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.target.style.color = '#64748b'}
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, Warehouse, ShoppingCart, TrendingUp, 
  BarChart3, Clock, Shield, Zap, ChevronRight,
  Check, Mail, Phone, MapPin, User, Building, Menu, X
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://api.newstaq.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: 'Merci pour votre demande ! Notre équipe vous contactera sous 24h.'
        });
        setFormData({ name: '', company: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(data.detail || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer ou nous contacter à contact@newstaq.com'
      });
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour obtenir les styles responsives
  const getStyles = () => ({
    container: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
    },
    header: {
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      zIndex: 1000,
      padding: isMobile ? '0.75rem 0' : '1rem 0',
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isMobile ? '0 1rem' : '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '0.5rem' : '0.75rem',
    },
    logoText: {
      fontSize: isMobile ? '1.25rem' : '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    hamburger: {
      background: 'none',
      border: 'none',
      color: '#475569',
      cursor: 'pointer',
      padding: '0.5rem',
      display: isMobile ? 'block' : 'none',
    },
    nav: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: '2rem',
    },
    navLink: {
      color: '#475569',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'color 0.2s',
      cursor: 'pointer',
    },
    loginButton: {
      padding: '0.625rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    mobileMenu: {
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      padding: '1rem',
      gap: '0.75rem',
    },
    mobileNavLink: {
      color: '#475569',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      transition: 'background 0.2s',
    },
    mobileLoginButton: {
      padding: '0.875rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
    hero: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: isMobile ? '3rem 1rem' : '6rem 2rem',
    },
    heroContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      textAlign: 'center',
    },
    heroTitle: {
      fontSize: isMobile ? '2rem' : (isTablet ? '3rem' : '4rem'),
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: isMobile ? '1rem' : '1.5rem',
      lineHeight: 1.2,
    },
    heroSubtitle: {
      fontSize: isMobile ? '1rem' : '1.25rem',
      color: '#475569',
      maxWidth: isMobile ? '100%' : '800px',
      margin: isMobile ? '0 auto 2rem' : '0 auto 3rem',
      lineHeight: 1.7,
      padding: isMobile ? '0 0.5rem' : '0',
    },
    heroButtons: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '1rem',
      justifyContent: 'center',
      marginBottom: isMobile ? '3rem' : '4rem',
      padding: isMobile ? '0 1rem' : '0',
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: isMobile ? '1rem 1.5rem' : '1rem 2rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s',
      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
    },
    secondaryButton: {
      padding: isMobile ? '1rem 1.5rem' : '1rem 2rem',
      backgroundColor: 'white',
      color: '#3b82f6',
      border: '2px solid #3b82f6',
      borderRadius: '0.75rem',
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    heroStats: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
      gap: isMobile ? '2rem' : '4rem',
      padding: isMobile ? '0 1rem' : '0',
    },
    stat: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: isMobile ? '2rem' : '3rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    statLabel: {
      fontSize: isMobile ? '0.875rem' : '1rem',
      color: '#64748b',
      marginTop: '0.5rem',
    },
    section: {
      padding: isMobile ? '3rem 1rem' : '6rem 2rem',
    },
    sectionContent: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: isMobile ? '2rem' : '3rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: isMobile ? '1rem' : '1.5rem',
      color: '#0f172a',
    },
    sectionSubtitle: {
      fontSize: isMobile ? '1rem' : '1.25rem',
      color: '#64748b',
      textAlign: 'center',
      maxWidth: isMobile ? '100%' : '600px',
      margin: isMobile ? '0 auto 3rem' : '0 auto 4rem',
      padding: isMobile ? '0 0.5rem' : '0',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
      gap: isMobile ? '1.5rem' : '2rem',
    },
    featureCard: {
      background: 'white',
      padding: isMobile ? '1.5rem' : '2rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s',
    },
    featureIcon: {
      width: isMobile ? '2.5rem' : '3rem',
      height: isMobile ? '2.5rem' : '3rem',
      backgroundColor: '#eff6ff',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem',
    },
    featureTitle: {
      fontSize: isMobile ? '1.125rem' : '1.25rem',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.75rem',
    },
    featureDescription: {
      fontSize: isMobile ? '0.875rem' : '1rem',
      color: '#64748b',
      lineHeight: 1.6,
    },
    benefitsSection: {
      backgroundColor: '#f8fafc',
      padding: isMobile ? '3rem 1rem' : '6rem 2rem',
    },
    benefitsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : 'repeat(2, 1fr)'),
      gap: isMobile ? '1.5rem' : '2rem',
    },
    pricingSection: {
      padding: isMobile ? '3rem 1rem' : '6rem 2rem',
      backgroundColor: 'white',
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
      gap: isMobile ? '1.5rem' : '2rem',
    },
    pricingCard: {
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '1rem',
      padding: isMobile ? '1.5rem' : '2rem',
      transition: 'all 0.3s',
    },
    contactSection: {
      backgroundColor: '#f8fafc',
      padding: isMobile ? '3rem 1rem' : '6rem 2rem',
    },
    contactContainer: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : '2fr 1fr'),
      gap: isMobile ? '2rem' : '4rem',
    },
    contactForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formGroup: {
      marginBottom: '0',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#334155',
      fontWeight: '500',
      fontSize: isMobile ? '0.875rem' : '1rem',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: isMobile ? '0.875rem 1rem 0.875rem 3rem' : '1rem 1rem 1rem 3rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: isMobile ? '0.875rem' : '1rem',
      transition: 'border-color 0.2s',
    },
    textarea: {
      width: '100%',
      padding: isMobile ? '0.875rem 1rem' : '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: isMobile ? '0.875rem' : '1rem',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s',
      resize: 'vertical',
    },
    submitButton: {
      width: '100%',
      padding: isMobile ? '1rem' : '1.25rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    formMessage: {
      padding: isMobile ? '0.875rem' : '1rem',
      borderRadius: '0.5rem',
      textAlign: 'center',
      fontSize: isMobile ? '0.875rem' : '1rem',
      marginTop: '1rem',
    },
    contactInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    contactInfoTitle: {
      fontSize: isMobile ? '1.5rem' : '1.75rem',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '1rem',
    },
    contactInfoItem: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
    },
    contactInfoLabel: {
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: '0.05em',
    },
    contactInfoValue: {
      fontSize: isMobile ? '1rem' : '1.125rem',
      color: '#0f172a',
      textDecoration: 'none',
      fontWeight: '500',
    },
    footer: {
      backgroundColor: '#0f172a',
      color: 'white',
      padding: isMobile ? '3rem 1rem 1.5rem' : '4rem 2rem 2rem',
    },
    footerContent: {
      maxWidth: '1400px',
      margin: '0 auto 2rem',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
      gap: isMobile ? '2rem' : '3rem',
    },
    footerSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    footerTitle: {
      fontSize: isMobile ? '1rem' : '1.125rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: 'white',
    },
    footerLink: {
      color: '#94a3b8',
      textDecoration: 'none',
      fontSize: isMobile ? '0.875rem' : '1rem',
      transition: 'color 0.2s',
    },
    footerBottom: {
      maxWidth: '1400px',
      margin: '0 auto',
      paddingTop: '1.5rem',
      borderTop: '1px solid #1e293b',
      textAlign: 'center',
    },
    footerCopyright: {
      color: '#64748b',
      fontSize: isMobile ? '0.75rem' : '0.875rem',
    },
  });

  const styles = getStyles();

  const features = [
    {
      icon: Package,
      title: 'Gestion des Produits',
      description: 'Catalogue complet avec codes-barres, catégories et traçabilité'
    },
    {
      icon: Warehouse,
      title: 'Inventaire Temps Réel',
      description: 'Suivi précis de votre stock par emplacement et lot'
    },
    {
      icon: ShoppingCart,
      title: 'Gestion des Commandes',
      description: 'Du picking à l\'expédition, workflow optimisé'
    },
    {
      icon: TrendingUp,
      title: '25+ Intégrations',
      description: 'Shopify, Amazon, Zalando, Chronopost et plus'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Tableaux de bord et statistiques en temps réel'
    },
    {
      icon: Clock,
      title: 'Facturation Auto',
      description: 'Génération automatique basée sur l\'activité'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Sécurité Maximale',
      description: 'Données chiffrées, sauvegardes automatiques, conformité RGPD'
    },
    {
      icon: Zap,
      title: 'Déploiement Rapide',
      description: 'Opérationnel en moins de 48h, formation incluse'
    },
    {
      icon: Check,
      title: 'Support Réactif',
      description: 'Équipe dédiée disponible 24/7 pour vous accompagner'
    },
    {
      icon: TrendingUp,
      title: 'Scalabilité',
      description: 'Grandit avec votre business, de 100 à 100 000 commandes/mois'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <Package size={isMobile ? 28 : 32} color="#3b82f6" />
            <span style={styles.logoText}>NEWSTAQ</span>
          </div>
          
          {/* Hamburger button for mobile */}
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={styles.hamburger}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          
          {/* Desktop navigation */}
          <nav style={styles.nav}>
            <a href="#features" style={styles.navLink}>Fonctionnalités</a>
            <a href="#benefits" style={styles.navLink}>Avantages</a>
            <a href="#pricing" style={styles.navLink}>Tarifs</a>
            <a href="#contact" style={styles.navLink}>Contact</a>
            <button onClick={() => navigate('/login')} style={styles.loginButton}>
              Connexion
            </button>
          </nav>
        </div>
        
        {/* Mobile menu */}
        {isMobile && isMobileMenuOpen && (
          <nav style={styles.mobileMenu}>
            <a href="#features" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Fonctionnalités</a>
            <a href="#benefits" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Avantages</a>
            <a href="#pricing" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Tarifs</a>
            <a href="#contact" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} style={styles.mobileLoginButton}>
              Connexion
            </button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            La Solution WMS 3PL{isMobile ? ' ' : <br />}
            Nouvelle Génération
          </h1>
          <p style={styles.heroSubtitle}>
            Optimisez votre logistique avec notre plateforme tout-en-un. Gestion intelligente de vos stocks, commandes et expéditions.
          </p>
          <div style={styles.heroButtons}>
            <button onClick={() => navigate('/login')} style={styles.ctaButton}>
              Démarrer Gratuitement
              <ChevronRight size={20} />
            </button>
            <a href="#contact" style={styles.secondaryButton}>
              Demander une Démo
            </a>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>99.9%</div>
              <div style={styles.statLabel}>Disponibilité</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>2M+</div>
              <div style={styles.statLabel}>Commandes/mois</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>50+</div>
              <div style={styles.statLabel}>Clients 3PL</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Fonctionnalités Complètes</h2>
          <p style={styles.sectionSubtitle}>
            Tous les outils dont vous avez besoin pour gérer votre logistique efficacement
          </p>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>
                  <feature.icon size={isMobile ? 24 : 28} color="#3b82f6" />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={styles.benefitsSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Pourquoi NEWSTAQ ?</h2>
          <p style={styles.sectionSubtitle}>
            Une solution pensée pour votre réussite
          </p>
          <div style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>
                  <benefit.icon size={isMobile ? 24 : 28} color="#10b981" />
                </div>
                <h3 style={styles.featureTitle}>{benefit.title}</h3>
                <p style={styles.featureDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={styles.pricingSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Tarifs Transparents</h2>
          <p style={styles.sectionSubtitle}>
            Des prix adaptés à votre volume d'activité
          </p>
          <div style={styles.pricingGrid}>
            <div style={styles.pricingCard}>
              <h3 style={{ ...styles.featureTitle, marginBottom: '1rem' }}>Starter</h3>
              <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
                149€
                <span style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'normal', color: '#64748b' }}>/mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Jusqu'à 500 références</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>500 commandes/mois</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Support email</span>
                </li>
              </ul>
            </div>
            <div style={styles.pricingCard}>
              <h3 style={{ ...styles.featureTitle, marginBottom: '1rem' }}>Business</h3>
              <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
                349€
                <span style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'normal', color: '#64748b' }}>/mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Jusqu'à 2000 références</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>2000 commandes/mois</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Support prioritaire</span>
                </li>
              </ul>
            </div>
            <div style={styles.pricingCard}>
              <h3 style={{ ...styles.featureTitle, marginBottom: '1rem' }}>Pro</h3>
              <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
                649€
                <span style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 'normal', color: '#64748b' }}>/mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Références illimitées</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>5000 commandes/mois</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Support dédié 24/7</span>
                </li>
              </ul>
            </div>
            <div style={styles.pricingCard}>
              <h3 style={{ ...styles.featureTitle, marginBottom: '1rem' }}>Enterprise</h3>
              <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
                Sur mesure
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Solution personnalisée</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Volume illimité</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Check size={20} color="#10b981" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>Account manager dédié</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.contactSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Recevez Votre Devis Gratuit</h2>
          <p style={styles.sectionSubtitle}>
            Remplissez le formulaire ci-dessous et notre équipe vous contactera sous 24h
          </p>
          <div style={styles.contactContainer}>
            <form onSubmit={handleSubmit} style={styles.contactForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom complet *</label>
                <div style={styles.inputWrapper}>
                  <User size={20} color="#64748b" style={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={styles.input}
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Entreprise *</label>
                <div style={styles.inputWrapper}>
                  <Building size={20} color="#64748b" style={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    style={styles.input}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email professionnel *</label>
                <div style={styles.inputWrapper}>
                  <Mail size={20} color="#64748b" style={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={styles.input}
                    placeholder="contact@entreprise.com"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Téléphone</label>
                <div style={styles.inputWrapper}>
                  <Phone size={20} color="#64748b" style={styles.inputIcon} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={styles.input}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={styles.textarea}
                  placeholder="Parlez-nous de votre projet..."
                  rows={isMobile ? "3" : "4"}
                />
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.submitButton,
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Recevoir mon Devis Gratuit sous 24h'}
                {!isSubmitting && <ChevronRight size={20} />}
              </button>

              {formStatus.message && (
                <div style={{
                  ...styles.formMessage,
                  backgroundColor: formStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: formStatus.type === 'success' ? '#065f46' : '#991b1b',
                }}>
                  {formStatus.message}
                </div>
              )}
            </form>

            <div style={styles.contactInfo}>
              <h3 style={styles.contactInfoTitle}>Nous Contacter</h3>
              
              <div style={styles.contactInfoItem}>
                <Mail size={isMobile ? 20 : 24} color="#3b82f6" style={{ flexShrink: 0 }} />
                <div>
                  <div style={styles.contactInfoLabel}>Email</div>
                  <a href="mailto:contact@newstaq.com" style={styles.contactInfoValue}>
                    contact@newstaq.com
                  </a>
                </div>
              </div>

              <div style={styles.contactInfoItem}>
                <MapPin size={isMobile ? 20 : 24} color="#3b82f6" style={{ flexShrink: 0 }} />
                <div>
                  <div style={styles.contactInfoLabel}>Adresse</div>
                  <div style={styles.contactInfoValue}>
                    1 rue d'Ableval<br />
                    95200 Sarcelles<br />
                    FRANCE
                  </div>
                </div>
              </div>

              <div style={styles.contactInfoItem}>
                <Clock size={isMobile ? 20 : 24} color="#3b82f6" style={{ flexShrink: 0 }} />
                <div>
                  <div style={styles.contactInfoLabel}>Horaires</div>
                  <div style={styles.contactInfoValue}>
                    Lun - Ven : 9h - 18h<br />
                    Réponse sous 24h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>NEWSTAQ</h4>
            <p style={{ ...styles.footerLink, cursor: 'default' }}>
              Votre partenaire logistique pour une gestion d'entrepôt optimale
            </p>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Produit</h4>
            <a href="#features" style={styles.footerLink}>Fonctionnalités</a>
            <a href="#pricing" style={styles.footerLink}>Tarifs</a>
            <a href="#contact" style={styles.footerLink}>Démo</a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Entreprise</h4>
            <a href="#contact" style={styles.footerLink}>Contact</a>
            <a href="#" style={styles.footerLink}>À propos</a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Légal</h4>
            <Link to="/mentions-legales" style={styles.footerLink}>Mentions légales</Link>
            <Link to="/cgv" style={styles.footerLink}>CGV</Link>
            <Link to="/rgpd" style={styles.footerLink}>RGPD</Link>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>
            © 2026 NEWSTAQ. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

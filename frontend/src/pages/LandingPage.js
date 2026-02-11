import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Warehouse, ShoppingCart, TrendingUp, 
  BarChart3, Clock, Shield, Zap, ChevronRight,
  Check, Mail, Phone, MapPin, User, Building
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre demande ! Notre équipe vous contactera sous 24h.');
    setFormData({ name: '', company: '', email: '', phone: '', message: '' });
  };

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
      icon: TrendingUp,
      title: 'Évolutif',
      description: 'S\'adapte à votre croissance, de 100 à 100 000 commandes/mois'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header / Navigation */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <Package size={32} color="#3b82f6" />
            <span style={styles.logoText}>NEWSTAQ</span>
          </div>
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
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            La Solution WMS 3PL<br />
            Nouvelle Génération
          </h1>
          <p style={styles.heroSubtitle}>
            Optimisez votre logistique avec NEWSTAQ : gestion d'entrepôt intelligente, 
            intégrations e-commerce complètes et portail client dédié.
          </p>
          <div style={styles.heroButtons}>
            <a href="#contact" style={styles.ctaButton}>
              Demander une Démo
              <ChevronRight size={20} />
            </a>
            <button onClick={() => navigate('/login')} style={styles.secondaryButton}>
              Accéder à l'App
            </button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>25+</div>
              <div style={styles.statLabel}>Intégrations</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>99.9%</div>
              <div style={styles.statLabel}>Disponibilité</div>
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
            Tout ce dont vous avez besoin pour gérer efficacement votre activité 3PL
          </p>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} style={styles.featureCard}>
                  <div style={styles.featureIcon}>
                    <Icon size={28} color="#3b82f6" />
                  </div>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDescription}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={styles.benefitsSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Pourquoi Choisir NEWSTAQ ?</h2>
          <div style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} style={styles.benefitCard}>
                  <Icon size={48} color="#3b82f6" />
                  <h3 style={styles.benefitTitle}>{benefit.title}</h3>
                  <p style={styles.benefitDescription}>{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Showcase */}
      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Intégrations E-commerce</h2>
          <p style={styles.sectionSubtitle}>
            Connectez vos boutiques en ligne et marketplaces en quelques clics
          </p>
          <div style={styles.integrationsGrid}>
            <div style={styles.integrationTag}>Shopify</div>
            <div style={styles.integrationTag}>WooCommerce</div>
            <div style={styles.integrationTag}>PrestaShop</div>
            <div style={styles.integrationTag}>Magento</div>
            <div style={styles.integrationTag}>BigCommerce</div>
            <div style={styles.integrationTag}>Amazon</div>
            <div style={styles.integrationTag}>Zalando</div>
            <div style={styles.integrationTag}>Cdiscount</div>
            <div style={styles.integrationTag}>TikTok Shop</div>
            <div style={styles.integrationTag}>Chronopost</div>
            <div style={styles.integrationTag}>Colissimo</div>
            <div style={styles.integrationTag}>DHL</div>
            <div style={styles.integrationTag}>UPS</div>
            <div style={styles.integrationTag}>FedEx</div>
            <div style={styles.integrationTag}>Mondial Relay</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={styles.pricingSection}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Tarification Transparente</h2>
          <p style={styles.sectionSubtitle}>
            Adapté à votre volume d'activité, sans engagement
          </p>
          <div style={styles.pricingGrid}>
            <div style={styles.pricingCard}>
              <h3 style={styles.pricingTitle}>Starter</h3>
              <div style={styles.pricingPrice}>
                <span style={styles.priceAmount}>Sur Devis</span>
              </div>
              <ul style={styles.pricingFeatures}>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Jusqu'à 500 commandes/mois
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  5 intégrations e-commerce
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Support email
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Portail client inclus
                </li>
              </ul>
              <a href="#contact" style={styles.pricingButton}>
                Demander un Devis
              </a>
            </div>

            <div style={{...styles.pricingCard, ...styles.pricingCardFeatured}}>
              <div style={styles.popularBadge}>Populaire</div>
              <h3 style={styles.pricingTitle}>Business</h3>
              <div style={styles.pricingPrice}>
                <span style={styles.priceAmount}>Sur Devis</span>
              </div>
              <ul style={styles.pricingFeatures}>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Jusqu'à 5000 commandes/mois
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Intégrations illimitées
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Support prioritaire 24/7
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  API personnalisée
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Formation sur mesure
                </li>
              </ul>
              <a href="#contact" style={styles.pricingButtonFeatured}>
                Demander un Devis
              </a>
            </div>

            <div style={styles.pricingCard}>
              <h3 style={styles.pricingTitle}>Enterprise</h3>
              <div style={styles.pricingPrice}>
                <span style={styles.priceAmount}>Sur Devis</span>
              </div>
              <ul style={styles.pricingFeatures}>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Volume illimité
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Multi-entrepôts
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Account manager dédié
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  SLA garanti
                </li>
                <li style={styles.pricingFeature}>
                  <Check size={20} color="#10b981" />
                  Développements sur mesure
                </li>
              </ul>
              <a href="#contact" style={styles.pricingButton}>
                Nous Contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
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
                  rows="4"
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                Recevoir mon Devis Gratuit sous 24h
                <ChevronRight size={20} />
              </button>
            </form>

            <div style={styles.contactInfo}>
              <h3 style={styles.contactInfoTitle}>Nous Contacter</h3>
              
              <div style={styles.contactInfoItem}>
                <Mail size={24} color="#3b82f6" />
                <div>
                  <div style={styles.contactInfoLabel}>Email</div>
                  <a href="mailto:contact@newstaq.com" style={styles.contactInfoValue}>
                    contact@newstaq.com
                  </a>
                </div>
              </div>

              <div style={styles.contactInfoItem}>
                <MapPin size={24} color="#3b82f6" />
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
                <Clock size={24} color="#3b82f6" />
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
            <div style={styles.footerLogo}>
              <Package size={28} color="#3b82f6" />
              <span style={styles.footerLogoText}>NEWSTAQ</span>
            </div>
            <p style={styles.footerDescription}>
              Solution WMS 3PL nouvelle génération pour optimiser votre logistique.
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
            <a href="#" style={styles.footerLink}>Mentions légales</a>
            <a href="#" style={styles.footerLink}>CGV</a>
            <a href="#" style={styles.footerLink}>RGPD</a>
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

const styles = {
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
    padding: '1rem 0',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  nav: {
    display: 'flex',
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
  hero: {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    padding: '6rem 2rem',
  },
  heroContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#475569',
    maxWidth: '800px',
    margin: '0 auto 3rem',
    lineHeight: 1.7,
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '4rem',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'white',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  heroStats: {
    display: 'flex',
    gap: '4rem',
    justifyContent: 'center',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '0.5rem',
  },
  section: {
    padding: '6rem 2rem',
  },
  sectionContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  sectionSubtitle: {
    fontSize: '1.25rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '4rem',
    maxWidth: '700px',
    margin: '0 auto 4rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  featureIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: '#dbeafe',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '0.75rem',
  },
  featureDescription: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: 1.6,
  },
  benefitsSection: {
    padding: '6rem 2rem',
    backgroundColor: '#f8fafc',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
  },
  benefitCard: {
    textAlign: 'center',
  },
  benefitTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0f172a',
    margin: '1.5rem 0 1rem',
  },
  benefitDescription: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: 1.6,
  },
  integrationsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  },
  integrationTag: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '9999px',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  pricingSection: {
    padding: '6rem 2rem',
    backgroundColor: '#f8fafc',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pricingCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2.5rem',
    border: '2px solid #e2e8f0',
    position: 'relative',
    transition: 'all 0.3s',
  },
  pricingCardFeatured: {
    border: '2px solid #3b82f6',
    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.375rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  pricingTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '1rem',
  },
  pricingPrice: {
    marginBottom: '2rem',
  },
  priceAmount: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  pricingFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  pricingFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 0',
    fontSize: '1rem',
    color: '#475569',
  },
  pricingButton: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: 'white',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pricingButtonFeatured: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  contactSection: {
    padding: '6rem 2rem',
  },
  contactContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '4rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  contactForm: {
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
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#334155',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '1rem',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  contactInfoTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '1rem',
  },
  contactInfoItem: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  contactInfoLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginBottom: '0.25rem',
  },
  contactInfoValue: {
    fontSize: '1.1rem',
    color: '#0f172a',
    fontWeight: '500',
    textDecoration: 'none',
  },
  footer: {
    backgroundColor: '#0f172a',
    color: 'white',
    padding: '4rem 2rem 2rem',
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '3rem',
    marginBottom: '3rem',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  footerLogoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
  },
  footerDescription: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  footerTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  footerBottom: {
    maxWidth: '1400px',
    margin: '0 auto',
    paddingTop: '2rem',
    borderTop: '1px solid #1e293b',
    textAlign: 'center',
  },
  footerCopyright: {
    color: '#64748b',
    fontSize: '0.95rem',
  },
};

export default LandingPage;

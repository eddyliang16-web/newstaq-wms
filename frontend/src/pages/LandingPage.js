import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { 
  Package, Warehouse, ShoppingCart, TrendingUp, 
  BarChart3, Clock, Shield, Zap, ChevronRight,
  Check, Mail, Phone, MapPin, User, Building, Menu, X
} from 'lucide-react';

// Inject responsive CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 768px) {
        body { font-size: 14px; }
        h1 { font-size: 2rem !important; }
        h2 { font-size: 1.5rem !important; }
      }
    `;
    document.head.appendChild(style);
  }

  const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          message: t('landing.contact.form.success')
        });
        setFormData({ name: '', company: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(data.detail || t('landing.contact.form.error'));
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: t('landing.contact.form.error')
      });
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Package,
      key: 'products'
    },
    {
      icon: Warehouse,
      key: 'inventory'
    },
    {
      icon: ShoppingCart,
      key: 'orders'
    },
    {
      icon: TrendingUp,
      key: 'integrations'
    },
    {
      icon: BarChart3,
      key: 'analytics'
    },
    {
      icon: Clock,
      key: 'billing'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      key: 'security'
    },
    {
      icon: Zap,
      key: 'deployment'
    },
    {
      icon: Check,
      key: 'support'
    },
    {
      icon: TrendingUp,
      key: 'scalability'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header / Navigation */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
             <Package size={isMobile ? 28 : 32} color="#3b82f6" />
            <span style={styles.logoText}>NEWSTAQ</span>
          </div>
          {isMobile && (
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={styles.hamburger}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          {!isMobile && (
          <nav style={styles.nav}>
          <a href="#features" style={styles.navLink}>{t('landing.header.features')}</a>
          <a href="#benefits" style={styles.navLink}>{t('landing.header.benefits')}</a>
          <a href="#pricing" style={styles.navLink}>{t('landing.header.pricing')}</a>
          <a href="#contact" style={styles.navLink}>{t('landing.header.contact')}</a>
          <LanguageSwitcher />  {/* ← AJOUTER */}
          <button onClick={() => navigate('/login')} style={styles.loginButton}>
            {t('landing.header.login')}
          </button>
        </nav>
          )}
        </div>
        {isMobile && isMobileMenuOpen && (
          <nav style={styles.mobileMenu}>
            <a href="#features" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('landing.header.features')}</a>
            <a href="#benefits" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('landing.header.benefits')}</a>
            <a href="#pricing" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('landing.header.pricing')}</a>
            <a href="#contact" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('landing.header.contact')}</a>
            <LanguageSwitcher isMobile={true} />
            <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} style={styles.mobileLoginButton}>{t('landing.header.login')}</button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>
          {t('landing.hero.title')}
        </h1>
        <p style={styles.heroSubtitle}>
          {t('landing.hero.subtitle')}
        </p>
          <div style={styles.heroButtons}>
          <button onClick={() => navigate('/login')} style={styles.ctaButton}>
           {t('landing.hero.ctaApp')}
          </button>
          <a href="#contact" style={styles.secondaryButton}>
            {t('landing.hero.ctaDemo')}
          </a>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>25+</div>
              <div style={styles.statLabel}>{t('landing.hero.stats.integrations')}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>99.9%</div>
              <div style={styles.statLabel}>{t('landing.hero.stats.availability')}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>{t('landing.hero.stats.support')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionContent}>
        <h2 style={styles.sectionTitle}>{t('landing.features.title')}</h2>
          <p style={styles.sectionSubtitle}>
            {t('landing.features.subtitle')}
          </p>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>
                  <feature.icon size={28} color="#3b82f6" />
                </div>
              <h3 style={styles.featureTitle}>{t(`landing.features.${feature.key}.title`)}</h3>
            <p style={styles.featureDescription}>{t(`landing.features.${feature.key}.description`)}</p>
          </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={styles.benefitsSection}>
        <div style={styles.sectionContent}>
        <h2 style={styles.sectionTitle}>{t('landing.benefits.title')}</h2>
          <div style={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
         <div key={index} style={styles.benefitCard}>
          <div style={styles.benefitIcon}>
           <benefit.icon size={28} color="#10b981" />
        </div>
          <h3 style={styles.benefitTitle}>{t(`landing.benefits.${benefit.key}.title`)}</h3>
          <p style={styles.benefitDescription}>{t(`landing.benefits.${benefit.key}.description`)}</p>
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
        <h2 style={styles.sectionTitle}>{t('landing.pricing.title')}</h2>
        <p style={styles.sectionSubtitle}>
          {t('landing.pricing.subtitle')}
        </p>
          
          <div style={styles.pricingCategoriesGrid}>
            {/* Stockage */}
            <div style={styles.categoryCard}>
              <div style={{...styles.categoryHeader, backgroundColor: '#3b82f6'}}>
                <span style={styles.categoryIcon}>📦</span>
                <h3 style={styles.categoryTitle}>{t('landing.pricing.storage.title')}</h3>
              </div>
              <div style={styles.categoryBody}>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.storage.pallet')}</span>
                  <span style={styles.priceValue}>10€ / mois</span>
                </div>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.storage.cubic')}</span>
                  <span style={styles.priceValue}>7€ / m³ / mois</span>
                </div>
              </div>
            </div>

            {/* Entrée de Marchandises */}
            <div style={styles.categoryCard}>
              <div style={{...styles.categoryHeader, backgroundColor: '#10b981'}}>
                <span style={styles.categoryIcon}>📥</span>
                <h3 style={styles.categoryTitle}>{t('landing.pricing.inbound.title')}</h3>
              </div>
              <div style={styles.categoryBody}>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.inbound.pallet')}</span>
                  <span style={styles.priceValue}>3€ / palette</span>
                </div>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.inbound.parcel')}</span>
                  <span style={styles.priceValue}>1€ / colis</span>
                </div>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.inbound.entry')}</span>
                  <span style={styles.priceValue}>2,50€ / SKU</span>
                </div>
              </div>
            </div>

            {/* Sortie de Marchandises */}
            <div style={styles.categoryCard}>
              <div style={{...styles.categoryHeader, backgroundColor: '#f59e0b'}}>
                <span style={styles.categoryIcon}>📤</span>
                <h3 style={styles.categoryTitle}>{t('landing.pricing.outbound.title')}</h3>
              </div>
              <div style={styles.categoryBody}>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.outbound.pickpack')}</span>
                  <span style={styles.priceValue}>2,80€ / commande</span>
                </div>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.outbound.additional')}</span>
                  <span style={styles.priceValue}>+0,20€ / article</span>
                </div>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.outbound.custom')}</span>
                  <span style={styles.priceValue}>Sur devis</span>
                </div>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.outbound.packaging')}</span>
                  <span style={styles.priceValue}>Sur devis</span>
                </div>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.outbound.shipping')}</span>
                  <span style={styles.priceValue}>Selon transporteur</span>
                </div>
              </div>
            </div>

            {/* Gestion des Retours */}
            <div style={styles.categoryCard}>
              <div style={{...styles.categoryHeader, backgroundColor: '#8b5cf6'}}>
                <span style={styles.categoryIcon}>🔄</span>
                <h3 style={styles.categoryTitle}>{t('landing.pricing.returns.title')}</h3>
              </div>
              <div style={styles.categoryBody}>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.returns.processing')}</span>
                  <span style={styles.priceValue}>2,20€ / retour</span>
                </div>
              </div>
            </div>

            {/* Assurance */}
            <div style={styles.categoryCard}>
              <div style={{...styles.categoryHeader, backgroundColor: '#ef4444'}}>
                <span style={styles.categoryIcon}>🛡️</span>
                <h3 style={styles.categoryTitle}>{t('landing.pricing.insurance.title')}</h3>
              </div>
              <div style={styles.categoryBody}>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.insurance.description')}</span>
                  <span style={styles.priceValue}>Sur devis</span>
                </div>
              </div>
            </div>

            {/* Mise en Place */}
            <div style={styles.categoryCard}>
              <div style={{...styles.categoryHeader, backgroundColor: '#06b6d4'}}>
                <span style={styles.categoryIcon}>🚀</span>
                <h3 style={styles.categoryTitle}>{t('landing.pricing.setup.title')}</h3>
              </div>
              <div style={styles.categoryBody}>
                <div style={styles.priceItem}>
                <span style={styles.priceService}>{t('landing.pricing.setup.fee')}</span>
                  <span style={styles.priceValue}>49€</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={styles.pricingCTA}>
            <p style={styles.ctaText}>
            {t('landing.pricing.cta.text')}
            </p>
            <a href="#contact" style={styles.ctaButton}>
            {t('landing.pricing.cta.button')}
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" style={styles.contactSection}>
        <div style={styles.sectionContent}>
        <h2 style={styles.sectionTitle}>{t('landing.contact.title')}</h2>
        <p style={styles.sectionSubtitle}>
          {t('landing.contact.subtitle')}
        </p>
          <div style={styles.contactContainer}>
            <form onSubmit={handleSubmit} style={styles.contactForm}>
            <div style={styles.formGroup}>
            <label style={styles.label}>{t('landing.contact.form.name')} *</label>
              <div style={styles.inputWrapper}>
               <User size={20} color="#64748b" style={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                  placeholder={t('landing.contact.form.placeholder.name')}
                />
              </div>
            </div>

              <div style={styles.formGroup}>
              <label style={styles.label}>{t('landing.contact.form.company')} *</label>
              <div style={styles.inputWrapper}>
                <Building size={20} color="#64748b" style={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  style={styles.input}
                  placeholder={t('landing.contact.form.placeholder.company')}
                />
              </div>
            </div>

              <div style={styles.formGroup}>
              <label style={styles.label}>{t('landing.contact.form.email')} *</label>
              <div style={styles.inputWrapper}>
                <Mail size={20} color="#64748b" style={styles.inputIcon} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={styles.input}
                  placeholder={t('landing.contact.form.placeholder.email')}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
            <label style={styles.label}>{t('landing.contact.form.phone')}</label>
            <div style={styles.inputWrapper}>
              <Phone size={20} color="#64748b" style={styles.inputIcon} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={styles.input}
                placeholder={t('landing.contact.form.placeholder.phone')}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
          <label style={styles.label}>{t('landing.contact.form.message')}</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            style={styles.textarea}
            placeholder={t('landing.contact.form.placeholder.message')}
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
            {isSubmitting ? t('landing.contact.form.submitting') : t('landing.contact.form.submit')}
            {!isSubmitting && <ChevronRight size={20} />}
          </button>

              {formStatus.message && (
                <div style={{
                  ...styles.formMessage,
                  backgroundColor: formStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: formStatus.type === 'success' ? '#065f46' : '#991b1b',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {formStatus.message}
                </div>
              )}
            </form>

            <div style={styles.contactInfo}>
              <h3 style={styles.contactInfoTitle}>{t('landing.contact.info.title')}</h3>
              
              <div style={styles.contactInfoItem}>
              <Mail size={isMobile ? 20 : 24} color="#3b82f6" style={{ flexShrink: 0 }} />
                <div>
                  <div style={styles.contactInfoLabel}>{t('landing.contact.info.email')}</div>
                  <a href="mailto:contact@newstaq.com" style={styles.contactInfoValue}>
                    contact@newstaq.com
                  </a>
                </div>
              </div>

              <div style={styles.contactInfoItem}>
                <MapPin size={24} color="#3b82f6" />
                <div>
                  <div style={styles.contactInfoLabel}>{t('landing.contact.info.address')}</div>
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
                  <div style={styles.contactInfoLabel}>{t('landing.contact.info.hours')}</div>
                  <div style={styles.contactInfoValue}>
                  {t('landing.contact.info.hoursValue')}
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
            {t('landing.footer.description')}
            </p>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>{t('landing.footer.product')}</h4>
            <a href="#features" style={styles.footerLink}>{t('landing.header.features')}</a>
            <a href="#pricing" style={styles.footerLink}>{t('landing.header.pricing')}</a>
            <a href="#contact" style={styles.footerLink}>{t('landing.footer.demo')}</a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>{t('landing.footer.company')}</h4>
            <a href="#contact" style={styles.footerLink}>{t('landing.header.contact')}</a>
            <a href="#" style={styles.footerLink}>{t('landing.footer.about')}</a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>{t('landing.footer.legal')}</h4>
            <Link to="/mentions-legales" style={styles.footerLink}>{t('landing.footer.mentions')}</Link>
            <Link to="/cgv" style={styles.footerLink}>{t('landing.footer.cgv')}</Link>
            <Link to="/rgpd" style={styles.footerLink}>{t('landing.footer.rgpd')}</Link>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>
          {t('landing.footer.copyright')}
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
  hamburger: {
    background: 'none',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    padding: '0.5rem',
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
  pricingCategoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto 4rem',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  categoryHeader: {
    padding: '1.5rem',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  categoryIcon: {
    fontSize: '2rem',
  },
  categoryTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
  },
  categoryBody: {
    padding: '1.5rem',
  },
  priceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1rem 0',
    borderBottom: '1px solid #e2e8f0',
  },
  priceService: {
    fontSize: '0.95rem',
    color: '#334155',
    flex: 1,
    paddingRight: '1rem',
  },
  priceValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0f172a',
    whiteSpace: 'nowrap',
  },
  pricingCTA: {
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaText: {
    fontSize: '1.25rem',
    color: '#475569',
    marginBottom: '1.5rem',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
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
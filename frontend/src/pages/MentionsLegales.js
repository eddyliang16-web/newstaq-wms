import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MentionsLegales = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Link to="/" style={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Retour à l'accueil</span>
        </Link>

        <h1 style={styles.title}>Mentions Légales</h1>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Éditeur du site</h2>
          <p>NEWSTAQ</p>
          <p>1 rue d'Ableval</p>
          <p>95200 Sarcelles, France</p>
          <p>Email : contact@newstaq.com</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <p>Render</p>
          <p>525 Brannan St, Suite 300</p>
          <p>San Francisco, CA 94107, États-Unis</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété exclusive de NEWSTAQ.
            Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Données personnelles</h2>
          <p>
            Pour en savoir plus sur la gestion de vos données personnelles et vos droits,
            consultez notre <Link to="/rgpd" style={styles.link}>politique de confidentialité</Link>.
          </p>
        </section>

        <div style={styles.footer}>
          <Link to="/mentions-legales" style={styles.footerLink}>Mentions légales</Link>
          <span style={styles.separator}>•</span>
          <Link to="/cgv" style={styles.footerLink}>CGV</Link>
          <span style={styles.separator}>•</span>
          <Link to="/rgpd" style={styles.footerLink}>RGPD</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '40px 20px',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3b82f6',
    textDecoration: 'none',
    marginBottom: '24px',
    fontSize: '14px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '32px',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '12px',
  },
  section: {
    marginBottom: '32px',
    lineHeight: '1.6',
    color: '#475569',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  footer: {
    marginTop: '48px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
    textAlign: 'center',
    fontSize: '14px',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    margin: '0 8px',
  },
  separator: {
    color: '#cbd5e1',
    margin: '0 8px',
  },
};

export default MentionsLegales;

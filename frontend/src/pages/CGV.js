import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CGV = () => {
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

        <h1 style={styles.title}>Conditions Générales de Vente</h1>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
            entre NEWSTAQ et ses clients dans le cadre de la fourniture de services de gestion logistique (WMS).
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>2. Services proposés</h2>
          <p>NEWSTAQ propose une plateforme SaaS de gestion d'entrepôt comprenant :</p>
          <ul>
            <li>Gestion des stocks et inventaires</li>
            <li>Gestion des commandes et expéditions</li>
            <li>Gestion des réceptions</li>
            <li>Intégrations avec plateformes e-commerce et transporteurs</li>
            <li>Tableaux de bord et reporting</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>3. Tarifs</h2>
          <p>
            Les tarifs sont indiqués en euros HT sur notre grille tarifaire.
            Ils comprennent les frais de plateforme selon le nombre de références et le volume mensuel.
          </p>
          <p>
            Des frais de mise en place de 49€ HT sont applicables lors de la souscription initiale.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>4. Modalités de paiement</h2>
          <p>
            Les factures sont émises mensuellement et payables sous 30 jours par virement bancaire ou prélèvement automatique.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>5. Durée et résiliation</h2>
          <p>
            Les contrats sont conclus pour une durée d'un mois renouvelable tacitement.
            Chaque partie peut résilier moyennant un préavis de 30 jours.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>6. Responsabilités</h2>
          <p>
            NEWSTAQ s'engage à fournir un service de qualité avec un taux de disponibilité de 99,5%.
            Notre responsabilité est limitée au montant des sommes versées au cours des 12 derniers mois.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>7. Données personnelles</h2>
          <p>
            Le traitement des données personnelles est conforme au RGPD.
            Consultez notre <Link to="/rgpd" style={styles.link}>politique de confidentialité</Link> pour plus d'informations.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>8. Droit applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit français.
            Tout litige sera soumis aux tribunaux compétents de Paris.
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

export default CGV;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RGPD = () => {
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

        <h1 style={styles.title}>Politique de Confidentialité (RGPD)</h1>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>1. Responsable du traitement</h2>
          <p>
            NEWSTAQ, situé au 1 rue d'Ableval, 95200 Sarcelles, France.
            <br />
            Contact : contact@newstaq.com
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul>
            <li>Données d'identification : nom, prénom, email, téléphone</li>
            <li>Données de connexion : adresse IP, logs de connexion</li>
            <li>Données d'utilisation : interactions avec la plateforme</li>
            <li>Données métier : produits, commandes, stocks (dans le cadre du service)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>3. Finalités du traitement</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Fournir et gérer nos services WMS</li>
            <li>Communiquer avec vous (support, facturation)</li>
            <li>Améliorer notre plateforme</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>4. Base légale</h2>
          <p>
            Le traitement de vos données repose sur :
          </p>
          <ul>
            <li>L'exécution du contrat de service</li>
            <li>Votre consentement (formulaire de contact)</li>
            <li>Nos obligations légales (facturation, comptabilité)</li>
            <li>Notre intérêt légitime (amélioration du service)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>5. Destinataires des données</h2>
          <p>
            Vos données peuvent être partagées avec :
          </p>
          <ul>
            <li>Nos sous-traitants techniques (hébergement : Render)</li>
            <li>Nos partenaires d'intégration (avec votre autorisation)</li>
            <li>Autorités légales (sur demande légale)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>6. Durée de conservation</h2>
          <p>
            Nous conservons vos données :
          </p>
          <ul>
            <li>Données de compte : durée de la relation contractuelle + 3 ans</li>
            <li>Données de facturation : 10 ans (obligation légale)</li>
            <li>Données de prospection : 3 ans sans contact</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
            <li><strong>Droit à l'effacement</strong> : supprimer vos données</li>
            <li><strong>Droit à la limitation</strong> : limiter le traitement</li>
            <li><strong>Droit à la portabilité</strong> : récupérer vos données</li>
            <li><strong>Droit d'opposition</strong> : vous opposer au traitement</li>
          </ul>
          <p>
            Pour exercer vos droits, contactez-nous à : contact@newstaq.com
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>8. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées :
          </p>
          <ul>
            <li>Chiffrement SSL/TLS des communications</li>
            <li>Sauvegardes automatiques quotidiennes</li>
            <li>Contrôle d'accès strict aux données</li>
            <li>Authentification sécurisée</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>9. Cookies</h2>
          <p>
            Nous utilisons des cookies strictement nécessaires au fonctionnement du service (authentification).
            Aucun cookie publicitaire ou de tracking n'est utilisé.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>10. Réclamation</h2>
          <p>
            En cas de litige, vous pouvez introduire une réclamation auprès de la CNIL :
            <br />
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={styles.link}>
              www.cnil.fr
            </a>
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

export default RGPD;

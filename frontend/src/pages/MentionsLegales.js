import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Mail, Phone, MapPin, Building } from 'lucide-react';

const MentionsLegales = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/')}>
            <Package size={32} color="#3b82f6" />
            <span style={styles.logoText}>NEWSTAQ</span>
          </div>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            <ArrowLeft size={20} />
            Retour à l'accueil
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          <h1 style={styles.title}>Mentions Légales</h1>
          <p style={styles.updateDate}>Dernière mise à jour : Février 2026</p>

          {/* Éditeur du site */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Éditeur du site</h2>
            <div style={styles.infoBlock}>
              <p style={styles.paragraph}>
                Le site <strong>NEWSTAQ</strong> est édité par :
              </p>
              <div style={styles.companyInfo}>
                <div style={styles.infoItem}>
                  <Building size={20} color="#3b82f6" />
                  <div>
                    <strong>NEWSTAQ SAS</strong><br />
                    Société par Actions Simplifiée au capital de 10 000 €<br />
                    SIRET : XXX XXX XXX XXXXX<br />
                    RCS Paris XXX XXX XXX<br />
                    N° TVA intracommunautaire : FR XX XXX XXX XXX
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <MapPin size={20} color="#3b82f6" />
                  <div>
                    <strong>Siège social :</strong><br />
                    1 rue d'Ableval<br />
                    95200 Sarcelles, FRANCE
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <Mail size={20} color="#3b82f6" />
                  <div>
                    <strong>Contact :</strong><br />
                    Email : contact@newstaq.com<br />
                    Site web : https://newstaq-frontend.onrender.com
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Directeur de publication */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Directeur de la publication</h2>
            <p style={styles.paragraph}>
              Le directeur de la publication du site est le représentant légal de la société NEWSTAQ SAS.
            </p>
          </section>

          {/* Hébergement */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Hébergement</h2>
            <div style={styles.infoBlock}>
              <p style={styles.paragraph}>
                Le site est hébergé par :
              </p>
              <p style={styles.paragraph}>
                <strong>Render Services, Inc.</strong><br />
                525 Brannan Street<br />
                San Francisco, CA 94107<br />
                États-Unis<br />
                Site web : https://render.com
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Propriété intellectuelle</h2>
            <p style={styles.paragraph}>
              L'ensemble du contenu du site NEWSTAQ (structure, textes, logos, images, vidéos, graphismes, etc.) 
              est la propriété exclusive de NEWSTAQ SAS ou de ses partenaires.
            </p>
            <p style={styles.paragraph}>
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces 
              différents éléments est strictement interdite sans l'accord exprès par écrit de NEWSTAQ SAS.
            </p>
            <p style={styles.paragraph}>
              La marque NEWSTAQ ainsi que les logos et graphismes figurant sur le site sont des marques déposées. 
              Toute reproduction totale ou partielle de ces marques ou de ces logos sans autorisation préalable 
              et écrite de NEWSTAQ SAS est prohibée.
            </p>
          </section>

          {/* Données personnelles */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Protection des données personnelles</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS attache une grande importance à la protection de vos données personnelles et s'engage 
              à les traiter dans le respect du Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p style={styles.paragraph}>
              Pour en savoir plus sur la collecte et le traitement de vos données personnelles, veuillez consulter 
              notre <a href="/rgpd" style={styles.link}>Politique de Confidentialité</a>.
            </p>
            <p style={styles.paragraph}>
              Conformément à la loi "Informatique et Libertés" et au RGPD, vous disposez d'un droit d'accès, 
              de rectification, de suppression et de portabilité de vos données personnelles. Pour exercer ces droits, 
              vous pouvez nous contacter à l'adresse : contact@newstaq.com
            </p>
          </section>

          {/* Cookies */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Cookies</h2>
            <p style={styles.paragraph}>
              Le site NEWSTAQ peut utiliser des cookies pour améliorer l'expérience utilisateur et réaliser des 
              statistiques de visite. Un cookie est un petit fichier texte déposé sur votre ordinateur lors de 
              la visite d'un site.
            </p>
            <p style={styles.paragraph}>
              Vous pouvez à tout moment désactiver ces cookies via les paramètres de votre navigateur. Cependant, 
              cela pourrait affecter certaines fonctionnalités du site.
            </p>
          </section>

          {/* Responsabilité */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>7. Limitation de responsabilité</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, 
              dont elle se réserve le droit de corriger le contenu à tout moment et sans préavis.
            </p>
            <p style={styles.paragraph}>
              Toutefois, NEWSTAQ SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations 
              mises à disposition sur ce site. En conséquence, NEWSTAQ SAS décline toute responsabilité pour toute 
              imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
            </p>
            <p style={styles.paragraph}>
              NEWSTAQ SAS ne pourra être tenue responsable des dommages directs ou indirects résultant de l'accès 
              au site ou de l'utilisation du site, y compris l'inaccessibilité, les pertes de données, 
              détériorations, destructions ou virus qui pourraient affecter votre équipement informatique.
            </p>
          </section>

          {/* Liens hypertextes */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>8. Liens hypertextes</h2>
            <p style={styles.paragraph}>
              Le site NEWSTAQ peut contenir des liens hypertextes vers d'autres sites. NEWSTAQ SAS n'exerce aucun 
              contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur accessibilité.
            </p>
            <p style={styles.paragraph}>
              La création de liens hypertextes vers le site NEWSTAQ nécessite une autorisation préalable et écrite 
              de NEWSTAQ SAS.
            </p>
          </section>

          {/* Droit applicable */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>9. Droit applicable et juridiction compétente</h2>
            <p style={styles.paragraph}>
              Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut 
              d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de 
              compétence en vigueur.
            </p>
          </section>

          {/* Contact */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>10. Contact</h2>
            <p style={styles.paragraph}>
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
            </p>
            <div style={styles.contactBox}>
              <div style={styles.contactItem}>
                <Mail size={20} color="#3b82f6" />
                <span>contact@newstaq.com</span>
              </div>
              <div style={styles.contactItem}>
                <MapPin size={20} color="#3b82f6" />
                <span>1 rue d'Ableval, 95200 Sarcelles, France</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>© 2026 NEWSTAQ. Tous droits réservés.</p>
          <div style={styles.footerLinks}>
            <a href="/mentions-legales" style={styles.footerLink}>Mentions légales</a>
            <a href="/cgv" style={styles.footerLink}>CGV</a>
            <a href="/rgpd" style={styles.footerLink}>RGPD</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0f172a',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  main: {
    flex: 1,
    padding: '3rem 2rem',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  updateDate: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '3rem',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e2e8f0',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#475569',
    marginBottom: '1rem',
  },
  infoBlock: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
  },
  companyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  infoItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  contactBox: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#475569',
  },
  footer: {
    backgroundColor: 'white',
    borderTop: '1px solid #e2e8f0',
    padding: '2rem',
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerText: {
    color: '#64748b',
    fontSize: '0.95rem',
  },
  footerLinks: {
    display: 'flex',
    gap: '2rem',
  },
  footerLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },
};

export default MentionsLegales;

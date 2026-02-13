import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';

const CGV = () => {
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
          <h1 style={styles.title}>Conditions Générales de Vente</h1>
          <p style={styles.updateDate}>Dernière mise à jour : Février 2026</p>

          {/* Préambule */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Préambule</h2>
            <p style={styles.paragraph}>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre 
              NEWSTAQ SAS, ci-après dénommée "le Prestataire", et toute personne physique ou morale, 
              ci-après dénommée "le Client", souhaitant bénéficier des services de logistique 3PL proposés.
            </p>
            <p style={styles.paragraph}>
              L'acceptation des présentes CGV est matérialisée par la signature du contrat de prestation de services 
              ou par l'utilisation effective des services proposés.
            </p>
          </section>

          {/* Article 1 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 1 - Objet</h2>
            <p style={styles.paragraph}>
              Les présentes CGV ont pour objet de définir les modalités et conditions dans lesquelles NEWSTAQ SAS 
              fournit ses prestations de services logistiques, comprenant notamment :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Réception et contrôle des marchandises</li>
              <li style={styles.listItem}>Stockage et gestion des stocks</li>
              <li style={styles.listItem}>Préparation et emballage des commandes (pick & pack)</li>
              <li style={styles.listItem}>Expédition et gestion des retours</li>
              <li style={styles.listItem}>Gestion administrative et facturation</li>
              <li style={styles.listItem}>Accès à la plateforme WMS (Warehouse Management System)</li>
            </ul>
          </section>

          {/* Article 2 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 2 - Acceptation des CGV</h2>
            <p style={styles.paragraph}>
              Toute commande de services implique l'acceptation sans réserve par le Client des présentes CGV. 
              Ces conditions prévalent sur tout autre document du Client, et notamment sur toutes conditions 
              générales d'achat, sauf accord dérogatoire exprès et préalable de NEWSTAQ SAS.
            </p>
          </section>

          {/* Article 3 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 3 - Tarifs</h2>
            <p style={styles.paragraph}>
              Les tarifs des prestations sont ceux en vigueur au jour de la commande. Ils sont exprimés en euros 
              et hors taxes (HT). La TVA applicable est celle en vigueur au jour de la facturation.
            </p>
            <p style={styles.paragraph}>
              Les tarifs comprennent :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Stockage :</strong> Tarification au m³ ou à la palette selon grille tarifaire</li>
              <li style={styles.listItem}><strong>Réception :</strong> Facturation par palette ou colis réceptionné</li>
              <li style={styles.listItem}><strong>Préparation de commandes :</strong> Tarif par commande + tarif par article supplémentaire</li>
              <li style={styles.listItem}><strong>Expédition :</strong> Selon tarifs transporteurs en vigueur</li>
              <li style={styles.listItem}><strong>Services additionnels :</strong> Sur devis selon besoin client</li>
            </ul>
            <p style={styles.paragraph}>
              NEWSTAQ SAS se réserve le droit de modifier ses tarifs à tout moment. Les nouveaux tarifs seront 
              applicables moyennant un préavis de 30 jours calendaires.
            </p>
          </section>

          {/* Article 4 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 4 - Facturation et Paiement</h2>
            <p style={styles.paragraph}>
              Les factures sont émises mensuellement et envoyées par email au Client. Le paiement doit être effectué 
              dans un délai de 30 jours à compter de la date d'émission de la facture, sauf conditions particulières 
              convenues par écrit.
            </p>
            <p style={styles.paragraph}>
              En cas de retard de paiement, des pénalités de retard égales à trois fois le taux d'intérêt légal 
              seront automatiquement appliquées, ainsi qu'une indemnité forfaitaire pour frais de recouvrement 
              de 40 euros, conformément aux articles L. 441-3 et L. 441-6 du Code de commerce.
            </p>
            <p style={styles.paragraph}>
              En cas de non-paiement total ou partiel d'une facture à son échéance, NEWSTAQ SAS se réserve le droit 
              de suspendre toutes prestations en cours et à venir sans préavis et sans préjudice de toute autre 
              action que la société serait en droit d'intenter.
            </p>
          </section>

          {/* Article 5 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 5 - Obligations du Client</h2>
            <p style={styles.paragraph}>
              Le Client s'engage à :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Fournir des informations exactes et complètes sur les marchandises confiées</li>
              <li style={styles.listItem}>Déclarer la valeur réelle des marchandises pour l'assurance</li>
              <li style={styles.listItem}>Respecter les normes d'emballage et d'étiquetage convenues</li>
              <li style={styles.listItem}>Informer NEWSTAQ SAS de tout produit dangereux ou soumis à réglementation</li>
              <li style={styles.listItem}>Fournir les documents nécessaires (certificats, autorisations, etc.)</li>
              <li style={styles.listItem}>Maintenir à jour les informations de contact et de facturation</li>
              <li style={styles.listItem}>Utiliser le système WMS conformément aux conditions d'utilisation</li>
            </ul>
          </section>

          {/* Article 6 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 6 - Obligations de NEWSTAQ</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS s'engage à :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Assurer la garde des marchandises confiées avec diligence</li>
              <li style={styles.listItem}>Gérer les stocks de manière professionnelle et traçable</li>
              <li style={styles.listItem}>Préparer et expédier les commandes selon les instructions du Client</li>
              <li style={styles.listItem}>Fournir un accès 24/7 à la plateforme WMS</li>
              <li style={styles.listItem}>Respecter les délais convenus pour les prestations</li>
              <li style={styles.listItem}>Maintenir la confidentialité des informations du Client</li>
            </ul>
          </section>

          {/* Article 7 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 7 - Responsabilité et Assurance</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS est responsable de la garde des marchandises qui lui sont confiées. Une assurance 
              "tous risques" est souscrite pour couvrir les marchandises stockées.
            </p>
            <p style={styles.paragraph}>
              La responsabilité de NEWSTAQ SAS est limitée à la valeur déclarée des marchandises, dans la limite 
              du montant couvert par l'assurance. En cas de dommage, le Client doit effectuer une déclaration 
              dans les 48 heures suivant la découverte du sinistre.
            </p>
            <p style={styles.paragraph}>
              NEWSTAQ SAS ne pourra être tenue responsable en cas de :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Vice propre de la marchandise</li>
              <li style={styles.listItem}>Événements de force majeure</li>
              <li style={styles.listItem}>Instructions inexactes ou incomplètes du Client</li>
              <li style={styles.listItem}>Défaut d'emballage approprié</li>
              <li style={styles.listItem}>Non-déclaration de produits dangereux ou soumis à réglementation</li>
            </ul>
          </section>

          {/* Article 8 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 8 - Durée et Résiliation</h2>
            <p style={styles.paragraph}>
              Le contrat est conclu pour une durée indéterminée, sauf mention contraire dans le contrat de 
              prestation de services.
            </p>
            <p style={styles.paragraph}>
              Chaque partie peut résilier le contrat moyennant un préavis de 3 mois notifié par lettre recommandée 
              avec accusé de réception.
            </p>
            <p style={styles.paragraph}>
              En cas de manquement grave aux obligations contractuelles par l'une des parties, l'autre partie 
              pourra résilier le contrat de plein droit après mise en demeure restée infructueuse pendant 15 jours.
            </p>
          </section>

          {/* Article 9 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 9 - Protection des Données</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS s'engage à traiter les données personnelles du Client conformément au RGPD et à la 
              loi Informatique et Libertés. Pour plus d'informations, veuillez consulter notre 
              {' '}<a href="/rgpd" style={styles.link}>Politique de Confidentialité</a>.
            </p>
          </section>

          {/* Article 10 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 10 - Confidentialité</h2>
            <p style={styles.paragraph}>
              Les parties s'engagent réciproquement à conserver confidentielles toutes les informations 
              commerciales, techniques, financières ou autres qu'elles seraient amenées à échanger dans le 
              cadre de leur relation contractuelle.
            </p>
          </section>

          {/* Article 11 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 11 - Force Majeure</h2>
            <p style={styles.paragraph}>
              Les parties ne pourront être tenues responsables si la non-exécution ou le retard dans l'exécution 
              de l'une de leurs obligations découle d'un cas de force majeure, tel que défini par la jurisprudence 
              des tribunaux français.
            </p>
          </section>

          {/* Article 12 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 12 - Droit Applicable et Règlement des Litiges</h2>
            <p style={styles.paragraph}>
              Les présentes CGV sont régies par le droit français. En cas de litige, les parties s'engagent à 
              rechercher une solution amiable avant toute action judiciaire.
            </p>
            <p style={styles.paragraph}>
              À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents de Paris, nonobstant 
              pluralité de défendeurs ou appel en garantie.
            </p>
          </section>

          {/* Article 13 */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Article 13 - Modification des CGV</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS se réserve le droit de modifier les présentes CGV à tout moment. Les nouvelles conditions 
              seront applicables après notification au Client avec un préavis de 30 jours.
            </p>
          </section>

          {/* Contact */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Contact</h2>
            <div style={styles.contactBox}>
              <p style={styles.paragraph}>
                Pour toute question concernant ces Conditions Générales de Vente :
              </p>
              <p style={styles.paragraph}>
                <strong>NEWSTAQ SAS</strong><br />
                1 rue d'Ableval<br />
                95200 Sarcelles, France<br />
                Email : contact@newstaq.com
              </p>
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
  list: {
    paddingLeft: '1.5rem',
    marginBottom: '1rem',
  },
  listItem: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#475569',
    marginBottom: '0.5rem',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'underline',
  },
  contactBox: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
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
  },
};

export default CGV;

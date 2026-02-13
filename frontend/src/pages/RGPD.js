import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Shield } from 'lucide-react';

const RGPD = () => {
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
          <div style={styles.titleSection}>
            <Shield size={48} color="#3b82f6" />
            <h1 style={styles.title}>Politique de Confidentialité (RGPD)</h1>
          </div>
          <p style={styles.updateDate}>Dernière mise à jour : Février 2026</p>

          {/* Introduction */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Introduction</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS, soucieuse des droits des individus, notamment au regard des traitements automatisés, 
              et dans une volonté de transparence avec ses clients, a mis en place une politique reprenant 
              l'ensemble de ces traitements, des finalités poursuivies par ces derniers ainsi que des moyens 
              d'actions à la disposition des individus afin qu'ils puissent au mieux exercer leurs droits.
            </p>
            <p style={styles.paragraph}>
              La présente politique de confidentialité vous informe sur la manière dont NEWSTAQ SAS collecte, 
              traite et protège vos données personnelles, conformément au Règlement Général sur la Protection 
              des Données (RGPD) et à la loi Informatique et Libertés.
            </p>
          </section>

          {/* Responsable du traitement */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Responsable du Traitement des Données</h2>
            <div style={styles.infoBox}>
              <p style={styles.paragraph}>
                <strong>NEWSTAQ SAS</strong><br />
                Société par Actions Simplifiée au capital de 10 000 €<br />
                Siège social : 1 rue d'Ableval, 95200 Sarcelles, France<br />
                Email : contact@newstaq.com
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Données Personnelles Collectées</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS collecte les données personnelles suivantes :
            </p>
            
            <h3 style={styles.subsectionTitle}>2.1 Données d'identification</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>Nom et prénom</li>
              <li style={styles.listItem}>Raison sociale de l'entreprise</li>
              <li style={styles.listItem}>Numéro SIRET / SIREN</li>
              <li style={styles.listItem}>Adresse postale</li>
              <li style={styles.listItem}>Adresse email</li>
              <li style={styles.listItem}>Numéro de téléphone</li>
            </ul>

            <h3 style={styles.subsectionTitle}>2.2 Données de connexion</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>Identifiants de connexion</li>
              <li style={styles.listItem}>Logs de connexion</li>
              <li style={styles.listItem}>Adresse IP</li>
              <li style={styles.listItem}>Données de navigation (cookies)</li>
            </ul>

            <h3 style={styles.subsectionTitle}>2.3 Données transactionnelles</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>Historique des commandes</li>
              <li style={styles.listItem}>Informations de facturation</li>
              <li style={styles.listItem}>Données bancaires (cryptées)</li>
              <li style={styles.listItem}>Informations sur les marchandises stockées</li>
            </ul>
          </section>

          {/* Finalités */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Finalités du Traitement</h2>
            <p style={styles.paragraph}>
              Vos données personnelles sont collectées et traitées pour les finalités suivantes :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Gestion de la relation client :</strong> Création et gestion de votre compte, traitement de vos demandes</li>
              <li style={styles.listItem}><strong>Exécution des prestations :</strong> Réception, stockage, préparation et expédition des marchandises</li>
              <li style={styles.listItem}><strong>Facturation :</strong> Émission et suivi des factures, gestion comptable</li>
              <li style={styles.listItem}><strong>Amélioration des services :</strong> Analyse de l'utilisation de la plateforme, statistiques</li>
              <li style={styles.listItem}><strong>Communication :</strong> Envoi d'informations relatives aux services, support client</li>
              <li style={styles.listItem}><strong>Sécurité :</strong> Prévention de la fraude, protection des systèmes</li>
              <li style={styles.listItem}><strong>Obligations légales :</strong> Respect des obligations comptables, fiscales et réglementaires</li>
            </ul>
          </section>

          {/* Base légale */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Base Légale du Traitement</h2>
            <p style={styles.paragraph}>
              Les traitements de données personnelles mis en œuvre par NEWSTAQ SAS reposent sur les bases légales suivantes :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Exécution du contrat :</strong> Le traitement est nécessaire à l'exécution du contrat de prestation</li>
              <li style={styles.listItem}><strong>Obligations légales :</strong> Le traitement est nécessaire au respect d'obligations légales</li>
              <li style={styles.listItem}><strong>Intérêt légitime :</strong> Pour l'amélioration des services et la sécurité</li>
              <li style={styles.listItem}><strong>Consentement :</strong> Pour l'envoi de communications commerciales (avec opt-in)</li>
            </ul>
          </section>

          {/* Destinataires */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Destinataires des Données</h2>
            <p style={styles.paragraph}>
              Vos données personnelles sont destinées aux services internes de NEWSTAQ SAS et peuvent être transmises à :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Nos sous-traitants techniques (hébergement, maintenance informatique)</li>
              <li style={styles.listItem}>Les transporteurs pour l'expédition des marchandises</li>
              <li style={styles.listItem}>Les prestataires de paiement</li>
              <li style={styles.listItem}>Les autorités administratives ou judiciaires, en cas d'obligation légale</li>
              <li style={styles.listItem}>Nos conseillers professionnels (avocats, experts-comptables)</li>
            </ul>
            <p style={styles.paragraph}>
              Tous ces tiers s'engagent à traiter vos données personnelles en conformité avec le RGPD.
            </p>
          </section>

          {/* Durée de conservation */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Durée de Conservation</h2>
            <p style={styles.paragraph}>
              Vos données personnelles sont conservées pour la durée nécessaire aux finalités pour lesquelles 
              elles sont traitées :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Données clients actifs :</strong> Pendant toute la durée de la relation contractuelle + 3 ans</li>
              <li style={styles.listItem}><strong>Données de facturation :</strong> 10 ans (obligation légale comptable)</li>
              <li style={styles.listItem}><strong>Données de connexion :</strong> 1 an maximum</li>
              <li style={styles.listItem}><strong>Données prospects :</strong> 3 ans à compter du dernier contact</li>
            </ul>
            <p style={styles.paragraph}>
              À l'issue de ces délais, vos données sont soit supprimées, soit anonymisées.
            </p>
          </section>

          {/* Droits */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>7. Vos Droits</h2>
            <p style={styles.paragraph}>
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Droit d'accès :</strong> Obtenir la confirmation que vos données sont traitées et y accéder</li>
              <li style={styles.listItem}><strong>Droit de rectification :</strong> Faire corriger des données inexactes ou incomplètes</li>
              <li style={styles.listItem}><strong>Droit à l'effacement :</strong> Demander la suppression de vos données (droit à l'oubli)</li>
              <li style={styles.listItem}><strong>Droit à la limitation :</strong> Demander la limitation du traitement de vos données</li>
              <li style={styles.listItem}><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
              <li style={styles.listItem}><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière</li>
              <li style={styles.listItem}><strong>Droit de retirer votre consentement :</strong> À tout moment, pour les traitements basés sur le consentement</li>
              <li style={styles.listItem}><strong>Droit de définir des directives :</strong> Concernant le sort de vos données après votre décès</li>
            </ul>
            <p style={styles.paragraph}>
              Pour exercer ces droits, vous pouvez nous contacter :
            </p>
            <div style={styles.infoBox}>
              <p style={styles.paragraph}>
                <strong>Par email :</strong> contact@newstaq.com<br />
                <strong>Par courrier :</strong> NEWSTAQ SAS - 1 rue d'Ableval, 95200 Sarcelles, France
              </p>
              <p style={styles.paragraph}>
                Votre demande doit être accompagnée d'une copie d'un titre d'identité signé. 
                Nous vous répondrons dans un délai maximum d'un mois.
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>8. Sécurité des Données</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS met en œuvre des mesures techniques et organisationnelles appropriées pour garantir 
              un niveau de sécurité adapté au risque, notamment :
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Chiffrement des données sensibles (SSL/TLS)</li>
              <li style={styles.listItem}>Authentification sécurisée (mots de passe chiffrés)</li>
              <li style={styles.listItem}>Accès restreint aux données personnelles</li>
              <li style={styles.listItem}>Sauvegardes régulières</li>
              <li style={styles.listItem}>Audits de sécurité</li>
              <li style={styles.listItem}>Formation du personnel à la protection des données</li>
            </ul>
          </section>

          {/* Cookies */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>9. Cookies</h2>
            <p style={styles.paragraph}>
              Notre site utilise des cookies pour améliorer votre expérience utilisateur. Un cookie est un petit 
              fichier texte stocké sur votre appareil lors de votre visite.
            </p>
            <h3 style={styles.subsectionTitle}>Types de cookies utilisés :</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (sessions, authentification)</li>
              <li style={styles.listItem}><strong>Cookies de performance :</strong> Nous permettent d'analyser l'utilisation du site</li>
              <li style={styles.listItem}><strong>Cookies fonctionnels :</strong> Mémorisent vos préférences</li>
            </ul>
            <p style={styles.paragraph}>
              Vous pouvez à tout moment désactiver les cookies via les paramètres de votre navigateur. 
              Cependant, cela peut affecter certaines fonctionnalités du site.
            </p>
          </section>

          {/* Transferts */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>10. Transferts de Données hors UE</h2>
            <p style={styles.paragraph}>
              Les données personnelles sont hébergées dans l'Union Européenne. Dans le cas où des transferts 
              de données hors de l'UE seraient nécessaires (notamment vers les États-Unis pour l'hébergement), 
              NEWSTAQ SAS s'assure que des garanties appropriées sont en place conformément au RGPD 
              (clauses contractuelles types, Privacy Shield, etc.).
            </p>
          </section>

          {/* Modifications */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>11. Modifications de la Politique</h2>
            <p style={styles.paragraph}>
              NEWSTAQ SAS se réserve le droit de modifier la présente politique de confidentialité à tout moment. 
              Les modifications seront publiées sur cette page avec une nouvelle date de "Dernière mise à jour". 
              Nous vous encourageons à consulter régulièrement cette page.
            </p>
          </section>

          {/* Réclamation */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>12. Droit de Réclamation</h2>
            <p style={styles.paragraph}>
              Si vous estimez que NEWSTAQ SAS ne respecte pas ses obligations en matière de protection des données 
              personnelles, vous avez le droit d'introduire une réclamation auprès de la CNIL :
            </p>
            <div style={styles.infoBox}>
              <p style={styles.paragraph}>
                <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong><br />
                3 Place de Fontenoy<br />
                TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Téléphone : 01 53 73 22 22<br />
                Site web : www.cnil.fr
              </p>
            </div>
          </section>

          {/* Contact */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>13. Contact</h2>
            <div style={styles.contactBox}>
              <p style={styles.paragraph}>
                Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits :
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
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0f172a',
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
  subsectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#334155',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
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
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #3b82f6',
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

export default RGPD;

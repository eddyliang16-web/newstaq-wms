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
          <p>EV2L TRADE SAS</p>
          <p>1 rue d'Ableval</p>
          <p>95200 Sarcelles, France</p>
          <p>911 730 364 RCS Paris</p>
          <p>Email : contact@newstaq.com</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Acceptation des conditions d'utilisation du site</h2>
          <p>
          En accédant au site de Newstaq, l’utilisateur est réputé avoir accepté sans réserve les présentes conditions générales d’utilisation.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Contenu du site</h2>
          <p>
          Toutes les informations présentes sur le site www.newstaq.com sont fournies à titre indicatif. Elles ne constituent en aucun cas une offre contractuelle.
          Newstaq se réserve le droit de modifier le contenu du site à tout moment, sans préavis, et ne pourra être tenu responsable des conséquences de ces modifications.
          </p>
        </section>


        <section style={styles.section}>
          <h2 style={styles.subtitle}>Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété exclusive de NEWSTAQ.
            Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété exclusive de NEWSTAQ.
            Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>


        <section style={styles.section}>
          <h2 style={styles.subtitle}>Cookies</h2>
          <p>
          Lors de la navigation sur le site, des cookies peuvent être déposés temporairement sur le disque dur de l’utilisateur afin de faciliter la navigation.
          La plupart des navigateurs acceptent les cookies automatiquement. Leur désactivation peut limiter l’accès à certaines fonctionnalités du site.
          L’utilisateur est informé de cette pratique et l’accepte. Il peut toutefois configurer son navigateur pour refuser les cookies.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Informations nominatives</h2>
          <p>
          Newstaq ne collecte pas de données personnelles via son site.
          Les informations transmises via le formulaire de contact sont uniquement envoyées par email à Newstaq, sans enregistrement sur un serveur, dans le but de répondre aux demandes des internautes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Responsabilités</h2>
          <p>
          L’utilisateur est seul responsable de la protection de ses données et de son matériel contre tout virus présent sur Internet.
          Futurlog décline toute responsabilité en cas de :
          dommage subi lors de l’utilisation du site,
          mauvaise utilisation des fonctionnalités proposées,
          non-respect de la législation par l’utilisateur.
          L’utilisateur s’engage à ne pas utiliser le site ou son contenu à des fins illicites ou pouvant nuire à l’image de Futurlog. Il est également responsable des informations et messages qu’il transmet.
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

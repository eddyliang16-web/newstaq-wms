import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    ordersPerMonth: '',
    businessType: [],
    catalogSize: '',
    startDate: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Animate solution cards on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.solution-card').forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quote request submitted:', formData);
    setShowSuccess(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      ordersPerMonth: '',
      businessType: [],
      catalogSize: '',
      startDate: '',
      message: ''
    });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      businessType: checked 
        ? [...prev.businessType, value]
        : prev.businessType.filter(item => item !== value)
    }));
  };

  return (
    <div className="landing-page">
      <style>{`
        :root {
          --lp-primary: #0066FF;
          --lp-primary-dark: #0052CC;
          --lp-secondary: #00D4AA;
          --lp-dark: #0A1628;
          --lp-dark-blue: #122340;
          --lp-gray: #64748B;
          --lp-light-gray: #F1F5F9;
          --lp-white: #FFFFFF;
          --lp-gradient: linear-gradient(135deg, #0066FF 0%, #00D4AA 100%);
        }

        .landing-page {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--lp-dark);
          line-height: 1.6;
          overflow-x: hidden;
        }

        .landing-page h1, .landing-page h2, .landing-page h3, .landing-page h4 {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 700;
          line-height: 1.2;
        }

        /* Header */
        .lp-header {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid rgba(0, 102, 255, 0.1);
          animation: slideDown 0.6s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .lp-nav {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 3rem;
        }

        .lp-logo {
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          background: var(--lp-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .lp-nav-links {
          display: flex;
          gap: 3rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .lp-nav-links a {
          color: var(--lp-dark);
          text-decoration: none;
          font-weight: 500;
          position: relative;
          transition: color 0.3s;
        }

        .lp-nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--lp-gradient);
          transition: width 0.3s;
        }

        .lp-nav-links a:hover::after {
          width: 100%;
        }

        .lp-header-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .lp-cta-button {
          background: var(--lp-gradient);
          color: white;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 15px rgba(0, 102, 255, 0.3);
        }

        .lp-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 102, 255, 0.4);
          color: white;
        }

        .lp-connect-button {
          background: transparent;
          color: var(--lp-primary);
          padding: 0.8rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          border: 2px solid var(--lp-primary);
          transition: all 0.3s;
        }

        .lp-connect-button:hover {
          background: var(--lp-primary);
          color: white;
        }

        /* Hero */
        .lp-hero {
          margin-top: 72px;
          min-height: 90vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #0A1628 0%, #122340 100%);
          position: relative;
          overflow: hidden;
        }

        .lp-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0, 212, 170, 0.15) 0%, transparent 50%);
        }

        .lp-hero-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .lp-hero-text h1 {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .lp-hero-text .highlight {
          background: var(--lp-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-hero-text p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .lp-hero-buttons {
          display: flex;
          gap: 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .lp-btn-primary {
          background: var(--lp-gradient);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 8px 30px rgba(0, 102, 255, 0.4);
        }

        .lp-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 102, 255, 0.5);
          color: white;
        }

        .lp-btn-secondary {
          background: transparent;
          color: white;
          padding: 1rem 2.5rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .lp-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
          color: white;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .lp-hero-visual {
          position: relative;
          animation: fadeIn 1s ease-out 0.4s both;
        }

        .lp-hero-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .lp-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .lp-stat-item {
          text-align: center;
        }

        .lp-stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          background: var(--lp-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* About */
        .lp-about {
          padding: 8rem 3rem;
          background: var(--lp-light-gray);
        }

        .lp-about-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .lp-about-content h2 {
          font-size: 2.8rem;
          margin-bottom: 2rem;
          color: var(--lp-dark);
        }

        .lp-about-content p {
          font-size: 1.1rem;
          color: var(--lp-gray);
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .lp-about-features {
          display: grid;
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .lp-feature-item {
          display: flex;
          align-items: start;
          gap: 1rem;
        }

        .lp-feature-icon {
          width: 50px;
          height: 50px;
          background: var(--lp-gradient);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .lp-feature-text h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .lp-feature-text p {
          font-size: 1rem;
          margin: 0;
        }

        .lp-warehouse-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .lp-warehouse-card h3 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: var(--lp-dark);
        }

        .lp-warehouse-details {
          display: grid;
          gap: 1.5rem;
        }

        .lp-detail-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--lp-light-gray);
          border-radius: 12px;
        }

        .lp-detail-icon {
          width: 40px;
          height: 40px;
          background: var(--lp-gradient);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        /* Solutions */
        .lp-solutions {
          padding: 8rem 3rem;
          background: white;
        }

        .lp-solutions-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .lp-section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .lp-section-header h2 {
          font-size: 2.8rem;
          margin-bottom: 1rem;
        }

        .lp-section-header p {
          font-size: 1.2rem;
          color: var(--lp-gray);
        }

        .lp-solutions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .solution-card {
          background: white;
          border: 2px solid var(--lp-light-gray);
          border-radius: 20px;
          padding: 2.5rem;
          transition: all 0.4s;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
        }

        .solution-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--lp-gradient);
          transform: scaleX(0);
          transition: transform 0.4s;
        }

        .solution-card:hover {
          border-color: var(--lp-primary);
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 102, 255, 0.2);
        }

        .solution-card:hover::before {
          transform: scaleX(1);
        }

        .lp-solution-icon {
          width: 70px;
          height: 70px;
          background: var(--lp-gradient);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        .solution-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .solution-card p {
          color: var(--lp-gray);
          line-height: 1.7;
        }

        /* Demo */
        .lp-demo {
          padding: 8rem 3rem;
          background: var(--lp-dark);
          position: relative;
          overflow: hidden;
        }

        .lp-demo::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 50%, rgba(0, 102, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(0, 212, 170, 0.1) 0%, transparent 50%);
        }

        .lp-demo-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .lp-demo-container h2 {
          font-size: 2.8rem;
          color: white;
          text-align: center;
          margin-bottom: 1rem;
        }

        .lp-demo-container .subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.2rem;
          margin-bottom: 3rem;
        }

        .lp-demo-form {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
        }

        .lp-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .lp-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lp-form-group.full-width {
          grid-column: 1 / -1;
        }

        .lp-form-group label {
          color: white;
          font-weight: 500;
        }

        .lp-form-group input,
        .lp-form-group textarea,
        .lp-form-group select {
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .lp-form-group input::placeholder,
        .lp-form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .lp-form-group input:focus,
        .lp-form-group textarea:focus,
        .lp-form-group select:focus {
          outline: none;
          border-color: var(--lp-primary);
          background: rgba(255, 255, 255, 0.15);
        }

        .lp-form-group select option {
          background: var(--lp-dark-blue);
          color: white;
        }

        .lp-form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .lp-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .lp-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
          cursor: pointer;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: all 0.3s;
          font-size: 0.95rem;
        }

        .lp-checkbox-label:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--lp-primary);
        }

        .lp-checkbox-label input[type="checkbox"] {
          display: none;
        }

        .lp-checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .lp-checkbox-label input[type="checkbox"]:checked + .lp-checkbox-custom {
          background: var(--lp-gradient);
          border-color: transparent;
        }

        .lp-checkbox-label input[type="checkbox"]:checked + .lp-checkbox-custom::after {
          content: '✓';
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .lp-submit-btn {
          width: 100%;
          padding: 1.2rem;
          background: var(--lp-gradient);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 30px rgba(0, 102, 255, 0.4);
        }

        .lp-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 102, 255, 0.5);
        }

        .lp-success-message {
          display: none;
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid var(--lp-secondary);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          color: var(--lp-secondary);
          text-align: center;
        }

        .lp-success-message.show {
          display: block;
          animation: fadeIn 0.5s ease-out;
        }

        /* Footer */
        .lp-footer {
          background: var(--lp-dark-blue);
          color: white;
          padding: 4rem 3rem 2rem;
        }

        .lp-footer-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .lp-footer-brand h3 {
          font-size: 2rem;
          background: var(--lp-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .lp-footer-brand p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
        }

        .lp-footer-section h4 {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .lp-footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .lp-footer-section a, .lp-footer-section li {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          display: block;
          margin-bottom: 0.8rem;
          transition: color 0.3s;
        }

        .lp-footer-section a:hover {
          color: var(--lp-secondary);
        }

        .lp-footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive */
        @media (max-width: 968px) {
          .lp-nav {
            padding: 1rem 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .lp-nav-links {
            gap: 1.5rem;
            display: none;
          }

          .lp-hero-content {
            grid-template-columns: 1fr;
            padding: 0 2rem;
          }

          .lp-hero-text h1 {
            font-size: 2.5rem;
          }

          .lp-about-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .lp-solutions-grid {
            grid-template-columns: 1fr;
          }

          .lp-form-grid {
            grid-template-columns: 1fr;
          }

          .lp-footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <header className="lp-header">
        <nav className="lp-nav">
          <div className="lp-logo">NEWSTAQ</div>
          <ul className="lp-nav-links">
            <li><a href="#solutions">Solutions</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#demo">Démo</a></li>
          </ul>
          <div className="lp-header-buttons">
            <Link to="/login" className="lp-connect-button">Connexion</Link>
            <a href="#demo" className="lp-cta-button">Demander une démo</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-hero-text">
            <h1>Externalisez votre logistique <span className="highlight">e-commerce</span></h1>
            <p>NEWSTAQ accompagne les marques DNVB et e-commerçants dans l'externalisation complète de leur supply chain : stockage, préparation, expédition B2C & B2B. Une équipe familiale, un service sur-mesure.</p>
            <div className="lp-hero-buttons">
              <a href="#demo" className="lp-btn-primary">Obtenir mon devis gratuit</a>
              <a href="#solutions" className="lp-btn-secondary">Nos services logistiques</a>
            </div>
          </div>
          <div className="lp-hero-visual">
            <div className="lp-hero-card">
              <div className="lp-stat-grid">
                <div className="lp-stat-item">
                  <div className="lp-stat-number">2000m²</div>
                  <div className="lp-stat-label">Entrepôt en Île-de-France</div>
                </div>
                <div className="lp-stat-item">
                  <div className="lp-stat-number">48h</div>
                  <div className="lp-stat-label">Délai d'expédition</div>
                </div>
                <div className="lp-stat-item">
                  <div className="lp-stat-number">B2C & B2B</div>
                  <div className="lp-stat-label">Multi-canal</div>
                </div>
                <div className="lp-stat-item">
                  <div className="lp-stat-number">Sur-mesure</div>
                  <div className="lp-stat-label">Tarifs adaptés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="lp-about" id="about">
        <div className="lp-about-container">
          <div className="lp-about-content">
            <h2>Votre partenaire logistique à taille humaine</h2>
            <p>Chez NEWSTAQ, nous comprenons les défis des marques e-commerce en croissance. Entreprise familiale spécialisée dans la logistique externalisée, nous offrons un service personnalisé que les grands acteurs ne peuvent pas proposer.</p>
            <p>De la réception de vos produits à l'expédition vers vos clients finaux ou vos partenaires B2B, nous gérons l'intégralité de votre chaîne logistique avec réactivité et flexibilité.</p>
            
            <div className="lp-about-features">
              <div className="lp-feature-item">
                <div className="lp-feature-icon">🎯</div>
                <div className="lp-feature-text">
                  <h3>Spécialiste DNVB & E-commerce</h3>
                  <p>Une expertise dédiée aux marques digitales natives et aux e-commerçants ambitieux</p>
                </div>
              </div>
              <div className="lp-feature-item">
                <div className="lp-feature-icon">📦</div>
                <div className="lp-feature-text">
                  <h3>B2C & B2B maîtrisés</h3>
                  <p>Expédition unitaire vers vos clients ou palettes vers vos revendeurs et marketplaces</p>
                </div>
              </div>
              <div className="lp-feature-item">
                <div className="lp-feature-icon">🤝</div>
                <div className="lp-feature-text">
                  <h3>Un interlocuteur dédié</h3>
                  <p>Un responsable de compte unique qui connaît votre activité et répond en temps réel</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lp-about-image">
            <div className="lp-warehouse-card">
              <h3>Notre entrepôt</h3>
              <div className="lp-warehouse-details">
                <div className="lp-detail-row">
                  <div className="lp-detail-icon">📍</div>
                  <div>
                    <strong>Localisation</strong><br />
                    Île-de-France, France
                  </div>
                </div>
                <div className="lp-detail-row">
                  <div className="lp-detail-icon">📦</div>
                  <div>
                    <strong>Surface</strong><br />
                    2000m² d'entrepôt moderne
                  </div>
                </div>
                <div className="lp-detail-row">
                  <div className="lp-detail-icon">🔗</div>
                  <div>
                    <strong>Intégrations</strong><br />
                    Shopify, WooCommerce, Amazon, Prestashop...
                  </div>
                </div>
                <div className="lp-detail-row">
                  <div className="lp-detail-icon">🚚</div>
                  <div>
                    <strong>Transporteurs</strong><br />
                    Colissimo, Chronopost, GLS, DHL...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="lp-solutions" id="solutions">
        <div className="lp-solutions-container">
          <div className="lp-section-header">
            <h2>Une logistique e-commerce complète et flexible</h2>
            <p>De la réception à l'expédition, nous prenons en charge l'ensemble de votre supply chain</p>
          </div>
          
          <div className="lp-solutions-grid">
            {[
              { icon: '📥', title: 'Réception & Contrôle', desc: 'Réception de vos produits, contrôle qualité à l\'arrivée, mise en stock avec traçabilité complète et photo des anomalies.' },
              { icon: '📦', title: 'Stockage optimisé', desc: 'Entreposage sécurisé avec gestion des emplacements, suivi des stocks en temps réel et alertes de réapprovisionnement.' },
              { icon: '🎯', title: 'Préparation B2C', desc: 'Picking unitaire optimisé, personnalisation des colis (flyers, échantillons), emballage soigné aux couleurs de votre marque.' },
              { icon: '🏭', title: 'Préparation B2B', desc: 'Palettisation, étiquetage selon les normes de vos distributeurs, préparation des commandes grossistes et marketplaces.' },
              { icon: '🚚', title: 'Expédition multi-transporteurs', desc: 'Colissimo, Chronopost, GLS, DHL, Mondial Relay... Nous gérons vos envois France et International aux meilleurs tarifs.' },
              { icon: '🔗', title: 'Intégrations e-commerce', desc: 'Connexion native avec Shopify, WooCommerce, Prestashop, Amazon, Zalando et toutes vos marketplaces.' },
              { icon: '↩️', title: 'Gestion des retours', desc: 'Réception des retours clients, contrôle qualité, remise en stock ou destruction selon vos instructions.' },
              { icon: '📊', title: 'Reporting & Visibilité', desc: 'Tableau de bord en temps réel, KPIs logistiques, historique des expéditions et suivi des performances.' },
              { icon: '🤝', title: 'Accompagnement dédié', desc: 'Un responsable de compte unique, disponible par téléphone et email pour répondre à toutes vos questions.' }
            ].map((solution, index) => (
              <div 
                key={index} 
                className="solution-card"
                style={{ 
                  opacity: 0, 
                  transform: 'translateY(30px)', 
                  transition: `all 0.6s ease-out ${index * 0.1}s` 
                }}
              >
                <div className="lp-solution-icon">{solution.icon}</div>
                <h3>{solution.title}</h3>
                <p>{solution.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="lp-demo" id="demo">
        <div className="lp-demo-container">
          <h2>Obtenez votre devis sous 24h</h2>
          <p className="subtitle">Nous accompagnons les marques e-commerce ambitieuses dans l'externalisation de leur logistique</p>
          
          <form className="lp-demo-form" onSubmit={handleSubmit}>
            <div className="lp-form-grid">
              <div className="lp-form-group">
                <label htmlFor="firstName">Votre prénom *</label>
                <input type="text" id="firstName" name="firstName" required placeholder="Jean" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="lp-form-group">
                <label htmlFor="lastName">Votre nom *</label>
                <input type="text" id="lastName" name="lastName" required placeholder="Dupont" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            
            <div className="lp-form-grid">
              <div className="lp-form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" required placeholder="jean@mamarque.fr" value={formData.email} onChange={handleChange} />
              </div>
              <div className="lp-form-group">
                <label htmlFor="phone">Votre téléphone *</label>
                <input type="tel" id="phone" name="phone" required placeholder="+33 6 12 34 56 78" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            
            <div className="lp-form-grid">
              <div className="lp-form-group">
                <label htmlFor="company">Nom de l'entreprise *</label>
                <input type="text" id="company" name="company" required placeholder="Ma Marque DNVB" value={formData.company} onChange={handleChange} />
              </div>
              <div className="lp-form-group">
                <label htmlFor="website">URL du site web</label>
                <input type="url" id="website" name="website" placeholder="https://www.mamarque.fr" value={formData.website} onChange={handleChange} />
              </div>
            </div>
            
            <div className="lp-form-grid">
              <div className="lp-form-group">
                <label htmlFor="ordersPerMonth">Nombre de commandes / mois *</label>
                <select id="ordersPerMonth" name="ordersPerMonth" required value={formData.ordersPerMonth} onChange={handleChange}>
                  <option value="">Sélectionnez</option>
                  <option value="0-100">0 - 100 commandes</option>
                  <option value="100-500">100 - 500 commandes</option>
                  <option value="500-1000">500 - 1 000 commandes</option>
                  <option value="1000-5000">1 000 - 5 000 commandes</option>
                  <option value="5000-10000">5 000 - 10 000 commandes</option>
                  <option value="10000+">Plus de 10 000 commandes</option>
                </select>
              </div>
              <div className="lp-form-group">
                <label htmlFor="catalogSize">Taille du catalogue produit</label>
                <select id="catalogSize" name="catalogSize" value={formData.catalogSize} onChange={handleChange}>
                  <option value="">Nombre de SKUs</option>
                  <option value="0-10">0 - 10 SKUs</option>
                  <option value="10-100">10 - 100 SKUs</option>
                  <option value="100-500">100 - 500 SKUs</option>
                  <option value="500-2000">500 - 2 000 SKUs</option>
                  <option value="2000-5000">2 000 - 5 000 SKUs</option>
                  <option value="5000+">Plus de 5 000 SKUs</option>
                </select>
              </div>
            </div>

            <div className="lp-form-group full-width">
              <label>Type d'activité e-commerce *</label>
              <div className="lp-checkbox-group">
                <label className="lp-checkbox-label">
                  <input 
                    type="checkbox" 
                    name="businessType" 
                    value="btoc" 
                    checked={formData.businessType.includes('btoc')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="lp-checkbox-custom"></span>
                  BtoC (Vente aux particuliers)
                </label>
                <label className="lp-checkbox-label">
                  <input 
                    type="checkbox" 
                    name="businessType" 
                    value="btob" 
                    checked={formData.businessType.includes('btob')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="lp-checkbox-custom"></span>
                  BtoB (Vente aux professionnels)
                </label>
                <label className="lp-checkbox-label">
                  <input 
                    type="checkbox" 
                    name="businessType" 
                    value="marketplace" 
                    checked={formData.businessType.includes('marketplace')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="lp-checkbox-custom"></span>
                  Marketplaces (Amazon, Zalando...)
                </label>
              </div>
            </div>

            <div className="lp-form-group full-width">
              <label htmlFor="startDate">Date souhaitée pour externaliser / changer de prestataire</label>
              <select id="startDate" name="startDate" value={formData.startDate} onChange={handleChange}>
                <option value="">Sélectionnez une période</option>
                <option value="asap">Dès que possible</option>
                <option value="1month">Dans le mois</option>
                <option value="3months">Dans les 3 prochains mois</option>
                <option value="6months">Dans les 6 prochains mois</option>
                <option value="exploring">Je me renseigne pour l'instant</option>
              </select>
            </div>
            
            <div className="lp-form-group full-width">
              <label htmlFor="message">Votre demande / message</label>
              <textarea id="message" name="message" placeholder="Décrivez votre activité, vos produits, vos canaux de vente et vos attentes en matière de logistique externalisée..." value={formData.message} onChange={handleChange}></textarea>
            </div>
            
            <button type="submit" className="lp-submit-btn">Recevoir mon devis gratuit ⏱ sous 24h</button>
            
            <div className={`lp-success-message ${showSuccess ? 'show' : ''}`}>
              ✅ Merci pour votre demande ! Un responsable dédié vous contactera dans les 24h pour discuter de votre projet et vous proposer une offre sur-mesure.
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-container">
          <div className="lp-footer-brand">
            <h3>NEWSTAQ</h3>
            <p>Votre partenaire logistique e-commerce. Nous accompagnons les marques DNVB et e-commerçants dans l'externalisation de leur supply chain : stockage, préparation, expédition B2C & B2B.</p>
          </div>
          
          <div className="lp-footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#solutions">Stockage & Entreposage</a></li>
              <li><a href="#solutions">Préparation B2C / B2B</a></li>
              <li><a href="#solutions">Expédition multi-transporteurs</a></li>
              <li><a href="#solutions">Gestion des retours</a></li>
            </ul>
          </div>
          
          <div className="lp-footer-section">
            <h4>Intégrations</h4>
            <ul>
              <li><a href="#solutions">Shopify</a></li>
              <li><a href="#solutions">WooCommerce</a></li>
              <li><a href="#solutions">Prestashop</a></li>
              <li><a href="#solutions">Amazon & Marketplaces</a></li>
            </ul>
          </div>
          
          <div className="lp-footer-section">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:contact@newstaq.fr">contact@newstaq.fr</a></li>
              <li><a href="tel:+33123456789">+33 1 23 45 67 89</a></li>
              <li>Île-de-France, France</li>
            </ul>
          </div>
        </div>
        
        <div className="lp-footer-bottom">
          <p>© 2026 NEWSTAQ. Tous droits réservés. | <a href="#" style={{ color: 'inherit' }}>Mentions légales</a> | <a href="#" style={{ color: 'inherit' }}>Politique de confidentialité</a></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

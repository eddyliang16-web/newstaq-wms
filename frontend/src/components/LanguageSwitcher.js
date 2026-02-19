import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ isMobile = false }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const styles = {
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: isMobile ? '0.75rem' : '0.5rem 1rem',
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: isMobile ? '1rem' : '0.9rem',
      fontWeight: '500',
      color: '#475569',
      transition: 'all 0.2s',
    },
    flag: {
      fontSize: '1.2rem',
    },
    label: {
      textTransform: 'uppercase',
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      style={styles.button}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f1f5f9';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <Globe size={18} />
      <span style={styles.flag}>
        {i18n.language === 'fr' ? '🇫🇷' : '🇬🇧'}
      </span>
      <span style={styles.label}>
        {i18n.language === 'fr' ? 'FR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;

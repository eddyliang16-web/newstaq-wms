import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  Warehouse, Truck, FileText, Bell, User, LogOut,
  Menu, X
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const AdminSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('admin.nav.dashboard') },
    { path: '/clients', icon: Users, label: t('admin.nav.clients') },
    { path: '/products', icon: Package, label: t('admin.nav.products') },
    { path: '/orders', icon: ShoppingCart, label: t('admin.nav.orders') },
    { path: '/inventory', icon: Warehouse, label: t('admin.nav.inventory') },
    { path: '/receptions', icon: Truck, label: t('admin.nav.receptions') },
    { path: '/invoices', icon: FileText, label: t('admin.nav.invoices') },
  ];

  const styles = {
    sidebar: {
      position: 'fixed',
      left: isMobile && !isOpen ? '-280px' : 0,
      top: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: '#1e293b',
      color: 'white',
      transition: 'left 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    header: {
      padding: '1.5rem',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    closeButton: {
      display: isMobile ? 'block' : 'none',
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '0.5rem',
    },
    nav: {
      flex: 1,
      padding: '1rem 0',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 1.5rem',
      color: 'rgba(255,255,255,0.7)',
      textDecoration: 'none',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    menuItemActive: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      borderLeft: '3px solid #3b82f6',
    },
    footer: {
      padding: '1rem',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    languageSwitcherWrapper: {
      padding: '0 0.5rem',
    },
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <Package size={32} />
          <span>NEWSTAQ</span>
        </div>
        <button onClick={toggleSidebar} style={styles.closeButton}>
          <X size={24} />
        </button>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.menuItem,
              ...(location.pathname === item.path ? styles.menuItemActive : {})
            }}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.languageSwitcherWrapper}>
          <LanguageSwitcher isMobile={isMobile} />
        </div>
        
        <Link
          to="/notifications"
          style={styles.menuItem}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <Bell size={20} />
          <span>{t('admin.nav.notifications')}</span>
        </Link>
        
        <Link
          to="/profile"
          style={styles.menuItem}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <User size={20} />
          <span>{t('admin.nav.profile')}</span>
        </Link>
        
        <button
          onClick={handleLogout}
          style={{...styles.menuItem, border: 'none', width: '100%', textAlign: 'left'}}
        >
          <LogOut size={20} />
          <span>{t('admin.nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

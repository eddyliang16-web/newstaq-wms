import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Package, ShoppingCart, ClipboardList, BarChart3, 
  Users, User, LogOut, Menu, X, Warehouse, DollarSign, LayoutDashboard, Link2, Bell
} from 'lucide-react';

const Navigation = () => {
  const { user, logout, isClient } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Different nav items for client vs admin
  const adminNavItems = [
    { path: '/dashboard', icon: Home, label: 'Tableau de bord' },
    { path: '/products', icon: Package, label: 'Produits' },
    { path: '/inventory', icon: Warehouse, label: 'Inventaire' },
    { path: '/receipts', icon: ClipboardList, label: 'Réceptions' },
    { path: '/orders', icon: ShoppingCart, label: 'Commandes' },
    { path: '/integrations', icon: Link2, label: 'Intégrations' },
    { path: '/billing', icon: DollarSign, label: 'Facturation' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/profile', icon: User, label: 'Mon Profil' },
  ];

  const clientNavItems = [
    { path: '/client', icon: LayoutDashboard, label: 'Mon Espace' },
    { path: '/client/products', icon: Package, label: 'Mes Produits' },
    { path: '/client/inventory', icon: Warehouse, label: 'Mon Stock' },
    { path: '/client/orders', icon: ShoppingCart, label: 'Mes Commandes' },
    { path: '/client/receipts', icon: ClipboardList, label: 'Mes Réceptions' },
    { path: '/client/invoices', icon: DollarSign, label: 'Mes Factures' },
    { path: '/client/profile', icon: User, label: 'Mon Profil' },

  ];

  const navItems = isClient ? clientNavItems : adminNavItems;

  return (
    <nav className="bg-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={isClient ? '/client' : '/dashboard'} className="flex items-center gap-3 text-xl font-bold">
            <Warehouse className="w-7 h-7 text-cyan-400" />
            <span className="hidden sm:inline tracking-tight">NEWSTAQ</span>
            {isClient && <span className="text-xs bg-emerald-500 px-2 py-0.5 rounded-full ml-2">Client</span>}
          </Link>

          <button 
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.path.replace(/\//g, '-').replace(/^-/, '')}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-slate-400 capitalize">
                {isClient ? user?.client_name : user?.role}
              </div>
            </div>
            <button 
              onClick={logout} 
              className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors"
              title="Déconnexion"
              data-testid="logout-btn"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive(item.path) ? 'bg-slate-700 text-white' : 'text-slate-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-slate-700 px-4">
              <div className="text-sm text-slate-400 mb-2">{user?.name}</div>
              <button 
                onClick={logout} 
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg w-full"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

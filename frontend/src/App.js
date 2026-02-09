import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Receipts from './pages/Receipts';
import Orders from './pages/Orders';
import InventoryCounts from './pages/InventoryCounts';
import Clients from './pages/Clients';
import Billing from './pages/Billing';
import Integrations from './pages/Integrations';
import Notifications from './pages/Notifications';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProducts from './pages/client/ClientProducts';
import ClientInventory from './pages/client/ClientInventory';
import ClientOrders from './pages/client/ClientOrders';
import ClientReceipts from './pages/client/ClientReceipts';
import ClientInvoices from './pages/client/ClientInvoices';
import './App.css';

// Protected route component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Chargement...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin only route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/client" />;
  
  return children;
};

// Client only route
const ClientRoute = ({ children }) => {
  const { isAuthenticated, isClient, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isClient) return <Navigate to="/dashboard" />;
  
  return children;
};

const AppContent = () => {
  const { isAuthenticated, isClient } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      {isAuthenticated && <Navigation />}
      <main className={isAuthenticated ? "min-h-[calc(100vh-64px)]" : ""}>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={isAuthenticated ? (isClient ? <Navigate to="/client" /> : <Navigate to="/dashboard" />) : <LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/products" element={<AdminRoute><Products /></AdminRoute>} />
          <Route path="/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
          <Route path="/receipts" element={<AdminRoute><Receipts /></AdminRoute>} />
          <Route path="/orders" element={<AdminRoute><Orders /></AdminRoute>} />
          <Route path="/integrations" element={<AdminRoute><Integrations /></AdminRoute>} />
          <Route path="/inventory-counts" element={<AdminRoute><InventoryCounts /></AdminRoute>} />
          <Route path="/clients" element={<AdminRoute><Clients /></AdminRoute>} />
          <Route path="/billing" element={<AdminRoute><Billing /></AdminRoute>} />
          <Route path="/notifications" element={<AdminRoute><Notifications /></AdminRoute>} />
          
          {/* Client Portal Routes */}
          <Route path="/client" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
          <Route path="/client/products" element={<ClientRoute><ClientProducts /></ClientRoute>} />
          <Route path="/client/inventory" element={<ClientRoute><ClientInventory /></ClientRoute>} />
          <Route path="/client/orders" element={<ClientRoute><ClientOrders /></ClientRoute>} />
          <Route path="/client/receipts" element={<ClientRoute><ClientReceipts /></ClientRoute>} />
          <Route path="/client/invoices" element={<ClientRoute><ClientInvoices /></ClientRoute>} />
          
          {/* Default redirect based on role */}
          <Route path="*" element={
            <PrivateRoute>
              {isClient ? <Navigate to="/client" /> : <Navigate to="/dashboard" />}
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getClients } from '../services/api';
import { Package, ShoppingCart, ClipboardList, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    if (user.role === 'admin') loadClients();
  }, [selectedClient, user.role]);

  const loadData = async () => {
    try {
      const clientId = user.role === 'admin' ? selectedClient : user.client_id;
      const response = await getDashboardStats(clientId);
      setStats(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="admin-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Tableau de Bord</h1>
        {user.role === 'admin' && (
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
            data-testid="client-filter"
          >
            <option value="">Tous les clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Package size={24} />
            <h3 className="text-sm font-medium uppercase opacity-90">Produits</h3>
          </div>
          <p className="text-4xl font-bold">{stats?.stock?.total_products || 0}</p>
          <p className="text-sm opacity-80 mt-2">{stats?.stock?.total_quantity || 0} unités en stock</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart size={24} />
            <h3 className="text-sm font-medium uppercase opacity-90">Commandes</h3>
          </div>
          <p className="text-4xl font-bold">{stats?.orders?.total_orders || 0}</p>
          <p className="text-sm opacity-80 mt-2">{stats?.orders?.pending_orders || 0} en attente</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList size={24} />
            <h3 className="text-sm font-medium uppercase opacity-90">Réceptions</h3>
          </div>
          <p className="text-4xl font-bold">{stats?.receipts?.pending_receipts || 0}</p>
          <p className="text-sm opacity-80 mt-2">En attente</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} />
            <h3 className="text-sm font-medium uppercase opacity-90">Stock faible</h3>
          </div>
          <p className="text-4xl font-bold">{stats?.low_stock_products?.length || 0}</p>
          <p className="text-sm opacity-80 mt-2">Produits à réapprovisionner</p>
        </div>
      </div>

      {stats?.low_stock_products?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            Produits en stock faible
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Produit</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Seuil</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Écart</th>
                </tr>
              </thead>
              <tbody>
                {stats.low_stock_products.map((product, i) => (
                  <tr key={product.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 text-sm font-mono">{product.sku}</td>
                    <td className="px-4 py-3 text-sm">{product.name}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {product.current_stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.min_stock_level}</td>
                    <td className="px-4 py-3">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                        -{product.min_stock_level - product.current_stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <TrendingUp size={48} className="mx-auto text-emerald-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Bienvenue sur NEWSTAQ</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Gérez efficacement vos opérations logistiques : réceptions, préparations de commandes, 
          inventaires et rapports en temps réel.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

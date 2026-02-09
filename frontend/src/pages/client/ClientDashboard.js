import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClientSummary } from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingCart, ClipboardList, DollarSign, AlertTriangle, 
  TrendingUp, ArrowRight, Clock, CheckCircle, Truck, Building2
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getClientSummary();
      setData(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  const statusConfig = {
    pending: { label: 'En attente', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    picking: { label: 'Préparation', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    packed: { label: 'Emballé', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    shipped: { label: 'Expédié', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="client-dashboard">
      {/* Header with client info */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bienvenue, {user?.name}</h1>
            <p className="opacity-90">{data?.client?.name} • {data?.client?.code}</p>
          </div>
        </div>
        <p className="text-sm opacity-80">
          Consultez vos données en temps réel : stock, commandes, réceptions et factures.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/client/products" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{data?.products?.product_count || 0}</div>
          <div className="text-sm text-slate-500">Produits</div>
          <div className="text-xs text-blue-600 mt-1">{data?.products?.total_stock || 0} unités en stock</div>
        </Link>

        <Link to="/client/orders" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-emerald-600" size={24} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{data?.orders?.total_orders || 0}</div>
          <div className="text-sm text-slate-500">Commandes</div>
          <div className="text-xs text-emerald-600 mt-1">{data?.orders?.pending || 0} en attente</div>
        </Link>

        <Link to="/client/receipts" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="text-amber-600" size={24} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-amber-500 transition-colors" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{data?.receipts?.total_receipts || 0}</div>
          <div className="text-sm text-slate-500">Réceptions</div>
          <div className="text-xs text-amber-600 mt-1">{data?.receipts?.planned || 0} planifiées</div>
        </Link>

        <Link to="/client/invoices" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-purple-500 transition-colors" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{data?.invoices?.total_invoices || 0}</div>
          <div className="text-sm text-slate-500">Factures</div>
          <div className="text-xs text-purple-600 mt-1">{data?.invoices?.outstanding_amount?.toFixed(2) || 0}€ en attente</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        {data?.low_stock_products?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <AlertTriangle size={20} className="text-red-500" />
              Stock faible
            </h2>
            <div className="space-y-3">
              {data.low_stock_products.slice(0, 5).map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-800">{product.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{product.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600">{product.current_stock} unités</div>
                    <div className="text-xs text-slate-500">Min: {product.min_stock_level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <TrendingUp size={20} className="text-emerald-500" />
              Dernières commandes
            </h2>
            <Link to="/client/orders" className="text-sm text-blue-600 hover:text-blue-700">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {data?.recent_orders?.length > 0 ? (
              data.recent_orders.map(order => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const Icon = config.icon;
                return (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-800">{order.order_number}</div>
                      <div className="text-xs text-slate-500">{order.customer_name || 'N/A'}</div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
                      <Icon size={12} />
                      {config.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Aucune commande récente</p>
            )}
          </div>
        </div>

        {/* Invoice Summary - if no low stock */}
        {(!data?.low_stock_products || data.low_stock_products.length === 0) && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <DollarSign size={20} className="text-purple-500" />
              Résumé facturation
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-800">{data?.invoices?.total_billed?.toFixed(2) || 0}€</div>
                <div className="text-sm text-slate-500">Total facturé</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-600">{data?.invoices?.paid || 0}</div>
                <div className="text-sm text-slate-500">Factures payées</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;

import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/api';
import { ShoppingCart, Search, Clock, Package, CheckCircle, Truck } from 'lucide-react';

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      const response = await getOrders({ status: statusFilter });
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const statusConfig = {
    pending: { label: 'En attente', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    picking: { label: 'Préparation', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    packed: { label: 'Emballé', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    shipped: { label: 'Expédié', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="client-orders">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mes Commandes</h1>
        <p className="text-slate-500">{orders.length} commandes</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = orders.filter(o => o.status === key).length;
          const Icon = config.icon;
          return (
            <div key={key} className={`${config.bg} p-4 rounded-xl flex items-center gap-3`}>
              <Icon size={24} className={config.color} />
              <div>
                <div className={`text-2xl font-bold ${config.color}`}>{count}</div>
                <div className="text-xs text-slate-600">{config.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-80 flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par n° commande ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 rounded-lg bg-white text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="picking">En préparation</option>
          <option value="packed">Emballé</option>
          <option value="shipped">Expédié</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(order => {
          const config = statusConfig[order.status] || statusConfig.pending;
          const Icon = config.icon;
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="font-semibold text-slate-800">{order.order_number}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(order.order_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${config.bg} ${config.color}`}>
                  <Icon size={14} />
                  {config.label}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Client final</span>
                  <span className="font-medium text-slate-800">{order.customer_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Adresse</span>
                  <span className="font-medium text-slate-800 text-right max-w-48 truncate" title={order.shipping_address}>
                    {order.shipping_address || 'N/A'}
                  </span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tracking</span>
                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Aucune commande trouvée</p>
        </div>
      )}
    </div>
  );
};

export default ClientOrders;

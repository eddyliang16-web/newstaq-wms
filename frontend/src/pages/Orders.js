import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders, getClients } from '../services/api';
import api from '../services/api';
import { 
  ShoppingCart, Search, Clock, Package, CheckCircle, Truck, 
  X, Send, Loader2, ExternalLink, AlertCircle, CheckCircle2
} from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingData, setShippingData] = useState({ carrier: 'colissimo', weight: 1.0 });
  const [shippingRates, setShippingRates] = useState([]);
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
    if (user.role === 'admin') loadClients();
  }, [statusFilter, user.role]);

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

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const openShipmentModal = async (order) => {
    setSelectedOrder(order);
    setShippingData({ carrier: 'colissimo', weight: 1.0, service_type: 'standard' });
    setShowShipmentModal(true);
    
    // Load shipping rates
    try {
      const response = await api.get('/carriers/rates', { 
        params: { weight: 1.0 } 
      });
      setShippingRates(response.data.rates || []);
    } catch (error) {
      console.error('Erreur chargement tarifs:', error);
    }
  };

  const createShipment = async () => {
    if (!selectedOrder) return;
    setCreatingShipment(true);
    
    try {
      const response = await api.post('/carriers/create-shipment', {
        order_id: selectedOrder.id,
        carrier: shippingData.carrier,
        service_type: shippingData.service_type || 'standard',
        weight: parseFloat(shippingData.weight) || 1.0
      });
      
      showToast('success', response.data.message || 'Expédition créée avec succès');
      setShowShipmentModal(false);
      loadData();
    } catch (error) {
      showToast('error', error.response?.data?.detail || 'Erreur lors de la création');
    } finally {
      setCreatingShipment(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
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
    <div className="p-6 max-w-7xl mx-auto" data-testid="orders-page">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Commandes</h1>
          <p className="text-slate-500">{orders.length} commandes</p>
        </div>
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
            data-testid="search-orders"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 rounded-lg bg-white text-sm"
          data-testid="status-filter"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="picking">En préparation</option>
          <option value="packed">Emballé</option>
          <option value="shipped">Expédié</option>
        </select>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(order => {
          const config = statusConfig[order.status] || statusConfig.pending;
          const Icon = config.icon;
          const canShip = order.status === 'packed' && !order.tracking_number;
          
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden" data-testid={`order-card-${order.id}`}>
              <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="font-semibold text-slate-800">{order.order_number}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(order.order_date).toLocaleDateString('fr-FR')}
                  </div>
                  {order.external_platform && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                      {order.external_platform === 'shopify' ? '🛍️' : '📦'} {order.external_platform}
                    </span>
                  )}
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
                  <span className="text-slate-500">Priorité</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    order.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {order.priority === 'urgent' ? 'Urgent' : order.priority === 'high' ? 'Haute' : 'Normale'}
                  </span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500">Tracking</span>
                    <a 
                      href={`https://www.laposte.fr/outils/suivre-vos-envois?code=${order.tracking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-mono text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded hover:bg-purple-200"
                    >
                      {order.tracking_number} <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 bg-slate-50 flex justify-between items-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Voir détails
                </button>
                {canShip && (
                  <button 
                    onClick={() => openShipmentModal(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm"
                    data-testid={`ship-order-${order.id}`}
                  >
                    <Truck size={14} />
                    Expédier
                  </button>
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

      {/* Shipment Modal */}
      {showShipmentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Créer une expédition</h3>
                <p className="text-sm text-slate-500">{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setShowShipmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Destination info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-700 mb-2">Destination</div>
                <div className="text-sm text-slate-600">{selectedOrder.customer_name}</div>
                <div className="text-sm text-slate-500">{selectedOrder.shipping_address || 'Adresse non renseignée'}</div>
              </div>

              {/* Carrier selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Transporteur</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingData({ ...shippingData, carrier: 'colissimo' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      shippingData.carrier === 'colissimo' 
                        ? 'border-cyan-500 bg-cyan-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">📮</div>
                    <div className="font-medium text-slate-800">Colissimo</div>
                    <div className="text-xs text-slate-500">2-3 jours</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingData({ ...shippingData, carrier: 'chronopost' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      shippingData.carrier === 'chronopost' 
                        ? 'border-cyan-500 bg-cyan-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="font-medium text-slate-800">Chronopost</div>
                    <div className="text-xs text-slate-500">Express 24h</div>
                  </button>
                </div>
              </div>

              {/* Service type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type de service</label>
                <select
                  value={shippingData.service_type || 'standard'}
                  onChange={(e) => setShippingData({ ...shippingData, service_type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                >
                  {shippingData.carrier === 'colissimo' ? (
                    <>
                      <option value="standard">Standard (sans signature)</option>
                      <option value="signature">Avec signature</option>
                      <option value="pickup">Point relais</option>
                    </>
                  ) : (
                    <>
                      <option value="express">Chrono 13 (avant 13h)</option>
                      <option value="standard">Chrono 18 (avant 18h)</option>
                      <option value="relais">Chrono Relais</option>
                    </>
                  )}
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Poids du colis (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={shippingData.weight}
                  onChange={(e) => setShippingData({ ...shippingData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Rates preview */}
              {shippingRates.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-800 mb-2">Tarifs indicatifs</div>
                  <div className="space-y-2">
                    {shippingRates
                      .filter(rate => rate.carrier.toLowerCase().includes(shippingData.carrier))
                      .map((rate, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-blue-700">{rate.service}</span>
                          <span className="font-medium text-blue-800">{rate.price}€ • {rate.estimatedDays}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Demo mode notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={16} />
                  <div className="text-amber-700">
                    <strong>Mode Démo:</strong> Sans configuration API, un numéro de suivi fictif sera généré. 
                    Configurez vos identifiants transporteur dans Intégrations pour une expédition réelle.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button 
                onClick={() => setShowShipmentModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button 
                onClick={createShipment}
                disabled={creatingShipment}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                data-testid="confirm-shipment-btn"
              >
                {creatingShipment ? (
                  <><Loader2 size={16} className="animate-spin" /> Création...</>
                ) : (
                  <><Send size={16} /> Créer l'expédition</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

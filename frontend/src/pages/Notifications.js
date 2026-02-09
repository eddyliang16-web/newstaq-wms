import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Bell, Search, AlertTriangle, Package, Truck, DollarSign, 
  CheckCircle, XCircle, Clock, Settings, RefreshCw, Mail
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [checkingAlerts, setCheckingAlerts] = useState(false);

  useEffect(() => {
    loadData();
  }, [typeFilter, statusFilter]);

  const loadData = async () => {
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      
      const [historyRes, settingsRes] = await Promise.all([
        api.get('/notifications/history', { params }),
        api.get('/notifications/alert-settings')
      ]);
      setNotifications(historyRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAlerts = async () => {
    setCheckingAlerts(true);
    try {
      const response = await api.post('/notifications/check-alerts');
      alert(`${response.data.alertsSent} alerte(s) créée(s)`);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setCheckingAlerts(false);
    }
  };

  const typeConfig = {
    low_stock: { label: 'Stock faible', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    new_order: { label: 'Nouvelle commande', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    order_shipped: { label: 'Commande expédiée', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    invoice_generated: { label: 'Facture générée', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
    receipt_completed: { label: 'Réception terminée', icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-100' },
  };

  const statusConfig = {
    pending: { label: 'En attente', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    sent: { label: 'Envoyé', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    failed: { label: 'Échec', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  };

  const alertTypes = [
    { type: 'low_stock', name: 'Alerte Stock Faible', description: 'Notification quand un produit passe sous le seuil minimum' },
    { type: 'new_order', name: 'Nouvelle Commande', description: 'Notification à chaque nouvelle commande créée' },
    { type: 'order_shipped', name: 'Commande Expédiée', description: 'Email au client final avec numéro de tracking' },
    { type: 'invoice_generated', name: 'Facture Générée', description: 'Email au client avec facture en pièce jointe' },
    { type: 'receipt_completed', name: 'Réception Terminée', description: 'Notification quand une réception est complétée' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="notifications-page">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500">Gérez vos alertes et notifications automatiques</p>
        </div>
        <button 
          onClick={handleCheckAlerts}
          disabled={checkingAlerts}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          data-testid="check-alerts-btn"
        >
          <RefreshCw size={20} className={checkingAlerts ? 'animate-spin' : ''} />
          Vérifier alertes
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <Bell className="text-cyan-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-slate-800">{notifications.length}</div>
            <div className="text-sm text-slate-500">Total notifications</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <CheckCircle className="text-emerald-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {notifications.filter(n => n.status === 'sent').length}
            </div>
            <div className="text-sm text-slate-500">Envoyées</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <Clock className="text-amber-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {notifications.filter(n => n.status === 'pending').length}
            </div>
            <div className="text-sm text-slate-500">En attente</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <XCircle className="text-red-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter(n => n.status === 'failed').length}
            </div>
            <div className="text-sm text-slate-500">Échecs</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'history' 
              ? 'border-cyan-500 text-cyan-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Historique ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'settings' 
              ? 'border-cyan-500 text-cyan-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Paramètres
        </button>
      </div>

      {activeTab === 'history' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm"
            >
              <option value="">Tous les types</option>
              <option value="low_stock">Stock faible</option>
              <option value="new_order">Nouvelle commande</option>
              <option value="order_shipped">Commande expédiée</option>
              <option value="invoice_generated">Facture générée</option>
              <option value="receipt_completed">Réception terminée</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="sent">Envoyé</option>
              <option value="failed">Échec</option>
            </select>
          </div>

          {/* Notifications list */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Destinataire</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Sujet</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Statut</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif, i) => {
                    const tConfig = typeConfig[notif.type] || typeConfig.low_stock;
                    const sConfig = statusConfig[notif.status] || statusConfig.pending;
                    const TypeIcon = tConfig.icon;
                    const StatusIcon = sConfig.icon;
                    return (
                      <tr key={notif.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${tConfig.bg} ${tConfig.color}`}>
                            <TypeIcon size={12} />
                            {tConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{notif.recipient}</td>
                        <td className="px-4 py-3 text-sm text-slate-800 max-w-xs truncate">{notif.subject}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${sConfig.bg} ${sConfig.color}`}>
                            <StatusIcon size={12} />
                            {sConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {notif.created_at ? new Date(notif.created_at).toLocaleString('fr-FR') : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {notifications.length === 0 && (
              <div className="p-12 text-center">
                <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">Aucune notification</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {alertTypes.map(alert => {
            const config = typeConfig[alert.type];
            const Icon = config?.icon || Bell;
            const setting = settings.find(s => s.alert_type === alert.type);
            const enabled = setting?.enabled ?? true;
            
            return (
              <div key={alert.type} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${config?.bg || 'bg-slate-100'} rounded-xl flex items-center justify-center`}>
                      <Icon size={24} className={config?.color || 'text-slate-500'} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{alert.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{alert.description}</p>
                      {setting?.recipient_emails && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                          <Mail size={12} />
                          {setting.recipient_emails}
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabled}
                      onChange={() => {}}
                      className="sr-only peer" 
                    />
                    <div className={`w-11 h-6 rounded-full peer ${
                      enabled ? 'bg-cyan-500' : 'bg-slate-200'
                    } peer-focus:ring-4 peer-focus:ring-cyan-300 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      enabled ? 'after:translate-x-full' : ''
                    }`}></div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;

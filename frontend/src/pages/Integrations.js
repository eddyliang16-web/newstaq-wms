import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getClients } from '../services/api';
import api from '../services/api';
import { 
  Link2, Plus, Search, ShoppingBag, Truck, Store, 
  Check, X, RefreshCw, ExternalLink, Settings, Trash2,
  Key, AlertCircle, CheckCircle2, Loader2, Package
} from 'lucide-react';

const Integrations = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState({});
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configData, setConfigData] = useState({});
  const [syncing, setSyncing] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
    if (user.role === 'admin') loadClients();
  }, [selectedClient, user.role]);

  const loadData = async () => {
    try {
      const params = selectedClient ? { client_id: selectedClient } : {};
      const [integrationsRes, platformsRes] = await Promise.all([
        api.get('/integrations', { params }),
        api.get('/integrations/available')
      ]);
      setIntegrations(integrationsRes.data);
      setAvailablePlatforms(platformsRes.data);
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

  const handleDeleteIntegration = async (id) => {
    if (!window.confirm('Supprimer cette intégration ?')) return;
    try {
      await api.delete(`/integrations/${id}`);
      showToast('success', 'Intégration supprimée');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  const openConfigModal = (integration) => {
    setSelectedIntegration(integration);
    setConfigData({
      store_url: integration.store_url || '',
      api_key: integration.api_key || '',
      api_secret: integration.api_secret || '',
      access_token: integration.access_token || ''
    });
    setShowConfigModal(true);
  };

  const saveConfiguration = async () => {
    if (!selectedIntegration) return;
    
    try {
      if (selectedIntegration.platform === 'shopify') {
        await api.post('/shopify/configure', {
          integration_id: selectedIntegration.id,
          store_url: configData.store_url,
          api_key: configData.api_key,
          api_secret: configData.api_secret,
          access_token: configData.access_token
        });
      } else if (['colissimo', 'chronopost'].includes(selectedIntegration.platform)) {
        await api.post('/carriers/configure', {
          carrier: selectedIntegration.platform,
          client_id: selectedIntegration.client_id,
          account_number: configData.account_number || '',
          api_key: configData.api_key,
          api_secret: configData.api_secret
        });
      }
      
      showToast('success', 'Configuration enregistrée');
      setShowConfigModal(false);
      loadData();
    } catch (error) {
      showToast('error', error.response?.data?.detail || 'Erreur de configuration');
    }
  };

  const syncIntegration = async (integration) => {
    setSyncing(integration.id);
    setSyncResult(null);
    
    try {
      let result;
      
      if (integration.platform === 'shopify') {
        result = await api.post('/shopify/sync-orders', {
          integration_id: integration.id
        });
      } else {
        // Mock sync for other platforms
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = { data: { success: true, message: 'Synchronisation simulée (mode démo)' }};
      }
      
      setSyncResult({ id: integration.id, ...result.data });
      showToast('success', result.data.message || 'Synchronisation effectuée');
      loadData();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Erreur de synchronisation';
      setSyncResult({ id: integration.id, error: errorMsg });
      showToast('error', errorMsg);
    } finally {
      setSyncing(null);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const platformIcons = {
    shopify: '🛍️', woocommerce: '🔮', prestashop: '🛒', magento: '🔷', bigcommerce: '📦',
    amazon: '📦', zalando: '👗', cdiscount: '🏷️', tiktok_shop: '🎵', veepee: '🏷️',
    smallable: '👶', decathlon: '⚽', fnac_darty: '💻', leroy_merlin: '🔨', manomano: '🔧',
    chronopost: '⚡', colissimo: '📮', gls: '🚚', dhl: '✈️', ups: '📤', fedex: '📦',
    mondial_relay: '📍', relais_colis: '📍', amazon_shipping: '📦', dpd: '🚛'
  };

  const typeLabels = { cms: 'CMS / E-commerce', marketplace: 'Marketplace', carrier: 'Transporteurs' };
  const typeIcons = { cms: Store, marketplace: ShoppingBag, carrier: Truck };

  const getConfigFields = (platform) => {
    if (platform === 'shopify') {
      return [
        { key: 'store_url', label: 'URL de la boutique', placeholder: 'votre-boutique.myshopify.com', required: true },
        { key: 'api_key', label: 'API Key', placeholder: 'Clé API Shopify', required: true },
        { key: 'api_secret', label: 'API Secret', placeholder: 'Secret API', required: true },
        { key: 'access_token', label: 'Access Token', placeholder: 'Token d\'accès Admin API', required: true }
      ];
    } else if (['colissimo', 'chronopost'].includes(platform)) {
      return [
        { key: 'account_number', label: 'Numéro de compte', placeholder: 'Numéro contrat transporteur', required: true },
        { key: 'api_key', label: 'Identifiant API', placeholder: 'Identifiant ou login API', required: true },
        { key: 'api_secret', label: 'Mot de passe API', placeholder: 'Mot de passe ou secret', required: false }
      ];
    }
    return [
      { key: 'api_key', label: 'Clé API', placeholder: 'Votre clé API', required: true },
      { key: 'api_secret', label: 'Secret API', placeholder: 'Votre secret API', required: false }
    ];
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="integrations-page">
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
          <h1 className="text-2xl font-bold text-slate-800">Intégrations</h1>
          <p className="text-slate-500">Connectez vos canaux de vente et transporteurs</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
          data-testid="add-integration-btn"
        >
          <Plus size={20} />
          Nouvelle intégration
        </button>
      </div>

      {/* API Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Key className="text-blue-500 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-800">Intégrations API en direct</h3>
            <p className="text-sm text-blue-600 mt-1">
              Les intégrations <strong>Shopify</strong>, <strong>Colissimo</strong> et <strong>Chronopost</strong> 
              supportent la connexion API réelle. Configurez vos identifiants pour activer la synchronisation automatique.
            </p>
          </div>
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-lg bg-white text-sm"
          >
            <option value="">Tous les clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'active' 
              ? 'border-cyan-500 text-cyan-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Intégrations actives ({integrations.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'available' 
              ? 'border-cyan-500 text-cyan-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Plateformes disponibles
        </button>
      </div>

      {activeTab === 'active' ? (
        <div className="space-y-4">
          {integrations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Link2 size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune intégration active</h3>
              <p className="text-slate-500 mb-4">Connectez vos canaux de vente pour automatiser vos flux</p>
              <button 
                onClick={() => setActiveTab('available')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
              >
                Voir les plateformes disponibles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map(integration => (
                <div key={integration.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platformIcons[integration.platform] || '🔗'}</span>
                        <div>
                          <div className="font-semibold text-slate-800 capitalize">{integration.platform.replace('_', ' ')}</div>
                          <div className="text-xs text-slate-500">{integration.store_name}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          integration.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {integration.status === 'active' ? <Check size={12} /> : <X size={12} />}
                          {integration.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                        {integration.access_token && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            <Key size={10} />
                            API configurée
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type</span>
                      <span className="text-slate-700 capitalize">{integration.platform_type}</span>
                    </div>
                    {integration.store_url && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">URL</span>
                        <span className="text-slate-700 truncate max-w-32">{integration.store_url}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sync commandes</span>
                      <span className={integration.auto_sync_orders ? 'text-emerald-600' : 'text-slate-400'}>
                        {integration.auto_sync_orders ? 'Oui' : 'Non'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sync stock</span>
                      <span className={integration.auto_sync_stock ? 'text-emerald-600' : 'text-slate-400'}>
                        {integration.auto_sync_stock ? 'Oui' : 'Non'}
                      </span>
                    </div>
                    {integration.last_sync && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dernière sync</span>
                        <span className="text-slate-700">{new Date(integration.last_sync).toLocaleString('fr-FR')}</span>
                      </div>
                    )}
                    
                    {/* Sync result */}
                    {syncResult && syncResult.id === integration.id && (
                      <div className={`mt-2 p-2 rounded-lg text-xs ${
                        syncResult.error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {syncResult.error ? (
                          <span className="flex items-center gap-1"><AlertCircle size={12} /> {syncResult.error}</span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={12} /> 
                            {syncResult.ordersImported !== undefined 
                              ? `${syncResult.ordersImported} commandes importées` 
                              : syncResult.message}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-slate-50 flex justify-between">
                    <button 
                      onClick={() => syncIntegration(integration)}
                      disabled={syncing === integration.id}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-slate-400"
                    >
                      {syncing === integration.id ? (
                        <><Loader2 size={14} className="animate-spin" /> Synchronisation...</>
                      ) : (
                        <><RefreshCw size={14} /> Synchroniser</>
                      )}
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openConfigModal(integration)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Configurer l'API"
                      >
                        <Settings size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteIntegration(integration.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(availablePlatforms).map(([type, platforms]) => {
            const Icon = typeIcons[type] || Link2;
            return (
              <div key={type}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                  <Icon size={20} className="text-cyan-500" />
                  {typeLabels[type]}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {platforms.map(platform => {
                    const isConnected = integrations.some(i => i.platform === platform.id);
                    const hasApiSupport = ['shopify', 'colissimo', 'chronopost'].includes(platform.id);
                    return (
                      <div 
                        key={platform.id} 
                        className={`bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                          isConnected ? 'border-emerald-200' : 'border-transparent hover:border-cyan-200'
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-3xl mb-2 block">{platformIcons[platform.id] || '🔗'}</span>
                          <div className="font-medium text-slate-800 text-sm mb-1">{platform.name}</div>
                          {isConnected && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <Check size={12} />
                              Connecté
                            </span>
                          )}
                          {hasApiSupport && (
                            <span className="block mt-1 text-xs text-blue-500 font-medium">
                              🔌 API disponible
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Nouvelle intégration</h3>
            <p className="text-slate-500 text-sm mb-4">
              Sélectionnez une plateforme dans l'onglet "Plateformes disponibles" pour configurer une nouvelle intégration.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Fermer
              </button>
              <button 
                onClick={() => { setShowAddModal(false); setActiveTab('available'); }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
              >
                Voir les plateformes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{platformIcons[selectedIntegration.platform] || '🔗'}</span>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 capitalize">
                  Configuration {selectedIntegration.platform.replace('_', ' ')}
                </h3>
                <p className="text-sm text-slate-500">{selectedIntegration.store_name}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {getConfigFields(selectedIntegration.platform).map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.key.includes('secret') || field.key.includes('token') || field.key.includes('password') ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={configData[field.key] || ''}
                    onChange={(e) => setConfigData({ ...configData, [field.key]: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              ))}
              
              {selectedIntegration.platform === 'shopify' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-blue-800 mb-2">💡 Comment obtenir les clés API Shopify :</p>
                  <ol className="list-decimal list-inside text-blue-700 space-y-1">
                    <li>Accédez à votre admin Shopify</li>
                    <li>Allez dans Apps → App Development</li>
                    <li>Créez une app privée ou utilisez une existante</li>
                    <li>Copiez les identifiants Admin API</li>
                  </ol>
                  <a 
                    href="https://shopify.dev/docs/api/admin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:underline"
                  >
                    Documentation Shopify <ExternalLink size={12} />
                  </a>
                </div>
              )}
              
              {['colissimo', 'chronopost'].includes(selectedIntegration.platform) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-amber-800 mb-2">📦 Configuration transporteur :</p>
                  <p className="text-amber-700">
                    {selectedIntegration.platform === 'colissimo' 
                      ? 'Obtenez vos identifiants sur le portail Colissimo Entreprise : colissimo.entreprise.laposte.fr'
                      : 'Obtenez vos identifiants sur le portail Chronopost : chronopost.fr/fr/espace-client'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button 
                onClick={saveConfiguration}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2"
              >
                <Key size={16} />
                Enregistrer la configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;

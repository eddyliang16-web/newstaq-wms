import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInventory, getClients } from '../services/api';
import { Warehouse, Search, Package, MapPin } from 'lucide-react';

const Inventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    loadData();
    if (user.role === 'admin') loadClients();
  }, [selectedClient, user.role]);

  const loadData = async () => {
    try {
      const clientId = user.role === 'admin' ? selectedClient : user.client_id;
      const response = await getInventory({ client_id: clientId });
      setInventory(response.data);
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

  const filtered = inventory.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuantity = filtered.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueProducts = new Set(filtered.map(item => item.product_id)).size;
  const uniqueLocations = new Set(filtered.map(item => item.location_id)).size;

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="inventory-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Inventaire</h1>
        <p className="text-slate-500">{totalQuantity} unités • {uniqueProducts} produits • {uniqueLocations} emplacements</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-80 flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher produit, SKU ou emplacement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        {user.role === 'admin' && (
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-lg bg-white text-sm"
          >
            <option value="">Tous les clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <Package className="text-blue-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalQuantity}</div>
            <div className="text-sm text-slate-500">Unités en stock</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <Warehouse className="text-emerald-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-slate-800">{uniqueProducts}</div>
            <div className="text-sm text-slate-500">Produits différents</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <MapPin className="text-amber-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-slate-800">{uniqueLocations}</div>
            <div className="text-sm text-slate-500">Emplacements utilisés</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Produit</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Emplacement</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Zone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Quantité</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Client</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.product_name}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{item.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.location_code}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">{item.zone_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.client_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Warehouse size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Aucun inventaire trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;

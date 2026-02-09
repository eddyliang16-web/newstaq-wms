import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, getClients } from '../services/api';
import { Package, Search, Plus, AlertTriangle } from 'lucide-react';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
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
      const response = await getProducts(clientId);
      setProducts(response.data);
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="products-page">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Produits</h1>
          <p className="text-slate-500">{products.length} produits</p>
        </div>
        {user.role === 'admin' && (
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            <Plus size={20} />
            Nouveau produit
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-80 flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
            data-testid="product-search"
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Produit</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Client</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={product.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{product.name}</div>
                        {product.barcode && <div className="text-xs text-slate-400">{product.barcode}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                      {product.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        product.total_stock <= product.min_stock_level 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.total_stock}
                      </span>
                      {product.total_stock <= product.min_stock_level && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.client_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

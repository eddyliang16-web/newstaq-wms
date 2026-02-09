import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReceipts, getClients } from '../services/api';
import { ClipboardList, Search, Clock, Package, CheckCircle } from 'lucide-react';

const Receipts = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    if (user.role === 'admin') loadClients();
  }, [user.role]);

  const loadData = async () => {
    try {
      const response = await getReceipts();
      setReceipts(response.data);
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

  const filtered = receipts.filter(r =>
    r.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.supplier_name && r.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const statusConfig = {
    planned: { label: 'Planifiée', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    in_progress: { label: 'En cours', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    completed: { label: 'Terminée', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="receipts-page">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Réceptions</h1>
          <p className="text-slate-500">{receipts.length} réceptions</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-80 flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par n° réception ou fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(receipt => {
          const config = statusConfig[receipt.status] || statusConfig.planned;
          const Icon = config.icon;
          return (
            <div key={receipt.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="font-semibold text-slate-800">{receipt.receipt_number}</div>
                  <div className="text-sm text-slate-500">{receipt.client_name}</div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${config.bg} ${config.color}`}>
                  <Icon size={14} />
                  {config.label}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Fournisseur</span>
                  <span className="font-medium text-slate-800">{receipt.supplier_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date prévue</span>
                  <span className="font-medium text-slate-800">
                    {receipt.expected_date ? new Date(receipt.expected_date).toLocaleDateString('fr-FR') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Aucune réception trouvée</p>
        </div>
      )}
    </div>
  );
};

export default Receipts;

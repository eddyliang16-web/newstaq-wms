import React, { useState, useEffect } from 'react';
import { getInventoryCounts } from '../services/api';
import { BarChart3, Search, Clock, CheckCircle } from 'lucide-react';

const InventoryCounts = () => {
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getInventoryCounts();
      setCounts(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    planned: { label: 'Planifié', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    in_progress: { label: 'En cours', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100' },
    completed: { label: 'Terminé', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="inventory-counts-page">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Comptages Inventaire</h1>
          <p className="text-slate-500">{counts.length} comptages</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-80 flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      {counts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Aucun comptage enregistré</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counts.map(count => {
            const config = statusConfig[count.status] || statusConfig.planned;
            const Icon = config.icon;
            return (
              <div key={count.id} className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-slate-800">{count.count_number}</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
                    <Icon size={12} />
                    {config.label}
                  </span>
                </div>
                <div className="text-sm text-slate-500">
                  {count.count_date ? new Date(count.count_date).toLocaleDateString('fr-FR') : 'Date non définie'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryCounts;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInvoices, getClients } from '../services/api';
import { DollarSign, Search, FileText, CheckCircle, Clock, Send } from 'lucide-react';

const Billing = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    if (user.role === 'admin') loadClients();
  }, [user.role]);

  const loadData = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data);
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

  const filtered = invoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusConfig = {
    draft: { label: 'Brouillon', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
    sent: { label: 'Envoyée', icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' },
    paid: { label: 'Payée', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    overdue: { label: 'En retard', icon: Clock, color: 'text-red-600', bg: 'bg-red-100' },
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const unpaidAmount = invoices.filter(i => i.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-96 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="billing-page">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Facturation</h1>
          <p className="text-slate-500">{invoices.length} factures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <DollarSign className="text-slate-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalAmount.toFixed(2)}€</div>
            <div className="text-sm text-slate-500">Total facturé</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <CheckCircle className="text-emerald-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-emerald-600">{paidAmount.toFixed(2)}€</div>
            <div className="text-sm text-slate-500">Payé</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
          <Clock className="text-amber-500" size={24} />
          <div>
            <div className="text-2xl font-bold text-amber-600">{unpaidAmount.toFixed(2)}€</div>
            <div className="text-sm text-slate-500">En attente</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-80 flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par n° facture ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Facture</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Client</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Période</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Montant</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Échéance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice, i) => {
                const config = statusConfig[invoice.status] || statusConfig.draft;
                const Icon = config.icon;
                return (
                  <tr key={invoice.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm">{invoice.invoice_number}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{invoice.client_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(invoice.billing_period_start).toLocaleDateString('fr-FR')} -
                      {new Date(invoice.billing_period_end).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{invoice.total.toFixed(2)}€</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <Icon size={12} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <DollarSign size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Aucune facture trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;

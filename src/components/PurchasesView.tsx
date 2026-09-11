import React, { useState } from 'react';
import { Plus, Search, Truck, Trash2, Calendar, DollarSign, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Purchase } from '../types';

interface PurchasesViewProps {
  onOpenNewPurchaseModal: () => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({ onOpenNewPurchaseModal }) => {
  const { purchases, deletePurchase, settings, t, language, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPurchases = purchases.filter(p => 
    p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPurchasesCost = purchases.reduce((acc, p) => acc + p.totalCost, 0);
  const totalPaid = purchases.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalRemaining = purchases.reduce((acc, p) => acc + p.remainingAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('purchases')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'خام مال، شیٹس اور پرنٹنگ میٹریل کی خریداری' : 'Raw materials, acrylic sheets, vinyl & hardware purchases'}
          </p>
        </div>

        <button
          onClick={onOpenNewPurchaseModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-sky-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('newPurchase')}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{t('totalPurchases')}</span>
          <div className="text-xl font-black text-white mt-1">
            {settings.currency} {totalPurchasesCost.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{purchases.length} total procurement invoices</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{language === 'ur' ? 'ادا شدہ رقم' : 'Total Paid Out'}</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {settings.currency} {totalPaid.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Cleared with suppliers</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{language === 'ur' ? 'سپلائر بقایا جات' : 'Supplier Payables Due'}</span>
          <div className="text-xl font-black text-sky-400 mt-1">
            {settings.currency} {totalRemaining.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pending settlement</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <Search className="w-4 h-4 text-slate-500 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={language === 'ur' ? 'سپلائر، میٹریل، یا خریداری انوائس تلاش کریں...' : 'Search supplier, material name, invoice...'}
          className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500"
        />
      </div>

      {/* Purchases List */}
      <div className="space-y-3">
        {filteredPurchases.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
            <p className="text-sm font-semibold">
              {language === 'ur' ? 'کوئی خریداری ریکارڈ نہیں ملا' : 'No purchase records found.'}
            </p>
          </div>
        ) : (
          filteredPurchases.map(pur => (
            <div
              key={pur.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/30">
                    {pur.invoiceNumber}
                  </span>
                  <span className="text-sm font-black text-white">
                    {pur.supplierName}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {pur.purchaseDate}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-200">
                  {pur.materialName} — <span className="text-sky-400 font-semibold">{pur.quantity} {pur.unit}</span> @ {settings.currency} {pur.purchaseRate.toLocaleString()}
                </p>

                {pur.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    Note: {pur.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-3 rounded-xl shrink-0">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('totalCost')}</span>
                  <span className="text-sm font-black text-white">
                    {settings.currency} {pur.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('paidAmount')}</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {settings.currency} {pur.paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('remainingAmount')}</span>
                  <span className={`text-sm font-black ${pur.remainingAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {settings.currency} {pur.remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    if (confirm(t('confirmDelete'))) {
                      deletePurchase(pur.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition cursor-pointer self-end lg:self-auto"
                  title="Delete purchase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

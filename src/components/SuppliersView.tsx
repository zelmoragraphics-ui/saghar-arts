import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  Phone, 
  MapPin, 
  DollarSign, 
  Trash2, 
  Edit2, 
  Truck,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Supplier, PaymentMethod } from '../types';

export const SuppliersView: React.FC = () => {
  const { 
    suppliers, 
    purchases, 
    addSupplier, 
    updateSupplier, 
    deleteSupplier, 
    settings, 
    t, 
    language, 
    user 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Add / Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [itemsText, setItemsText] = useState('');
  const [notes, setNotes] = useState('');

  // Payment to Supplier modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Bank');
  const [payNote, setPayNote] = useState<string>('');

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact.includes(searchQuery) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayables = suppliers.reduce((acc, s) => acc + s.remainingAmount, 0);

  const handleOpenAdd = () => {
    setName('');
    setCompanyName('');
    setContact('');
    setAddress('');
    setItemsText('');
    setNotes('');
    setEditingSupplier(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setName(s.name);
    setCompanyName(s.companyName);
    setContact(s.contact);
    setAddress(s.address);
    setItemsText(s.purchasedItems.join(', '));
    setNotes(s.notes || '');
    setShowAddModal(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const purchasedItems = itemsText.split(',').map(i => i.trim()).filter(Boolean);

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, {
        name,
        companyName,
        contact,
        address,
        purchasedItems,
        notes
      });
    } else {
      addSupplier({
        name,
        companyName,
        contact,
        address,
        purchasedItems,
        notes
      });
    }

    setShowAddModal(false);
  };

  const handlePaySupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || payAmount <= 0) return;

    const newPaid = selectedSupplier.totalPaid + payAmount;
    const newRemaining = Math.max(0, selectedSupplier.remainingAmount - payAmount);

    updateSupplier(selectedSupplier.id, {
      totalPaid: newPaid,
      remainingAmount: newRemaining
    });

    setShowPayModal(false);
    setPayAmount(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('suppliers')} ({suppliers.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'شیٹس، ایل ای ڈی اور ہارڈویئر سپلائرز اور واجب الادا ادائیگیاں' : 'Material distributors, vendors, purchase ledgers & payable accounts'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">
            Total Due: <strong className="text-white">{settings.currency} {totalPayables.toLocaleString()}</strong>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-sky-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('addSupplier')}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <Search className="w-4 h-4 text-slate-500 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={language === 'ur' ? 'سپلائر یا کمپنی تلاش کریں...' : 'Search supplier name, company or contact...'}
          className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500"
        />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(sup => (
          <div
            key={sup.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-black text-white">
                    {sup.name}
                  </h3>
                  <span className="text-xs font-semibold text-sky-400">
                    {sup.companyName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(sup)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm(t('confirmDelete'))) {
                          deleteSupplier(sup.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-400 mt-2">
                <p className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-200">{sup.contact}</span>
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sup.address}</span>
                </p>
              </div>

              {sup.purchasedItems.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {sup.purchasedItems.map((it, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {it}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Paid</span>
                  <span className="font-bold text-emerald-400">{settings.currency} {sup.totalPaid.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Payable Due</span>
                  <span className={`font-black ${sup.remainingAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {settings.currency} {sup.remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSupplier(sup);
                  setPayAmount(sup.remainingAmount);
                  setShowPayModal(true);
                }}
                disabled={sup.remainingAmount <= 0}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-sky-400 border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Pay Supplier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-4">
              {editingSupplier ? 'Edit Supplier' : t('addSupplier')}
            </h3>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('supplierName')} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haji Munir"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('companyName')}</label>
                <input
                  type="text"
                  placeholder="e.g. Faisalabad Acrylic & Flex Traders"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('contact')} *</label>
                <input
                  type="text"
                  required
                  placeholder="03007654321"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('address')}</label>
                <input
                  type="text"
                  placeholder="e.g. Railway Road, Faisalabad"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Purchased Materials (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Acrylic Sheets, Vinyl, Solvent Ink"
                  value={itemsText}
                  onChange={e => setItemsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Supplier Modal */}
      {showPayModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-1">
              Pay Supplier: {selectedSupplier.companyName || selectedSupplier.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Payable Balance: <strong className="text-rose-400">{settings.currency} {selectedSupplier.remainingAmount.toLocaleString()}</strong>
            </p>

            <form onSubmit={handlePaySupplierSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Amount ({settings.currency})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedSupplier.remainingAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-hidden"
                >
                  <option value="Bank">Bank Transfer / Cheque</option>
                  <option value="Cash">Cash</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Receipt / Transaction Ref</label>
                <input
                  type="text"
                  placeholder="e.g. HBL Online transfer ref # 994821"
                  value={payNote}
                  onChange={e => setPayNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

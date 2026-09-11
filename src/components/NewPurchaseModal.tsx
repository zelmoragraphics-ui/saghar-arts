import React, { useState } from 'react';
import { X, Plus, Truck, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({ isOpen, onClose }) => {
  const { suppliers, addSupplier, materials, createPurchase, purchases, settings, t, language } = useApp();

  const nextPurInvoice = `PINV-2026-${purchases.length + 91}`;

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [isQuickAddSupplier, setIsQuickAddSupplier] = useState(false);
  const [newSupName, setNewSupName] = useState('');
  const [newSupCompany, setNewSupCompany] = useState('');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupAddress, setNewSupAddress] = useState('');

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(5);
  const [purchaseRate, setPurchaseRate] = useState<number>(materials[0]?.costPerUnit || 1000);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalCost = quantity * purchaseRate;
  const remainingAmount = Math.max(0, totalCost - paidAmount);

  const handleMaterialChange = (matId: string) => {
    setSelectedMaterialId(matId);
    const m = materials.find(mat => mat.id === matId);
    if (m) {
      setPurchaseRate(m.costPerUnit || 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalSupId = selectedSupplierId;
    let finalSupName = '';

    if (isQuickAddSupplier) {
      if (!newSupName.trim()) {
        alert("Please enter supplier name");
        return;
      }
      const created = addSupplier({
        name: newSupName,
        companyName: newSupCompany || newSupName,
        contact: newSupContact,
        address: newSupAddress,
        purchasedItems: [],
        notes: 'Quick added from purchase module'
      });
      finalSupId = created.id;
      finalSupName = created.name;
    } else {
      const existing = suppliers.find(s => s.id === selectedSupplierId);
      if (!existing) {
        alert("Please select a supplier");
        return;
      }
      finalSupName = existing.name;
    }

    const materialObj = materials.find(m => m.id === selectedMaterialId);
    const materialName = materialObj ? materialObj.name : 'Raw Material';
    const unit = materialObj ? materialObj.unit : 'Units';

    createPurchase({
      invoiceNumber: nextPurInvoice,
      supplierId: finalSupId,
      supplierName: finalSupName,
      materialId: selectedMaterialId,
      materialName,
      quantity,
      unit,
      purchaseRate,
      totalCost,
      paidAmount,
      remainingAmount,
      purchaseDate,
      paymentMethod,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl relative">
        <div className="p-4 sm:p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">
              {language === 'ur' ? 'نئی خریداری درج کریں (اسٹاک میں خودکار اضافہ)' : 'Record New Material Purchase'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Invoice: <strong className="text-sky-400 font-mono">{nextPurInvoice}</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-700/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Supplier Select or Add */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase">{t('supplier')}</span>
              <button
                type="button"
                onClick={() => setIsQuickAddSupplier(!isQuickAddSupplier)}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
              >
                {isQuickAddSupplier ? 'Select Existing Supplier' : '+ Quick Add Supplier'}
              </button>
            </div>

            {!isQuickAddSupplier ? (
              <select
                value={selectedSupplierId}
                onChange={e => setSelectedSupplierId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-sky-500 focus:outline-hidden"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.companyName}) - {s.contact}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Supplier Name *"
                  value={newSupName}
                  onChange={e => setNewSupName(e.target.value)}
                  required={isQuickAddSupplier}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Company / Store Name"
                  value={newSupCompany}
                  onChange={e => setNewSupCompany(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newSupContact}
                  onChange={e => setNewSupContact(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Address (e.g. Railway Road, FSD)"
                  value={newSupAddress}
                  onChange={e => setNewSupAddress(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>
            )}
          </div>

          {/* Material & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('material')}</label>
              <select
                value={selectedMaterialId}
                onChange={e => handleMaterialChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
              >
                {materials.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.currentStock} {m.unit} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('quantity')}</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('purchaseRate')} ({settings.currency})</label>
              <input
                type="number"
                min="1"
                value={purchaseRate}
                onChange={e => setPurchaseRate(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('paidAmount')} ({settings.currency})</label>
              <input
                type="number"
                min="0"
                max={totalCost}
                value={paidAmount}
                onChange={e => setPaidAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('paymentMethod')}</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('purchaseDate')}</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes / Batch Info</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Delivered to workshop warehouse, 3mm cast sheets"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Cost Preview Bar */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('totalCost')}</span>
              <span className="text-lg font-black text-white">
                {settings.currency} {totalCost.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('remainingAmount')}</span>
              <span className={`text-lg font-black ${remainingAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {settings.currency} {remainingAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-sky-500/20"
              >
                {language === 'ur' ? 'خریداری محفوظ کریں' : 'Save & Add to Stock'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

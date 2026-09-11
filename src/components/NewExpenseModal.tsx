import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose }) => {
  const { createExpense, settings, t, language } = useApp();

  const standardExpenseCategories = [
    'Shop Rent',
    'Electricity Bill',
    'Generator Fuel',
    'CNC / Laser Maintenance',
    'Food / Tea',
    'Transportation / Delivery',
    'Staff Commission',
    'Tools / Hardware',
    'Internet Bill',
    'Other Expenses'
  ];

  const [category, setCategory] = useState(standardExpenseCategories[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState<number>(1000);
  const [paidTo, setPaidTo] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const finalCategory = category === 'Other Expenses' && customCategory ? customCategory : category;

    createExpense({
      category: finalCategory,
      amount,
      paidTo: paidTo || 'Vendor / Utility',
      date,
      notes,
      paymentMethod
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-black text-white">
            {language === 'ur' ? 'نیا خرچہ درج کریں' : 'Record Business Expense'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t('expenseCategory')} *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-rose-500 focus:outline-hidden"
            >
              {standardExpenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {category === 'Other Expenses' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">Custom Expense Name</label>
              <input
                type="text"
                placeholder="e.g. Signboard installation ladder repair"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-hidden"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('amount')} ({settings.currency}) *</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Paid To *</label>
              <input
                type="text"
                required
                placeholder="e.g. FESCO / Landlord / Shell Pump"
                value={paidTo}
                onChange={e => setPaidTo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-hidden"
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes / Receipt Ref</label>
            <input
              type="text"
              placeholder="e.g. Bill # 29188 Paid online"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-rose-500/20"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

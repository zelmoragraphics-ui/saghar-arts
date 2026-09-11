import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  DollarSign, 
  Calendar, 
  Trash2, 
  PieChart as PieChartIcon, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

interface ExpensesViewProps {
  onOpenNewExpenseModal: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ onOpenNewExpenseModal }) => {
  const { expenses, deleteExpense, settings, t, language, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  const filteredExpenses = expenses.filter(e => {
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesSearch = 
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Group by category
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('expenses')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'دکان کرایہ، بجلی بل، جنریٹر فیول، چائے کھانا اور مشینری مرمت' : 'Daily operational costs, utilities, rent, generator fuel & workshop maintenance'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            Total OpEx: <strong className="text-white">{settings.currency} {totalExpenses.toLocaleString()}</strong>
          </div>
          <button
            onClick={onOpenNewExpenseModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-rose-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('newExpense')}</span>
          </button>
        </div>
      </div>

      {/* Category Breakdown Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(categoryTotals).map(([cat, amt]) => (
          <div 
            key={cat}
            onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
            className={`p-3 rounded-xl border transition cursor-pointer ${
              categoryFilter === cat 
                ? 'bg-rose-500/20 border-rose-500 text-white' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] text-slate-400 block truncate">{cat}</span>
            <span className="text-xs sm:text-sm font-extrabold text-rose-400 mt-0.5 block">
              {settings.currency} {amt.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-950 border border-slate-700 text-xs font-semibold text-white rounded-xl focus:outline-hidden"
        >
          <option value="all">{language === 'ur' ? 'تمام کیٹگریز' : 'All Expense Categories'}</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'ur' ? 'خرچہ یا وصول کنندہ تلاش کریں...' : 'Search expense, paid to or note...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-rose-500"
          />
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
            <p className="text-sm font-semibold">No expenses found matching filter.</p>
          </div>
        ) : (
          filteredExpenses.map(exp => (
            <div
              key={exp.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
                    {exp.category}
                  </span>
                  <span className="text-sm font-bold text-white">
                    Paid to: {exp.paidTo}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.date}
                  </span>
                </div>

                {exp.notes && (
                  <p className="text-xs text-slate-400 mt-1">
                    {exp.notes}
                  </p>
                )}

                <div className="text-[11px] text-slate-500">
                  Payment mode: <strong className="text-slate-400">{exp.paymentMethod}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <span className="text-base sm:text-lg font-black text-rose-400">
                  {settings.currency} {exp.amount.toLocaleString()}
                </span>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      if (confirm(t('confirmDelete'))) {
                        deleteExpense(exp.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

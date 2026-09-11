import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Printer, 
  DollarSign, 
  Filter, 
  FileText,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';

export const ProfitLossView: React.FC = () => {
  const { orders, purchases, expenses, salaries, settings, t, language } = useApp();

  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'this_month' | 'custom'>('all');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.slice(0, 7); // '2026-09'

  // Filter lists based on date filter
  const filteredOrders = orders.filter(o => {
    const d = o.createdAt.split('T')[0];
    if (dateRangeFilter === 'today') return d === todayStr;
    if (dateRangeFilter === 'this_month') return d.startsWith(currentMonthStr);
    if (dateRangeFilter === 'custom') return d >= startDate && d <= endDate;
    return true;
  });

  const filteredPurchases = purchases.filter(p => {
    const d = p.purchaseDate;
    if (dateRangeFilter === 'today') return d === todayStr;
    if (dateRangeFilter === 'this_month') return d.startsWith(currentMonthStr);
    if (dateRangeFilter === 'custom') return d >= startDate && d <= endDate;
    return true;
  });

  const filteredExpenses = expenses.filter(e => {
    const d = e.date;
    if (dateRangeFilter === 'today') return d === todayStr;
    if (dateRangeFilter === 'this_month') return d.startsWith(currentMonthStr);
    if (dateRangeFilter === 'custom') return d >= startDate && d <= endDate;
    return true;
  });

  const filteredSalaries = salaries.filter(s => {
    const d = s.paymentDate;
    if (dateRangeFilter === 'today') return d === todayStr;
    if (dateRangeFilter === 'this_month') return d.startsWith(currentMonthStr);
    if (dateRangeFilter === 'custom') return d >= startDate && d <= endDate;
    return true;
  });

  // Calculate totals
  const totalSales = filteredOrders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalPurchases = filteredPurchases.reduce((acc, p) => acc + p.totalCost, 0);
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalSalaries = filteredSalaries.reduce((acc, s) => acc + s.netSalary, 0);

  const totalCostOfDoingBusiness = totalPurchases + totalExpenses + totalSalaries;
  const netProfit = totalSales - totalCostOfDoingBusiness;
  const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0';

  // Export to CSV
  const handleExportCSV = () => {
    const csvContent = 
      "Category,Amount\n" +
      `Total Sales,${totalSales}\n` +
      `Material Purchases,${totalPurchases}\n` +
      `Operational Expenses,${totalExpenses}\n` +
      `Payroll & Salaries,${totalSalaries}\n` +
      `Total Outflow,${totalCostOfDoingBusiness}\n` +
      `Net Profit,${netProfit}\n` +
      `Profit Margin,${profitMargin}%\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SAGHAR_ARTS_Profit_Loss_${dateRangeFilter}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = [
    { name: 'Revenue', amount: totalSales, fill: '#f59e0b' },
    { name: 'Materials', amount: totalPurchases, fill: '#38bdf8' },
    { name: 'OpEx', amount: totalExpenses, fill: '#f43f5e' },
    { name: 'Salaries', amount: totalSalaries, fill: '#a855f7' },
    { name: 'Net Profit', amount: Math.max(0, netProfit), fill: '#10b981' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('profitLoss')} & {t('reports')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'حتمی کاروباری نفع و نقصان، لاگت کا تجزیہ اور مالیاتی گوشوارہ' : 'Comprehensive financial performance, operating margins & balance sheets'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printInvoice')} Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('exportData')} (CSV)</span>
          </button>
        </div>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setDateRangeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              dateRangeFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {language === 'ur' ? 'تمام ریکارڈز' : 'All Time'}
          </button>
          <button
            onClick={() => setDateRangeFilter('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              dateRangeFilter === 'today' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('dailyProfit')}
          </button>
          <button
            onClick={() => setDateRangeFilter('this_month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              dateRangeFilter === 'this_month' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('monthlyProfit')}
          </button>
          <button
            onClick={() => setDateRangeFilter('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              dateRangeFilter === 'custom' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Custom Range
          </button>
        </div>

        {dateRangeFilter === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
            />
          </div>
        )}
      </div>

      {/* P&L Statement Key Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{t('totalSales')}</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {settings.currency} {totalSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{filteredOrders.length} customer invoices</div>
        </div>

        {/* Material Purchases */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{t('materialCost')}</span>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {settings.currency} {totalPurchases.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{filteredPurchases.length} supplier orders</div>
        </div>

        {/* OpEx & Payroll */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{t('expenses')} + {t('salaries')}</span>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {settings.currency} {(totalExpenses + totalSalaries).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">OpEx: {settings.currency}{totalExpenses.toLocaleString()} | Pay: {settings.currency}{totalSalaries.toLocaleString()}</div>
        </div>

        {/* Net Profit */}
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
          <span className="text-xs font-bold text-emerald-300 block">{t('netProfit')}</span>
          <div className={`text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {settings.currency} {netProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-300/80 font-bold mt-1">
            Net Margin: {profitMargin}%
          </div>
        </div>
      </div>

      {/* Financial Comparison Chart & Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Financial Inflow vs Outflow</h3>
          <p className="text-xs text-slate-400 mb-4">Comparing gross revenue against raw materials, operating costs & net return</p>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `Rs.${(val/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Statement Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Income & Expense Statement</h3>
          <p className="text-xs text-slate-400 mb-4">{settings.businessName} • Formal Balance Sheet</p>

          <div className="divide-y divide-slate-800 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-300 font-semibold">Gross Revenue from Customer Invoices (+)</span>
              <span className="font-extrabold text-amber-400">{settings.currency} {totalSales.toLocaleString()}</span>
            </div>

            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Direct Fabrication & Material Purchases (-)</span>
              <span className="font-semibold text-sky-400">{settings.currency} {totalPurchases.toLocaleString()}</span>
            </div>

            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Rent, Bills, Power & Maintenance OpEx (-)</span>
              <span className="font-semibold text-rose-400">{settings.currency} {totalExpenses.toLocaleString()}</span>
            </div>

            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Worker & Staff Payroll (-)</span>
              <span className="font-semibold text-purple-400">{settings.currency} {totalSalaries.toLocaleString()}</span>
            </div>

            <div className="py-2.5 flex justify-between font-bold text-slate-300">
              <span>Total Operating & Material Cost:</span>
              <span>{settings.currency} {totalCostOfDoingBusiness.toLocaleString()}</span>
            </div>

            <div className="py-3 flex justify-between items-center text-sm font-black bg-emerald-500/10 px-3 rounded-xl border border-emerald-500/20 mt-2">
              <span className="text-emerald-300">Final Net Profit</span>
              <span className="text-emerald-400 text-base">{settings.currency} {netProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

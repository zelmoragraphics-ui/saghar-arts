import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Truck, 
  Package, 
  Users, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ArrowUpRight, 
  Printer, 
  FileText,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { TabType } from './Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenNewOrderModal: () => void;
  onOpenNewPurchaseModal: () => void;
  onOpenNewExpenseModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewOrderModal,
  onOpenNewPurchaseModal,
  onOpenNewExpenseModal
}) => {
  const { 
    orders, 
    purchases, 
    expenses, 
    salaries, 
    materials, 
    customers, 
    suppliers, 
    employees, 
    settings, 
    t, 
    language, 
    setActiveInvoiceOrder,
    updateOrderStatus
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Calculations
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr));
  const todaySales = todayOrders.reduce((acc, o) => acc + o.grandTotal, 0);

  const todayPurchasesList = purchases.filter(p => p.purchaseDate === todayStr);
  const todayPurchases = todayPurchasesList.reduce((acc, p) => acc + p.totalCost, 0);

  const todayExpensesList = expenses.filter(e => e.date === todayStr);
  const todayExpenses = todayExpensesList.reduce((acc, e) => acc + e.amount, 0);

  const todayProfit = todaySales - todayPurchases - todayExpenses;

  // Overall totals
  const totalSales = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalPurchases = purchases.reduce((acc, p) => acc + p.totalCost, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalSalaries = salaries.reduce((acc, s) => acc + s.netSalary, 0);
  const totalNetProfit = totalSales - totalPurchases - totalExpenses;

  // Receivables & Payables
  const totalCustomerReceivables = customers.reduce((acc, c) => acc + c.remainingBalance, 0);
  const totalSupplierPayables = suppliers.reduce((acc, s) => acc + s.remainingAmount, 0);

  // Stock
  const lowStockItems = materials.filter(m => m.currentStock <= m.minStockAlert);
  const totalStockCount = materials.reduce((acc, m) => acc + m.currentStock, 0);

  // Orders
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Designing' || o.orderStatus === 'Production');
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered');

  // Chart data for recent 6 months
  const monthlyChartData = [
    { month: 'Apr', sales: 180000, purchases: 75000, profit: 65000 },
    { month: 'May', sales: 240000, purchases: 95000, profit: 88000 },
    { month: 'Jun', sales: 210000, purchases: 80000, profit: 79000 },
    { month: 'Jul', sales: 310000, purchases: 120000, profit: 115000 },
    { month: 'Aug', sales: 285000, purchases: 110000, profit: 102000 },
    { month: 'Sep (Current)', sales: totalSales || 345000, purchases: totalPurchases || 135000, profit: totalNetProfit || 128000 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {settings.businessName}
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Studio
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ur' 
              ? `خوش آمدید! آج کی تاریخ: ${new Date().toLocaleDateString('ur-PK')}` 
              : `Operational Dashboard • Today: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewOrderModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('newOrder')}</span>
          </button>

          <button
            onClick={onOpenNewPurchaseModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('newPurchase')}</span>
          </button>

          <button
            onClick={onOpenNewExpenseModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('newExpense')}</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any items are critical */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300">
                {language === 'ur' ? 'کم اسٹاک کا انتباہ!' : 'Inventory Restock Warning'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {lowStockItems.length} {language === 'ur' ? 'آئٹمز کم از کم اسٹاک کی حد سے نیچے ہیں:' : 'materials have reached or fallen below minimum alert levels:'}{' '}
                <span className="font-semibold text-slate-200">
                  {lowStockItems.map(m => m.name).join(', ')}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition border border-amber-500/30 whitespace-nowrap"
          >
            {language === 'ur' ? 'اسٹاک دیکھیں' : 'View Stock'}
          </button>
        </div>
      )}

      {/* Primary Financial Metric Cards (4 Cards) with Vivid Multi-Color Aesthetic */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Sales - Golden Amber */}
        <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-200/90 uppercase tracking-wide">{t('todaySales')}</span>
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black rounded-xl shadow-md shadow-amber-500/30">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-300 tracking-tight">
            {settings.currency} {todaySales.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">{todayOrders.length}</span>
            <span>{language === 'ur' ? 'آج کے آرڈرز' : 'orders today'}</span>
          </div>
        </div>

        {/* Today's Purchases - Electric Sky / Cyan */}
        <div className="bg-gradient-to-br from-sky-500/15 via-slate-900 to-cyan-950/40 border border-sky-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-200/90 uppercase tracking-wide">{t('todayPurchases')}</span>
            <div className="p-2.5 bg-gradient-to-br from-sky-400 to-cyan-500 text-slate-950 font-black rounded-xl shadow-md shadow-sky-500/30">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-sky-300 tracking-tight">
            {settings.currency} {todayPurchases.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="text-sky-400 font-bold bg-sky-500/20 px-1.5 py-0.5 rounded">{todayPurchasesList.length}</span>
            <span>{language === 'ur' ? 'خریداری انوائسز' : 'invoices recorded'}</span>
          </div>
        </div>

        {/* Total Expenses - Vivid Coral / Rose */}
        <div className="bg-gradient-to-br from-rose-500/15 via-slate-900 to-pink-950/40 border border-rose-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/10 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-200/90 uppercase tracking-wide">{t('todayExpenses')}</span>
            <div className="p-2.5 bg-gradient-to-br from-rose-400 to-rose-600 text-white font-black rounded-xl shadow-md shadow-rose-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-rose-300 tracking-tight">
            {settings.currency} {todayExpenses.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
            <span>{language === 'ur' ? 'کل اخراجات:' : 'Total OpEx:'}</span>
            <span className="text-rose-400 font-bold">{settings.currency} {totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* Today's Profit - Luminous Mint / Emerald */}
        <div className="bg-gradient-to-br from-emerald-500/15 via-slate-900 to-teal-950/40 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-200/90 uppercase tracking-wide">{t('todayProfit')}</span>
            <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black rounded-xl shadow-md shadow-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-lg sm:text-2xl font-black tracking-tight ${todayProfit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
            {settings.currency} {todayProfit.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
            <span>{language === 'ur' ? 'کل خالص منافع:' : 'All Net Profit:'}</span>
            <span className="text-emerald-400 font-bold">{settings.currency} {totalNetProfit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row (6 Colorful Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Pending Payments */}
        <div 
          onClick={() => onNavigate('customers')} 
          className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-400 p-3.5 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md hover:shadow-amber-500/10"
        >
          <div className="text-[11px] text-amber-200/80 font-bold truncate">{t('pendingPayments')}</div>
          <div className="text-base sm:text-lg font-black text-amber-400 mt-1">
            {settings.currency} {totalCustomerReceivables.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{customers.length} {language === 'ur' ? 'گاہک' : 'customers'}</div>
        </div>

        {/* Supplier Payables */}
        <div 
          onClick={() => onNavigate('suppliers')} 
          className="bg-gradient-to-br from-sky-500/10 via-slate-900 to-slate-900 border border-sky-500/30 hover:border-sky-400 p-3.5 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md hover:shadow-sky-500/10"
        >
          <div className="text-[11px] text-sky-200/80 font-bold truncate">{t('supplierPayables')}</div>
          <div className="text-base sm:text-lg font-black text-sky-400 mt-1">
            {settings.currency} {totalSupplierPayables.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{suppliers.length} {language === 'ur' ? 'سپلائرز' : 'suppliers'}</div>
        </div>

        {/* Total Stock */}
        <div 
          onClick={() => onNavigate('inventory')} 
          className="bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 p-3.5 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md hover:shadow-indigo-500/10"
        >
          <div className="text-[11px] text-indigo-200/80 font-bold truncate">{t('totalStockItems')}</div>
          <div className="text-base sm:text-lg font-black text-indigo-300 mt-1">
            {totalStockCount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{materials.length} {language === 'ur' ? 'میٹریلز' : 'materials'}</div>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => onNavigate('inventory')} 
          className={`border p-3.5 rounded-xl cursor-pointer transition shadow-xs ${
            lowStockItems.length > 0 
              ? 'bg-gradient-to-br from-rose-500/20 via-slate-900 to-rose-950/40 border-rose-500/50 hover:border-rose-400 shadow-md shadow-rose-500/10' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-rose-200/80 font-bold truncate">{t('lowStockAlerts')}</div>
          <div className={`text-base sm:text-lg font-black mt-1 ${lowStockItems.length > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {lowStockItems.length} {language === 'ur' ? 'آئٹمز' : 'Alerts'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {lowStockItems.length > 0 ? (language === 'ur' ? 'فوری خریداری درکار' : 'Requires Reorder') : (language === 'ur' ? 'اسٹاک مناسب ہے' : 'Stock Optimal')}
          </div>
        </div>

        {/* Total Orders / Pending */}
        <div 
          onClick={() => onNavigate('orders')} 
          className="bg-gradient-to-br from-violet-500/10 via-slate-900 to-slate-900 border border-violet-500/30 hover:border-violet-400 p-3.5 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md hover:shadow-violet-500/10"
        >
          <div className="text-[11px] text-violet-200/80 font-bold truncate">{t('pendingOrders')}</div>
          <div className="text-base sm:text-lg font-black text-violet-300 mt-1">
            {pendingOrders.length} <span className="text-xs text-slate-400 font-normal">/ {orders.length}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{completedOrders.length} {language === 'ur' ? 'مکمل شدہ' : 'completed'}</div>
        </div>

        {/* Staff / Workers */}
        <div 
          onClick={() => onNavigate('salaries')} 
          className="bg-gradient-to-br from-teal-500/10 via-slate-900 to-slate-900 border border-teal-500/30 hover:border-teal-400 p-3.5 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md hover:shadow-teal-500/10"
        >
          <div className="text-[11px] text-teal-200/80 font-bold truncate">{t('employeeCount')}</div>
          <div className="text-base sm:text-lg font-black text-teal-300 mt-1">
            {employees.length} {language === 'ur' ? 'افراد' : 'Staff'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{language === 'ur' ? 'ڈیزائنر و کاریگر' : 'Crew & Team'}</div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Sales & Profit Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {t('monthlySalesTrend')}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'ماہانہ سیلز بمقابلہ خریداری لاگت و خالص منافع' : 'Monthly Sales, Purchases & Net Profit analysis'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {language === 'ur' ? 'سیلز' : 'Sales'}
              </span>
              <span className="flex items-center gap-1.5 text-sky-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> {language === 'ur' ? 'خریداری' : 'Purchases'}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> {language === 'ur' ? 'منافع' : 'Profit'}
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `Rs.${(val/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, '']}
                />
                <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Sales" />
                <Bar dataKey="purchases" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Purchases" />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Financial Overview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-1">
              {t('expenseBreakdown')}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ur' ? 'مجموعی کاروباری توازن' : 'Cumulative Business Breakdown'}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">{t('totalSales')}</span>
                <span className="text-sm font-extrabold text-white">
                  {settings.currency} {totalSales.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">{t('totalPurchases')}</span>
                <span className="text-sm font-extrabold text-sky-400">
                  {settings.currency} {totalPurchases.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">{t('expenses')}</span>
                <span className="text-sm font-extrabold text-rose-400">
                  {settings.currency} {totalExpenses.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">{t('salaries')}</span>
                <span className="text-sm font-extrabold text-purple-400">
                  {settings.currency} {totalSalaries.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-300">{t('netProfit')}</span>
                <span className="text-base font-black text-emerald-400">
                  {settings.currency} {totalNetProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('profitLoss')}
            className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition"
          >
            <span>{language === 'ur' ? 'تفصیلی نفع و نقصان رپورٹ' : 'View Full P&L Statement'}</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Recent Orders & Recent Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {t('recentOrders')}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'تازہ ترین تیار ہونے والے آرڈرز اور حالت' : 'Latest orders placed & workflow statuses'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              {language === 'ur' ? 'تمام دیکھیں' : 'View All'} →
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 4).map(order => (
              <div 
                key={order.id} 
                className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white truncate">
                      {order.customerName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {order.invoiceNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {order.productSummary} • {order.sizeSummary}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span>Delivery: {order.deliveryDate}</span>
                    <span>•</span>
                    <span className="text-amber-400/90 font-medium">{order.assignedWorker}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.orderStatus === 'Ready' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    order.orderStatus === 'Delivered' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                    order.orderStatus === 'Production' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    order.orderStatus === 'Designing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {order.orderStatus}
                  </span>

                  <span className="text-xs font-extrabold text-white">
                    {settings.currency} {order.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices & Billing Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {t('recentInvoices')}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'پرنٹ شدہ اور تصدیق شدہ بلنگ ریکارڈز' : 'Printable client invoices & billing statements'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              {language === 'ur' ? 'تمام دیکھیں' : 'View All'} →
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 4).map(order => (
              <div 
                key={order.id} 
                className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400">
                      {order.invoiceNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 truncate">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Advance: <span className="text-emerald-400 font-semibold">{settings.currency} {order.advancePayment.toLocaleString()}</span> • 
                    Remaining: <span className={`font-semibold ${order.remainingBalance > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{settings.currency} {order.remainingBalance.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveInvoiceOrder(order)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
                    title="Print / View Invoice"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('printInvoice')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

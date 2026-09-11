import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Share2, 
  Clock, 
  DollarSign, 
  Trash2, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  CreditCard,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus, PaymentMethod } from '../types';

interface OrdersViewProps {
  onOpenNewOrderModal: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onOpenNewOrderModal }) => {
  const { 
    orders, 
    updateOrderStatus, 
    addOrderPayment, 
    deleteOrder, 
    settings, 
    t, 
    language, 
    setActiveInvoiceOrder,
    user 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentNote, setPaymentNote] = useState<string>('');

  const statuses: OrderStatus[] = ['Pending', 'Designing', 'Production', 'Ready', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.productSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPayment || paymentAmount <= 0) return;

    addOrderPayment(selectedOrderForPayment.id, paymentAmount, paymentMethod, paymentNote);
    setSelectedOrderForPayment(null);
    setPaymentAmount(0);
    setPaymentNote('');
  };

  const handleWhatsAppShare = (order: Order) => {
    const rawPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : (rawPhone.startsWith('92') ? rawPhone : '92' + rawPhone);
    const message = `Salam ${order.customerName},\nRegarding your order #${order.orderNumber} (${order.productSummary}) with ${settings.businessName}.\nCurrent Status: *${order.orderStatus}*.\nRemaining Balance: *${settings.currency} ${order.remainingBalance.toLocaleString()}*.\nThank you!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Designing':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Production':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Ready':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Delivered':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Cancelled':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('orders')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'تمام انوائسز، کسٹمر آرڈرز اور تیاری کا انتظام' : 'Manage customer orders, design workflows, payments & delivery'}
          </p>
        </div>

        <button
          onClick={onOpenNewOrderModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('newOrder')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {language === 'ur' ? 'تمام' : 'All'} ({orders.length})
          </button>
          {statuses.map(st => {
            const count = orders.filter(o => o.orderStatus === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'ur' ? 'گاہک، فون، یا انوائس تلاش کریں...' : 'Search customer, invoice, phone...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
            <p className="text-sm font-semibold">
              {language === 'ur' ? 'کوئی آرڈر نہیں ملا' : 'No orders matching your criteria.'}
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Customer & Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white">
                      {order.customerName}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                      {order.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({order.orderNumber})
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300 truncate">
                    {order.productSummary} • <span className="text-amber-400/90">{order.sizeSummary}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                    <span>Phone: <strong className="text-slate-200">{order.customerPhone}</strong></span>
                    <span>•</span>
                    <span>Delivery: <strong className="text-slate-200">{order.deliveryDate}</strong></span>
                    <span>•</span>
                    <span>Worker: <strong className="text-amber-400">{order.assignedWorker}</strong></span>
                  </div>

                  {order.customerNotes && (
                    <p className="text-[11px] text-slate-400 italic pt-1">
                      Note: {order.customerNotes}
                    </p>
                  )}
                </div>

                {/* Middle: Financials */}
                <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('grandTotal')}</span>
                    <span className="text-sm font-black text-white">
                      {settings.currency} {order.grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-7 w-px bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('advancePayment')}</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {settings.currency} {order.advancePayment.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-7 w-px bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('remainingBalance')}</span>
                    <span className={`text-sm font-black ${order.remainingBalance > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {settings.currency} {order.remainingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={order.orderStatus}
                    onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl focus:outline-hidden cursor-pointer"
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>

                  {/* Add Payment if balance remaining */}
                  {order.remainingBalance > 0 && (
                    <button
                      onClick={() => {
                        setSelectedOrderForPayment(order);
                        setPaymentAmount(order.remainingBalance);
                      }}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title="Collect Payment"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Pay</span>
                    </button>
                  )}

                  {/* Print Invoice Button */}
                  <button
                    onClick={() => setActiveInvoiceOrder(order)}
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    title="Print Invoice"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Invoice</span>
                  </button>

                  {/* WhatsApp Share */}
                  <button
                    onClick={() => handleWhatsAppShare(order)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition cursor-pointer"
                    title="Send WhatsApp Update"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete (only for admin or manager) */}
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm(t('confirmDelete'))) {
                          deleteOrder(order.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition cursor-pointer"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Collect Balance Payment Modal */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-1">
              {language === 'ur' ? 'ادائیگی وصول کریں' : 'Receive Order Payment'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Invoice #{selectedOrderForPayment.invoiceNumber} • {selectedOrderForPayment.customerName}
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'ur' ? 'وصول شدہ رقم' : 'Amount Received'} ({settings.currency})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedOrderForPayment.remainingBalance}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('paymentMethod')}
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'ur' ? 'نوٹ / حوالہ' : 'Note / Reference'}
                </label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                  placeholder="e.g. Cleared balance before pickup"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForPayment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  {language === 'ur' ? 'ادائیگی درج کریں' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

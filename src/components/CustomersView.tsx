import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  MapPin, 
  DollarSign, 
  FileText, 
  Share2, 
  Trash2, 
  Printer,
  CreditCard,
  Edit2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer, PaymentMethod } from '../types';

export const CustomersView: React.FC = () => {
  const { 
    customers, 
    orders, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    addOrderPayment, 
    settings, 
    t, 
    language, 
    user 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add / Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [fatherOrBusiness, setFatherOrBusiness] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [previousBalance, setPreviousBalance] = useState(0);

  // Quick Payment Modal for selected Customer
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Cash');
  const [payNote, setPayNote] = useState<string>('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery) ||
    c.fatherOrBusinessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReceivables = customers.reduce((acc, c) => acc + c.remainingBalance, 0);

  const handleOpenAdd = () => {
    setName('');
    setFatherOrBusiness('');
    setMobile('');
    setWhatsapp('');
    setAddress('');
    setNotes('');
    setPreviousBalance(0);
    setEditingCustomer(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setFatherOrBusiness(c.fatherOrBusinessName);
    setMobile(c.mobile);
    setWhatsapp(c.whatsapp || c.mobile);
    setAddress(c.address);
    setNotes(c.notes || '');
    setPreviousBalance(c.previousBalance);
    setShowAddModal(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        fatherOrBusinessName: fatherOrBusiness,
        mobile,
        whatsapp: whatsapp || mobile,
        address,
        notes,
        previousBalance
      });
    } else {
      addCustomer({
        name,
        fatherOrBusinessName: fatherOrBusiness,
        mobile,
        whatsapp: whatsapp || mobile,
        address,
        notes,
        previousBalance
      });
    }

    setShowAddModal(false);
  };

  // WhatsApp Khata Reminder
  const handleSendWhatsAppReminder = (c: Customer) => {
    const rawPhone = (c.whatsapp || c.mobile).replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : (rawPhone.startsWith('92') ? rawPhone : '92' + rawPhone);
    const message = `*${settings.businessName} - Account Statement*\n` +
      `Respected *${c.name}*,\n` +
      `Your current remaining balance at ${settings.businessName} is *${settings.currency} ${c.remainingBalance.toLocaleString()}*.\n` +
      `Kindly clear the due payment at your earliest convenience.\n` +
      `Contact: ${settings.contactNumber} (${settings.ownerName})\n` +
      `Address: ${settings.address}\n` +
      `Thank you!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Quick Khata Balance Clearance
  const handleKhataPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || payAmount <= 0) return;

    // Find any unpaid orders for this customer and apply payments
    const custOrders = orders.filter(o => o.customerId === selectedCustomer.id && o.remainingBalance > 0);
    let remainingToApply = payAmount;

    for (const ord of custOrders) {
      if (remainingToApply <= 0) break;
      const amountForThisOrder = Math.min(ord.remainingBalance, remainingToApply);
      addOrderPayment(ord.id, amountForThisOrder, payMethod, `Khata settlement: ${payNote || 'Direct payment'}`);
      remainingToApply -= amountForThisOrder;
    }

    setShowPaymentModal(false);
    setPayAmount(0);
    setPayNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('customers')} & {language === 'ur' ? 'کھاتہ لیجر' : 'Khata Ledger'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'کسٹمر ریکارڈ، سابقہ بقایا جات اور واٹس ایپ بیلنس ری مائنڈرز' : 'Customer accounts, order histories, credit balances & WhatsApp billing reminders'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            Receivables: <strong className="text-white">{settings.currency} {totalReceivables.toLocaleString()}</strong>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('addCustomer')}</span>
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
          placeholder={language === 'ur' ? 'گاہک کا نام، موبائل نمبر یا دکان تلاش کریں...' : 'Search customer name, phone number, business...'}
          className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
        />
      </div>

      {/* Customers List & Ledger Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Customer Cards (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          {filteredCustomers.map(cust => {
            const isSelected = selectedCustomer?.id === cust.id;
            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-white">
                        {cust.name}
                      </span>
                      {cust.fatherOrBusinessName && (
                        <span className="text-xs text-slate-400 font-medium">
                          ({cust.fatherOrBusinessName})
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {cust.mobile}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        {cust.address || 'Faisalabad'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">{t('remainingBalance')}</span>
                      <span className={`text-base font-black ${cust.remainingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {settings.currency} {cust.remainingBalance.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleSendWhatsAppReminder(cust)}
                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs transition cursor-pointer"
                        title="Send WhatsApp Reminder"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition cursor-pointer"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {user?.role === 'admin' && (
                        <button
                          onClick={() => {
                            if (confirm(t('confirmDelete'))) {
                              deleteCustomer(cust.id);
                              if (selectedCustomer?.id === cust.id) setSelectedCustomer(null);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Customer Ledger / Statement */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          {selectedCustomer ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedCustomer.fatherOrBusinessName} • {selectedCustomer.mobile}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCustomer(selectedCustomer);
                    setPayAmount(selectedCustomer.remainingBalance);
                    setShowPaymentModal(true);
                  }}
                  disabled={selectedCustomer.remainingBalance <= 0}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Receive</span>
                </button>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Billed</span>
                  <span className="text-sm font-extrabold text-white">
                    {settings.currency} {selectedCustomer.totalOrdersAmount.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Paid</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    {settings.currency} {selectedCustomer.totalPaid.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Khata Due Balance:</span>
                <span className="text-base font-black text-amber-400">
                  {settings.currency} {selectedCustomer.remainingBalance.toLocaleString()}
                </span>
              </div>

              {/* Orders History */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Order & Payment History
                </span>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {orders.filter(o => o.customerId === selectedCustomer.id).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No orders found for this customer.</p>
                  ) : (
                    orders.filter(o => o.customerId === selectedCustomer.id).map(ord => (
                      <div key={ord.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-white">{ord.invoiceNumber}</span>
                          <span className="text-amber-400">{settings.currency} {ord.grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>{ord.productSummary}</span>
                          <span className={ord.remainingBalance > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                            Due: {settings.currency} {ord.remainingBalance.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleSendWhatsAppReminder(selectedCustomer)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Statement</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <User className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs font-semibold">
                {language === 'ur' ? 'تفصیلی کھاتہ دیکھنے کے لیے کسی گاہک پر کلک کریں' : 'Select a customer from the list to inspect their live Khata & order ledger.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-4">
              {editingCustomer ? 'Edit Customer' : t('addCustomer')}
            </h3>

            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('customerName')} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mian Babar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('fatherOrBusinessName')}</label>
                <input
                  type="text"
                  placeholder="e.g. Al-Madina Sweets & Bakers"
                  value={fatherOrBusiness}
                  onChange={e => setFatherOrBusiness(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('mobile')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="03001234567"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('whatsapp')}</label>
                  <input
                    type="text"
                    placeholder="03001234567"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('address')}</label>
                <input
                  type="text"
                  placeholder="e.g. Susan Road, Madina Town, Faisalabad"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('previousBalance')} ({settings.currency})</label>
                <input
                  type="number"
                  min="0"
                  value={previousBalance}
                  onChange={e => setPreviousBalance(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Special instructions or discount agreement"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
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
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive Khata Payment Modal */}
      {showPaymentModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-1">
              Receive Payment: {selectedCustomer.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Outstanding Khata Balance: <strong className="text-amber-400">{settings.currency} {selectedCustomer.remainingBalance.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleKhataPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount to Receive ({settings.currency})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedCustomer.remainingBalance}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as PaymentMethod)}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reference / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Received by Hafiz Saghar in cash"
                  value={payNote}
                  onChange={e => setPayNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  Save & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

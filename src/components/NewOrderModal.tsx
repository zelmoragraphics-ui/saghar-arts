import React, { useState } from 'react';
import { X, Plus, Trash2, UserPlus, Calculator, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderItem, PaymentMethod } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose }) => {
  const { 
    customers, 
    addCustomer, 
    categories, 
    employees, 
    createOrder, 
    settings, 
    orders, 
    t, 
    language,
    setActiveInvoiceOrder
  } = useApp();

  // Next invoice & order numbers
  const nextInvoiceNumber = `${settings.invoicePrefix}INV-${1000 + orders.length + 1}`;
  const nextOrderNumber = `ORD-2026-${String(orders.length + 1).padStart(2, '0')}`;

  // Customer state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [isQuickAddCustomer, setIsQuickAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustFatherOrBusiness, setNewCustFatherOrBusiness] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Items in Order
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: 'item-1',
      category: categories[0]?.name || '3D Design',
      product: 'Acrylic 3D LED Board',
      designDetails: 'Raised mirror gold letters with white LED backing',
      size: '10 x 3 ft',
      quantity: 1,
      rate: 15000,
      discount: 0,
      total: 15000
    }
  ]);

  // Financials & Workflow
  const [advancePayment, setAdvancePayment] = useState<number>(5000);
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [assignedWorker, setAssignedWorker] = useState<string>(employees[1]?.name || employees[0]?.name || 'Hafiz Saghar');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  if (!isOpen) return null;

  // Recalculate totals
  const subtotal = items.reduce((acc, it) => acc + (it.rate * it.quantity), 0);
  const totalDiscount = items.reduce((acc, it) => acc + it.discount, 0);
  const grandTotal = Math.max(0, subtotal - totalDiscount);
  const remainingBalance = Math.max(0, grandTotal - advancePayment);

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      category: categories[0]?.name || 'General',
      product: '',
      designDetails: '',
      size: '',
      quantity: 1,
      rate: 1000,
      discount: 0,
      total: 1000
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof OrderItem, val: any) => {
    setItems(prev => {
      const updated = [...prev];
      const item = { ...updated[idx], [field]: val };
      item.total = Math.max(0, (item.rate * item.quantity) - (item.discount || 0));
      updated[idx] = item;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCustomerId = selectedCustomerId;
    let finalCustomerName = '';
    let finalCustomerPhone = '';
    let finalCustomerAddress = '';

    if (isQuickAddCustomer) {
      if (!newCustName.trim()) {
        alert("Please enter customer name");
        return;
      }
      const created = addCustomer({
        name: newCustName,
        fatherOrBusinessName: newCustFatherOrBusiness,
        mobile: newCustPhone,
        whatsapp: newCustPhone,
        address: newCustAddress,
        previousBalance: 0,
        notes: 'Quick added from new order'
      });
      finalCustomerId = created.id;
      finalCustomerName = created.name;
      finalCustomerPhone = created.mobile;
      finalCustomerAddress = created.address;
    } else {
      const existing = customers.find(c => c.id === selectedCustomerId);
      if (!existing) {
        alert("Please select a customer");
        return;
      }
      finalCustomerName = existing.name;
      finalCustomerPhone = existing.mobile;
      finalCustomerAddress = existing.address;
    }

    const productSummary = items.map(i => i.product || i.category).join(', ');
    const sizeSummary = items.map(i => i.size).filter(Boolean).join(', ') || 'Custom Specs';

    const newOrder = createOrder({
      invoiceNumber: nextInvoiceNumber,
      orderNumber: nextOrderNumber,
      customerId: finalCustomerId,
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      customerAddress: finalCustomerAddress,
      items,
      productSummary,
      sizeSummary,
      totalAmount: subtotal,
      discount: totalDiscount,
      grandTotal,
      advancePayment,
      remainingBalance,
      deliveryDate,
      orderStatus: 'Pending',
      assignedWorker,
      customerNotes,
      paymentMethod,
      paymentHistory: advancePayment > 0 ? [
        {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: advancePayment,
          method: paymentMethod,
          note: 'Advance on order creation'
        }
      ] : []
    });

    onClose();
    // Offer to immediately view/print invoice
    setActiveInvoiceOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              {language === 'ur' ? 'نیا آرڈر / انوائس تیار کریں' : 'Create New Order & Invoice'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Invoice: <strong className="text-amber-400 font-mono">{nextInvoiceNumber}</strong></span>
              <span>•</span>
              <span>Order: <strong className="text-slate-200 font-mono">{nextOrderNumber}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-700/50 hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Customer Selection Section */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t('customer')}
              </span>
              <button
                type="button"
                onClick={() => setIsQuickAddCustomer(!isQuickAddCustomer)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isQuickAddCustomer ? (language === 'ur' ? 'موجودہ گاہک منتخب کریں' : 'Choose Existing Customer') : (language === 'ur' ? '+ نیا گاہک درج کریں' : '+ Quick Add New Customer')}</span>
              </button>
            </div>

            {!isQuickAddCustomer ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('selectCustomer')}</label>
                  <select
                    value={selectedCustomerId}
                    onChange={e => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-amber-500 focus:outline-hidden"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.mobile}) - {c.fatherOrBusinessName || 'Individual'}
                      </option>
                    ))}
                  </select>
                </div>
                {(() => {
                  const curr = customers.find(c => c.id === selectedCustomerId);
                  return curr ? (
                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-col justify-center">
                      <div>Address: <span className="font-semibold text-white">{curr.address || 'Faisalabad'}</span></div>
                      <div className="mt-0.5">Accrued Balance: <span className={`font-bold ${curr.remainingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{settings.currency} {curr.remainingBalance.toLocaleString()}</span></div>
                    </div>
                  ) : null;
                })()}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={newCustName}
                    onChange={e => setNewCustName(e.target.value)}
                    placeholder="e.g. Mian Babar"
                    required={isQuickAddCustomer}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Father / Business Name</label>
                  <input
                    type="text"
                    value={newCustFatherOrBusiness}
                    onChange={e => setNewCustFatherOrBusiness(e.target.value)}
                    placeholder="Shop or Business Name"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={e => setNewCustPhone(e.target.value)}
                    placeholder="03001234567"
                    required={isQuickAddCustomer}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Address</label>
                  <input
                    type="text"
                    value={newCustAddress}
                    onChange={e => setNewCustAddress(e.target.value)}
                    placeholder="Madina Town, Faisalabad"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Line Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'ur' ? 'پروڈکٹس و سروسز (آئٹمز)' : 'Products & Fabrication Line Items'}
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ur' ? '+ مزید آئٹم شامل کریں' : '+ Add Item'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl relative space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-black text-amber-400">
                      Item #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                      <select
                        value={item.category}
                        onChange={e => handleItemChange(idx, 'category', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Product / Title *</label>
                      <input
                        type="text"
                        value={item.product}
                        onChange={e => handleItemChange(idx, 'product', e.target.value)}
                        placeholder="e.g. Front Elevation 3D LED Board"
                        required
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Size / Dimension</label>
                      <input
                        type="text"
                        value={item.size}
                        onChange={e => handleItemChange(idx, 'size', e.target.value)}
                        placeholder="e.g. 12x4 ft or Standard Pair"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Design Specs & Material Details</label>
                    <input
                      type="text"
                      value={item.designDetails}
                      onChange={e => handleItemChange(idx, 'designDetails', e.target.value)}
                      placeholder="e.g. 3mm cast acrylic, Samsung white modules, golden border"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">{t('quantity')}</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">{t('rate')} ({settings.currency})</label>
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={e => handleItemChange(idx, 'rate', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">{t('discount')}</label>
                      <input
                        type="number"
                        min="0"
                        value={item.discount}
                        onChange={e => handleItemChange(idx, 'discount', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">{t('totalAmount')}</label>
                      <div className="px-2.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-emerald-400 font-extrabold text-xs">
                        {settings.currency} {item.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow & Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                {t('deliveryDate')}
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                {t('assignedWorker')}
              </label>
              <select
                value={assignedWorker}
                onChange={e => setAssignedWorker(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={`${emp.name} (${emp.designation})`}>
                    {emp.name} - {emp.designation}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                {t('paymentMethod')}
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
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
            <label className="block text-xs text-slate-400 mb-1">
              {t('customerNotes')}
            </label>
            <input
              type="text"
              value={customerNotes}
              onChange={e => setCustomerNotes(e.target.value)}
              placeholder="e.g. Needs installation clamps, call customer before visiting site"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Financial Calculation Summary Bar */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 block">{t('grandTotal')}:</span>
              <span className="text-lg font-black text-white">
                {settings.currency} {grandTotal.toLocaleString()}
              </span>
            </div>

            <div className="w-40">
              <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                {t('advancePayment')} ({settings.currency})
              </label>
              <input
                type="number"
                min="0"
                max={grandTotal}
                value={advancePayment}
                onChange={e => setAdvancePayment(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-emerald-500/50 rounded-xl text-emerald-400 font-bold text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">{t('remainingBalance')}:</span>
              <span className={`text-lg font-black ${remainingBalance > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {settings.currency} {remainingBalance.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {language === 'ur' ? 'آرڈر و انوائس محفوظ کریں' : 'Save Order & Open Invoice'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

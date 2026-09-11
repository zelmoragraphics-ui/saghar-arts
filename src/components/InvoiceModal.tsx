import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Download, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Globe,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { settings, customers, language, t } = useApp();
  const [invoiceLang, setInvoiceLang] = useState<'en' | 'ur'>(language);

  if (!order) return null;

  const customer = customers.find(c => c.id === order.customerId);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const rawPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : (rawPhone.startsWith('92') ? rawPhone : '92' + rawPhone);
    
    const message = `*${settings.businessName} - INVOICE*\n` +
      `Invoice #: ${order.invoiceNumber}\n` +
      `Date: ${order.createdAt.split('T')[0]}\n` +
      `Customer: ${order.customerName}\n` +
      `Service: ${order.productSummary} (${order.sizeSummary})\n` +
      `Total: ${settings.currency} ${order.grandTotal.toLocaleString()}\n` +
      `Advance Paid: ${settings.currency} ${order.advancePayment.toLocaleString()}\n` +
      `*Balance Due: ${settings.currency} ${order.remainingBalance.toLocaleString()}*\n` +
      `Delivery Date: ${order.deliveryDate}\n` +
      `Address: ${settings.address}\n` +
      `Contact: ${settings.contactNumber}\n` +
      `Thank you for choosing ${settings.businessName}!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const isUrdu = invoiceLang === 'ur';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[96vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              {order.invoiceNumber}
            </span>
            <button
              onClick={() => setInvoiceLang(isUrdu ? 'en' : 'ur')}
              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'Switch to English' : 'اردو میں دیکھیں'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printInvoice')}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
              title="Send to Customer WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('whatsappShare')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div 
          id="printable-invoice" 
          className="print-container flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900"
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-2xl">
                  SA
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-slate-950">
                    {settings.businessName}
                  </h1>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                    {isUrdu ? 'سائن بورڈ • تھری ڈی ڈیزائن • ایل ای ڈی و فلیکس پرنٹنگ • ونائل اسٹیکرز' : 'Sign Board • 3D Design • LED & Neon • Digital Printing'}
                  </p>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                <p className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {settings.address}
                </p>
                <p className="flex items-center gap-1 font-bold text-slate-900">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {settings.ownerName}: {settings.contactNumber}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right sm:self-center bg-slate-100 p-3 rounded-xl border border-slate-300 min-w-[200px]">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 block">
                {isUrdu ? 'انوائس واؤچر' : 'OFFICIAL INVOICE'}
              </span>
              <div className="text-lg font-black text-slate-950">
                {order.invoiceNumber}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                <span className="font-semibold">{isUrdu ? 'تاریخ:' : 'Date:'}</span> {order.createdAt.split('T')[0]}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-semibold">{isUrdu ? 'ڈیلیوری:' : 'Delivery:'}</span> {order.deliveryDate}
              </div>
            </div>
          </div>

          {/* Customer Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-300 rounded-xl mb-5 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                {isUrdu ? 'کسٹمر کی تفصیلات (بل برائے)' : 'Billed To (Customer)'}:
              </span>
              <h3 className="text-sm font-extrabold text-slate-950 mt-0.5">
                {order.customerName}
              </h3>
              {customer?.fatherOrBusinessName && (
                <p className="text-slate-600 font-medium">
                  {customer.fatherOrBusinessName}
                </p>
              )}
              <p className="text-slate-700 font-semibold mt-1">
                {order.customerPhone}
              </p>
              {order.customerAddress && (
                <p className="text-slate-600 mt-0.5">
                  {order.customerAddress}
                </p>
              )}
            </div>

            <div className="sm:text-right flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {isUrdu ? 'آرڈر اسٹیٹس و تفویض' : 'Order Reference & Worker'}:
                </span>
                <p className="font-bold text-slate-900 mt-0.5">
                  Order #: {order.orderNumber}
                </p>
                <p className="text-slate-700">
                  Worker: <span className="font-semibold">{order.assignedWorker}</span>
                </p>
              </div>
              <div className="mt-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border bg-slate-200 text-slate-800 border-slate-300">
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-2.5 w-8 text-center">#</th>
                  <th className="p-2.5">{isUrdu ? 'تفصیل و سروس' : 'Product / Description'}</th>
                  <th className="p-2.5">{isUrdu ? 'سائز' : 'Size'}</th>
                  <th className="p-2.5 text-center">{isUrdu ? 'تعداد' : 'Qty'}</th>
                  <th className="p-2.5 text-right">{isUrdu ? 'ریٹ' : 'Rate'}</th>
                  <th className="p-2.5 text-right">{isUrdu ? 'کل رقم' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50">
                    <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-2.5">
                      <div className="font-extrabold text-slate-900">{item.product}</div>
                      <div className="text-[11px] text-slate-600 italic mt-0.5">{item.designDetails}</div>
                      <span className="inline-block px-1.5 py-0.2 bg-slate-100 border border-slate-300 text-slate-600 rounded text-[10px] mt-1">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-2.5 font-medium text-slate-800">{item.size || '-'}</td>
                    <td className="p-2.5 text-center font-bold text-slate-900">{item.quantity}</td>
                    <td className="p-2.5 text-right font-medium text-slate-800">
                      {settings.currency} {item.rate.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-extrabold text-slate-950">
                      {settings.currency} {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
            <div className="flex-1 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">
                {isUrdu ? 'نوٹس و ہدایات:' : 'Instructions & Notes:'}
              </span>
              <p className="text-slate-600 text-xs italic">
                {order.customerNotes || (isUrdu ? 'کوئی اضافی ہدایات درج نہیں۔' : 'Standard fabrication and proof specifications apply.')}
              </p>
              <div className="pt-2 text-[11px] text-slate-500">
                <span>Payment Mode: </span>
                <span className="font-bold text-slate-800">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">{isUrdu ? 'کل رقم:' : 'Total Amount:'}</span>
                <span className="font-semibold text-slate-900">
                  {settings.currency} {order.totalAmount.toLocaleString()}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600 font-semibold">
                  <span>{isUrdu ? 'رعایت (ڈسکاؤنٹ):' : 'Discount:'}</span>
                  <span>- {settings.currency} {order.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b-2 border-slate-900 text-sm font-black text-slate-950">
                <span>{isUrdu ? 'گرینڈ ٹوٹل:' : 'Grand Total:'}</span>
                <span>{settings.currency} {order.grandTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 text-emerald-700 font-bold border-b border-slate-200">
                <span>{isUrdu ? 'وصول شدہ (ایڈوانس):' : 'Paid / Advance:'}</span>
                <span>{settings.currency} {order.advancePayment.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1.5 bg-amber-50 px-2 rounded-lg text-sm font-extrabold text-amber-900 border border-amber-300">
                <span>{isUrdu ? 'بقایا واجب الادا:' : 'Current Balance Due:'}</span>
                <span>{settings.currency} {order.remainingBalance.toLocaleString()}</span>
              </div>

              {customer && customer.remainingBalance > order.remainingBalance && (
                <div className="flex justify-between py-1 text-[11px] text-slate-600 italic">
                  <span>{isUrdu ? 'گاہک کا مجموعی سابقہ بقایا:' : 'Total Accrued Balance:'}</span>
                  <span className="font-bold">{settings.currency} {customer.remainingBalance.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="border-t border-slate-300 pt-4 mb-8 text-[10px] text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">
              {isUrdu ? 'شرائط و ضوابط:' : 'Terms & Conditions:'}
            </span>
            <p className="whitespace-pre-line">
              {settings.invoiceTerms}
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-10 pt-6 border-t border-slate-300 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1" />
              <p className="font-bold text-slate-800">{isUrdu ? 'دستخط گاہک' : 'Customer Signature'}</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">{settings.ownerName}</span>
              </div>
              <p className="font-bold text-slate-800">{isUrdu ? 'مجاز دستخط (ساغر آرٹس)' : 'Authorized Signature (SAGHAR ARTS)'}</p>
            </div>
          </div>

          {/* Developer Attribution */}
          <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Software Engineered by <span className="font-semibold text-slate-600">{settings.developer}</span> • SAGHAR ARTS Management System
          </div>
        </div>
      </div>
    </div>
  );
};

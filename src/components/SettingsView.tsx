import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Download, 
  Upload, 
  ShieldCheck, 
  Users, 
  FileText, 
  RefreshCw, 
  Key, 
  CheckCircle2, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    exportDatabaseJSON, 
    restoreDatabaseJSON, 
    activityLogs, 
    t, 
    language, 
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'business' | 'backup' | 'users' | 'logs'>('business');

  // Business form state
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [contactNumber, setContactNumber] = useState(settings.contactNumber);
  const [address, setAddress] = useState(settings.address);
  const [developer, setDeveloper] = useState(settings.developer);
  const [currency, setCurrency] = useState(settings.currency);
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);
  const [invoiceTerms, setInvoiceTerms] = useState(settings.invoiceTerms);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Backup restore file state
  const [restoreStatus, setRestoreStatus] = useState<string>('');

  const handleSaveBusinessSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      ownerName,
      contactNumber,
      address,
      developer,
      currency,
      invoicePrefix,
      invoiceTerms
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const res = restoreDatabaseJSON(content);
        if (res.success) {
          setRestoreStatus('Database successfully restored!');
        } else {
          setRestoreStatus(`Restore error: ${res.message}`);
        }
      } catch (err: any) {
        setRestoreStatus(`Failed to parse file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('settings')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'کاروباری معلومات، ڈیٹا بیک اپ، صارفین اور ایکٹیویٹی لاگ' : 'Business credentials, invoice terms, database backups & security audit logs'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportDatabaseJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('backupData')}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'business' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {t('businessInfo')}
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'backup' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {t('backupRestore')}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'users' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {t('rolesPermissions')}
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'logs' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {t('activityLogs')} ({activityLogs.length})
        </button>
      </div>

      {/* Tab 1: Business Info */}
      {activeTab === 'business' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveBusinessSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Number (WhatsApp & Call) *
                </label>
                <input
                  type="text"
                  required
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Developer Attribution
                </label>
                <input
                  type="text"
                  value={developer}
                  onChange={e => setDeveloper(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Workshop & Studio Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={e => setInvoicePrefix(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Printed Invoice Terms & Conditions
              </label>
              <textarea
                rows={4}
                value={invoiceTerms}
                onChange={e => setInvoiceTerms(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {t('saveSettings')}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Export */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Download className="w-5 h-5" />
                <h3 className="text-base font-black text-white">Full Database Backup</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Download a clean JSON archive containing all customer khata, active orders, procurement history, stock inventory, and company settings.
              </p>
            </div>

            <button
              onClick={exportDatabaseJSON}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Restore */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-sky-400">
                <Upload className="w-5 h-5" />
                <h3 className="text-base font-black text-white">Restore from Backup</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Upload a valid JSON backup file to overwrite or restore complete application data.
              </p>
            </div>

            <div>
              <label className="block w-full py-3 rounded-xl border border-dashed border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-bold text-xs text-center cursor-pointer transition">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Choose Backup File (.json)
              </label>

              {restoreStatus && (
                <div className="mt-3 text-xs text-slate-300 p-2 bg-slate-950 rounded-lg text-center font-mono">
                  {restoreStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Users & Roles */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white">System Access Roles & Privileges</h3>
            <p className="text-xs text-slate-400">SAGHAR ARTS implements 3 specialized tiers:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-xl space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black text-xs uppercase">
                Admin
              </span>
              <p className="text-xs text-slate-300 font-semibold">Full System Access</p>
              <ul className="text-[11px] text-slate-400 list-disc pl-4 space-y-1">
                <li>Create, edit, delete any orders & invoices</li>
                <li>Manage stock inventory & delete categories</li>
                <li>View full Profit & Loss and financial data</li>
                <li>Process salaries & edit app settings</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-sky-500/30 rounded-xl space-y-2">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-black text-xs uppercase">
                Owner (Hafiz Saghar)
              </span>
              <p className="text-xs text-slate-300 font-semibold">Executive Oversight</p>
              <ul className="text-[11px] text-slate-400 list-disc pl-4 space-y-1">
                <li>View all operational metrics & live revenue</li>
                <li>Authorize payments, salaries and discounts</li>
                <li>Direct customer & supplier communication</li>
                <li>Review audit trails and ledger reports</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black text-xs uppercase">
                Worker
              </span>
              <p className="text-xs text-slate-300 font-semibold">Shop Floor & Design</p>
              <ul className="text-[11px] text-slate-400 list-disc pl-4 space-y-1">
                <li>Update order statuses (Design, Ready, Delivered)</li>
                <li>Inspect required materials & fabrication details</li>
                <li>Protected from sensitive salary & P&L figures</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Activity Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Security & Operation Audit Logs</h3>
              <p className="text-xs text-slate-400">Timestamped record of all crucial system actions</p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activityLogs.map(log => (
              <div
                key={log.id}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-amber-400 rounded">
                      {log.userName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>

                <div className="text-[10px] text-slate-500 font-mono shrink-0">
                  {log.timestamp.replace('T', ' ').slice(0, 19)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

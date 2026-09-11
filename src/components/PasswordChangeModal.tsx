import React, { useState } from 'react';
import { Key, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PasswordChangeModal: React.FC = () => {
  const { user, updateUserPassword, showPasswordChangeModal, setShowPasswordChangeModal, language } = useApp();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!showPasswordChangeModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (user?.password && currentPassword !== user.password) {
      setError(language === 'ur' ? 'موجودہ پاس ورڈ درست نہیں ہے' : 'Current password is incorrect');
      return;
    }

    if (newPassword.length < 4) {
      setError(language === 'ur' ? 'نیا پاس ورڈ کم از کم 4 ہندسوں پر مشتمل ہونا چاہیے' : 'New password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(language === 'ur' ? 'نئے پاس ورڈ کی تصدیق مماثل نہیں ہے' : 'New passwords do not match');
      return;
    }

    if (user) {
      updateUserPassword(user.id, newPassword);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowPasswordChangeModal(false);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={() => setShowPasswordChangeModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'ur' ? 'سیکیورٹی پاس ورڈ تبدیل کریں' : 'Change Security Password'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ur' ? 'برائے مہربانی اپنا محفوظ نیا پاس ورڈ سیٹ کریں' : 'Update your account password for secure access'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{language === 'ur' ? 'پاس ورڈ کامیابی سے تبدیل ہو گیا!' : 'Password updated successfully!'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ur' ? 'موجودہ پاس ورڈ' : 'Current Password'}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ur' ? 'نیا پاس ورڈ' : 'New Password'}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'ur' ? 'نئے پاس ورڈ کی تصدیق کریں' : 'Confirm New Password'}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPasswordChangeModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              {language === 'ur' ? 'منسوخ' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20"
            >
              {language === 'ur' ? 'پاس ورڈ محفوظ کریں' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

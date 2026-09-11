import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login, settings, language, toggleLanguage } = useApp();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(usernameOrEmail, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message || (language === 'ur' ? 'غلط یوزر نام یا پاس ورڈ' : 'Invalid credentials'));
      }
    }, 400);
  };

  const handleQuickLogin = (uname: string, pass: string) => {
    setUsernameOrEmail(uname);
    setPassword(pass);
    login(uname, pass);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top right language switch */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => toggleLanguage()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-amber-400 transition shadow-lg cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'en' ? 'اردو (Urdu)' : 'English'}</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 text-slate-950 mb-3">
            <Layers className="w-9 h-9 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white">
            {settings.businessName}
          </h1>
          <p className="text-xs text-amber-400 font-semibold tracking-wide uppercase mt-0.5">
            {language === 'ur' ? 'سائن بورڈ • تھری ڈی ڈیزائن • پرنٹنگ و ایڈورٹائزنگ' : 'Sign Board • 3D Design • Advertising'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {settings.address}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'ur' ? 'یوزر نام یا ای میل' : 'Username / Email'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden placeholder:text-slate-600 transition"
                placeholder="admin or email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'ur' ? 'پاس ورڈ' : 'Password'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden placeholder:text-slate-600 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
              />
              <span>{language === 'ur' ? 'مجھے یاد رکھیں' : 'Remember Me'}</span>
            </label>
            <span className="text-slate-500 text-[11px]">
              {language === 'ur' ? 'محفوظ لاگ ان' : 'Role-Protected'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'ur' ? 'سسٹم لاگ ان کریں' : 'Secure Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {language === 'ur' ? 'فوری ٹیسٹنگ اکاؤنٹس' : 'Quick Access Roles'}
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin')}
              className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-center transition group cursor-pointer"
            >
              <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">Admin</div>
              <div className="text-[10px] text-slate-400">Full Suite</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('hafiz', 'owner')}
              className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-center transition group cursor-pointer"
            >
              <div className="text-xs font-bold text-sky-400 group-hover:text-sky-300">Owner</div>
              <div className="text-[10px] text-slate-400">Hafiz Saghar</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('worker', 'worker')}
              className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-center transition group cursor-pointer"
            >
              <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">Worker</div>
              <div className="text-[10px] text-slate-400">Production</div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 text-center text-[11px] text-slate-500">
          Developed by <span className="text-amber-400/90 font-semibold">{settings.developer}</span>
        </div>
      </div>
    </div>
  );
};

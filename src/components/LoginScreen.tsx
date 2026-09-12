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
  AlertCircle,
  Phone,
  MessageSquareCode,
  Palette,
  Crown,
  Briefcase,
  Wrench
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

    const res = login(usernameOrEmail, password);
    setIsLoading(false);
    if (!res.success) {
      setError(res.message || (language === 'ur' ? 'غلط یوزر نام یا پاس ورڈ' : 'Invalid credentials'));
    }
  };

  const handleQuickLogin = (uname: string, pass: string) => {
    setUsernameOrEmail(uname);
    setPassword(pass);
    setError('');
    const res = login(uname, pass);
    if (!res.success) {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080d1a] flex flex-col items-center px-4 py-6 sm:py-10 relative overflow-y-auto selection:bg-amber-600 selection:text-white">
      {/* Premium Ambient Blue & Warm Bronze / Cognac Lighting */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/4 -right-32 w-96 h-96 bg-amber-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 bg-amber-800/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 -right-20 w-80 h-80 bg-blue-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar: Bespoke Studio Tagline & Language Switch */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d172e]/90 border border-amber-900/40 backdrop-blur-md text-[11px] text-slate-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-semibold bg-gradient-to-r from-blue-300 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            SAGHAR ARTS • Studio Suite
          </span>
        </div>

        <button
          onClick={() => toggleLanguage()}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-amber-900/40 bg-[#0d172e]/90 hover:bg-[#132244] text-xs font-semibold text-amber-300 transition shadow-lg cursor-pointer backdrop-blur-md"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{language === 'en' ? 'اردو (Urdu)' : 'English'}</span>
        </button>
      </div>

      <div className="w-full max-w-lg bg-[#0c162e]/95 border border-amber-900/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/60 relative z-10 backdrop-blur-xl">
        {/* Brand Header with Royal Sapphire & Warm Bronze Accent */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center p-0.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-amber-600 to-amber-400 shadow-xl shadow-amber-900/30 mb-2.5">
            <div className="w-14 h-14 rounded-[14px] bg-[#080d1a] flex items-center justify-center text-amber-400 border border-amber-600/30">
              <Layers className="w-8 h-8 stroke-[2.2] text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white">
            {settings.businessName}
          </h1>
          <p className="text-xs font-bold tracking-wide uppercase mt-0.5 bg-gradient-to-r from-blue-300 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            {language === 'ur' ? 'سائن بورڈ • 3D ڈیزائن • نیون و فلیکس • ڈیجیٹل پرنٹنگ' : 'Sign Board • 3D Design • Neon & Flex • Digital Printing'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
            {settings.address}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ur' ? 'یوزر نام یا کردار' : 'Username / Role'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="w-4 h-4 text-amber-400" />
              </span>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-[#080d1a] border border-blue-900/60 rounded-xl text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-hidden placeholder:text-slate-500 transition"
                placeholder="admin / owner / worker"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {language === 'ur' ? 'پاس ورڈ' : 'Password'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-4 h-4 text-blue-400" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-10 py-2.5 bg-[#080d1a] border border-blue-900/60 rounded-xl text-white text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-hidden placeholder:text-slate-500 transition"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-blue-900 bg-[#080d1a] text-amber-500 focus:ring-0"
              />
              <span>{language === 'ur' ? 'مجھے یاد رکھیں' : 'Remember Session'}</span>
            </label>
            <span className="text-amber-400 font-medium text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              {language === 'ur' ? 'مکمل محفوظ رسائی' : 'Role-Protected'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 active:from-amber-700 active:to-amber-900 text-white font-black text-sm transition shadow-lg shadow-amber-950/60 border border-amber-500/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>{language === 'ur' ? 'سسٹم لاگ ان کریں' : 'Log In to SAGHAR ARTS'}</span>
              </>
            )}
          </button>
        </form>

        {/* Authorized Login Roles in Blue & Brown Theme */}
        <div className="mt-6 pt-5 border-t border-amber-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {language === 'ur' ? 'فوری لاگ ان اکاؤنٹس (کلک کریں)' : 'Authorized Login Roles (1-Click)'}
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">
              Ready to use
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Admin Role Card - Rich Cognac Brown */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', '1234')}
              className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#0d172e] to-amber-900/20 hover:from-amber-900/50 hover:to-amber-800/30 border border-amber-700/50 text-left transition group cursor-pointer shadow-md hover:border-amber-400"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  Admin
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-600/20 text-amber-300 border border-amber-500/30">
                  Full
                </span>
              </div>
              <div className="text-[11px] text-slate-200 font-mono font-bold">
                User: <span className="text-amber-300">admin</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Pass: <span className="text-white font-bold tracking-wider">1234</span>
              </div>
            </button>

            {/* Owner Role Card - Royal Sapphire Blue */}
            <button
              type="button"
              onClick={() => handleQuickLogin('owner', '12345')}
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/50 via-[#0d172e] to-blue-900/25 hover:from-blue-900/60 hover:to-blue-800/35 border border-blue-600/50 text-left transition group cursor-pointer shadow-md hover:border-blue-400"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Owner
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30">
                  Hafiz
                </span>
              </div>
              <div className="text-[11px] text-slate-200 font-mono font-bold">
                User: <span className="text-blue-300">owner</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Pass: <span className="text-white font-bold tracking-wider">12345</span>
              </div>
            </button>

            {/* Worker Role Card - Warm Saddle Leather / Antique Bronze */}
            <button
              type="button"
              onClick={() => handleQuickLogin('worker', '123456')}
              className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/30 via-[#0d172e] to-yellow-950/20 hover:from-amber-900/40 hover:to-yellow-900/25 border border-amber-800/50 text-left transition group cursor-pointer shadow-md hover:border-amber-500"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-300 group-hover:text-amber-200 flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" />
                  Worker
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-700/20 text-amber-300 border border-amber-600/30">
                  Shop
                </span>
              </div>
              <div className="text-[11px] text-slate-200 font-mono font-bold">
                User: <span className="text-amber-300">worker</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Pass: <span className="text-white font-bold tracking-wider">123456</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer: Prominent Peak of Graphics attribution in Blue & Brown Luxury Styling */}
        <div className="mt-6 pt-4 border-t border-amber-900/30 text-center">
          <p className="text-[11px] text-slate-400">
            Developed by{' '}
            <span className="font-extrabold bg-gradient-to-r from-blue-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Peak of Graphics
            </span>
          </p>
          <div className="mt-1 flex items-center justify-center gap-3 text-xs">
            <a
              href="tel:+923023536973"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080d1a] hover:bg-[#132244] text-amber-300 border border-amber-900/50 font-mono font-semibold transition text-[11px]"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              +92 3023536973
            </a>
            <a
              href="https://wa.me/923023536973"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-700/40 text-[11px] font-semibold transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

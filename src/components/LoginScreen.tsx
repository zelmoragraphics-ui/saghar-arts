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
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center px-4 py-6 sm:py-10 relative overflow-y-auto selection:bg-amber-500 selection:text-slate-950">
      {/* Vibrant Colorful LED / Neon Glowing Ambient Spheres */}
      <div className="fixed -top-32 -left-32 w-80 h-80 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="fixed top-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="fixed bottom-10 -right-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Bar: Colorful Tagline & Language Switch */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-[11px] text-slate-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
            SAGHAR ARTS • Studio Suite
          </span>
        </div>

        <button
          onClick={() => toggleLanguage()}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-amber-400 transition shadow-lg cursor-pointer backdrop-blur-md"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'اردو (Urdu)' : 'English'}</span>
        </button>
      </div>

      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-purple-950/25 relative z-10 backdrop-blur-xl">
        {/* Brand Header with Rich Multi-Color Neon Accent */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center p-0.5 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 shadow-xl shadow-amber-500/25 mb-2.5">
            <div className="w-14 h-14 rounded-[14px] bg-slate-950 flex items-center justify-center text-amber-400">
              <Layers className="w-8 h-8 stroke-[2.2] text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white">
            {settings.businessName}
          </h1>
          <p className="text-xs font-bold tracking-wide uppercase mt-0.5 bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-hidden placeholder:text-slate-500 transition"
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
                <Lock className="w-4 h-4 text-cyan-400" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-hidden placeholder:text-slate-500 transition"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
              />
              <span>{language === 'ur' ? 'مجھے یاد رکھیں' : 'Remember Session'}</span>
            </label>
            <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {language === 'ur' ? 'مکمل محفوظ رسائی' : 'Role-Protected'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>{language === 'ur' ? 'سسٹم لاگ ان کریں' : 'Log In to SAGHAR ARTS'}</span>
              </>
            )}
          </button>
        </form>

        {/* Colorful Quick One-Click Login Cards with exact requested credentials */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {language === 'ur' ? 'فوری لاگ ان اکاؤنٹس (کلک کریں)' : 'Authorized Login Roles (1-Click)'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Ready to use
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Admin Role Card */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', '1234')}
              className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-800/80 to-amber-950/20 hover:from-amber-500/20 hover:to-amber-900/30 border border-amber-500/40 text-left transition group cursor-pointer shadow-md hover:border-amber-400"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  Admin
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
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

            {/* Owner Role Card */}
            <button
              type="button"
              onClick={() => handleQuickLogin('owner', '12345')}
              className="p-3 rounded-2xl bg-gradient-to-br from-sky-500/10 via-slate-800/80 to-cyan-950/20 hover:from-sky-500/20 hover:to-cyan-900/30 border border-sky-500/40 text-left transition group cursor-pointer shadow-md hover:border-sky-400"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-sky-400 group-hover:text-sky-300 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Owner
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  Hafiz
                </span>
              </div>
              <div className="text-[11px] text-slate-200 font-mono font-bold">
                User: <span className="text-sky-300">owner</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Pass: <span className="text-white font-bold tracking-wider">12345</span>
              </div>
            </button>

            {/* Worker Role Card */}
            <button
              type="button"
              onClick={() => handleQuickLogin('worker', '123456')}
              className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-800/80 to-teal-950/20 hover:from-emerald-500/20 hover:to-teal-900/30 border border-emerald-500/40 text-left transition group cursor-pointer shadow-md hover:border-emerald-400"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" />
                  Worker
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Shop
                </span>
              </div>
              <div className="text-[11px] text-slate-200 font-mono font-bold">
                User: <span className="text-emerald-300">worker</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Pass: <span className="text-white font-bold tracking-wider">123456</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer: Prominent Peak of Graphics attribution with Phone number */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            Developed by{' '}
            <span className="font-extrabold text-transparent bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text">
              Peak of Graphics
            </span>
          </p>
          <div className="mt-1 flex items-center justify-center gap-3 text-xs">
            <a
              href="tel:+923023536973"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-mono font-semibold transition text-[11px]"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              +92 3023536973
            </a>
            <a
              href="https://wa.me/923023536973"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

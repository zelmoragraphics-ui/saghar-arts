import React from 'react';
import { 
  Globe, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Key, 
  Menu,
  ShieldCheck,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    user, 
    logout, 
    settings, 
    language, 
    toggleLanguage, 
    t, 
    materials, 
    orders,
    setShowPasswordChangeModal 
  } = useApp();

  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Calculate quick alerts
  const lowStockCount = materials.filter(m => m.currentStock <= m.minStockAlert).length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Designing').length;

  return (
    <header className="no-print bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between">
      {/* Left: Mobile menu button & Business Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 p-0.5 shadow-md shadow-amber-500/20">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-black text-transparent bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-sm tracking-wider">
              SA
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-wide flex items-center gap-1.5">
                {settings.businessName}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 text-slate-950 shadow-xs">
                PRO STUDIO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-md">
              {settings.address}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Actions, Language Switcher, Alerts & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => toggleLanguage()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-amber-400 transition cursor-pointer shadow-sm"
          title="Switch Language / زبان تبدیل کریں"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'اردو (Urdu)' : 'English'}</span>
        </button>

        {/* Low Stock & Pending Orders Alerts */}
        <div className="relative group">
          <div className="flex items-center gap-1 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <Bell className="w-4 h-4 text-slate-400" />
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                {lowStockCount} {language === 'ur' ? 'کم اسٹاک' : 'Low'}
              </span>
            )}
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[11px] font-bold">
                {pendingOrdersCount} {language === 'ur' ? 'آرڈرز' : 'Orders'}
              </span>
            )}
          </div>
        </div>

        {/* User Account dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/90 text-left transition"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs border border-slate-600">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight flex items-center gap-1">
                {user?.name || 'User'}
              </div>
              <span className="text-[10px] uppercase font-extrabold text-amber-400/90 tracking-wider">
                {user?.role || 'Guest'}
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div 
              className={`absolute top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 ${language === 'ur' ? 'left-0' : 'right-0'}`}
              onClick={() => setShowUserMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400">{user?.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Role: <span className="uppercase font-bold">{user?.role}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordChangeModal(true)}
                className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ur' ? 'پاس ورڈ تبدیل کریں' : 'Change Password'}</span>
              </button>

              <button
                onClick={logout}
                className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

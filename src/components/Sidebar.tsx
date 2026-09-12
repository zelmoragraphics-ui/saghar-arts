import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Truck, 
  Package, 
  Users, 
  Building2, 
  BadgeDollarSign, 
  Receipt, 
  TrendingUp, 
  FileText, 
  Settings, 
  Activity,
  Layers,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type TabType = 
  | 'dashboard' 
  | 'orders' 
  | 'purchases' 
  | 'inventory' 
  | 'categories'
  | 'customers' 
  | 'suppliers' 
  | 'salaries' 
  | 'expenses' 
  | 'profitLoss' 
  | 'reports' 
  | 'settings' 
  | 'activityLog';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose
}) => {
  const { user, t, language, settings } = useApp();

  const isWorker = user?.role === 'worker';

  // Navigation items with role permission filtering & elegant Blue and Brown styling
  const navItems: { id: TabType; labelKey: any; icon: React.ReactNode; hidden?: boolean }[] = [
    {
      id: 'dashboard',
      labelKey: 'dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'orders',
      labelKey: 'orders',
      icon: <ShoppingCart className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'inventory',
      labelKey: 'inventory',
      icon: <Package className="w-4 h-4 text-amber-300" />
    },
    {
      id: 'categories',
      labelKey: 'categories',
      icon: <Layers className="w-4 h-4 text-blue-300" />
    },
    {
      id: 'customers',
      labelKey: 'customers',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      hidden: isWorker && !user?.permissions?.canViewPurchases
    },
    {
      id: 'purchases',
      labelKey: 'purchases',
      icon: <Truck className="w-4 h-4 text-blue-400" />,
      hidden: isWorker
    },
    {
      id: 'suppliers',
      labelKey: 'suppliers',
      icon: <Building2 className="w-4 h-4 text-amber-300" />,
      hidden: isWorker
    },
    {
      id: 'expenses',
      labelKey: 'expenses',
      icon: <Receipt className="w-4 h-4 text-amber-500" />,
      hidden: isWorker
    },
    {
      id: 'salaries',
      labelKey: 'salaries',
      icon: <BadgeDollarSign className="w-4 h-4 text-blue-300" />,
      hidden: isWorker
    },
    {
      id: 'profitLoss',
      labelKey: 'profitLoss',
      icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
      hidden: isWorker
    },
    {
      id: 'reports',
      labelKey: 'reports',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      hidden: isWorker
    },
    {
      id: 'settings',
      labelKey: 'settings',
      icon: <Settings className="w-4 h-4 text-amber-300" />,
      hidden: isWorker
    },
    {
      id: 'activityLog',
      labelKey: 'activityLog',
      icon: <Activity className="w-4 h-4 text-blue-300" />,
      hidden: isWorker
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`no-print fixed top-0 bottom-0 z-40 w-64 bg-[#0a1224] border-r border-amber-900/30 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : (language === 'ur' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
        } ${language === 'ur' ? 'right-0 lg:border-l lg:border-r-0' : 'left-0'}`}
      >
        {/* Top Header inside sidebar */}
        <div className="p-4 border-b border-amber-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/60 border border-amber-600/40 text-amber-400 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider text-white">SAGHAR ARTS</h2>
              <p className="text-[10px] text-amber-400/90 font-semibold tracking-wide">
                {language === 'ur' ? 'سائن بورڈ و ایڈورٹائزنگ' : 'Sign Board & 3D Studio'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Banner */}
        <div className="px-4 py-2.5 bg-[#070c17]/80 border-b border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
              {user?.name || 'Authorized'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-700/50">
            {user?.role || 'Guest'}
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.filter(item => !item.hidden).map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white font-bold shadow-lg shadow-amber-950/60 ring-1 ring-amber-400/60'
                    : 'text-slate-300 hover:bg-blue-950/50 hover:text-amber-200'
                }`}
              >
                <span className={isActive ? 'text-white scale-110 transition-transform' : 'opacity-90'}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">
                  {t(item.labelKey)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Contact & Developer Credit */}
        <div className="p-3 border-t border-amber-900/30 bg-[#070c17]/80 text-center">
          <div className="text-[11px] font-extrabold text-slate-200">
            {settings.ownerName} • <a href={`tel:${settings.contactNumber}`} className="text-amber-400 hover:underline">{settings.contactNumber}</a>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <span>Dev:</span>
            <a 
              href="tel:+923023536973" 
              className="font-bold bg-gradient-to-r from-blue-400 via-amber-300 to-amber-500 bg-clip-text text-transparent hover:underline"
              title="Peak of Graphics (+92 3023536973)"
            >
              Peak of Graphics
            </a>
            <span className="text-slate-500">•</span>
            <a href="tel:+923023536973" className="text-[10px] font-mono text-blue-400 hover:underline">
              +92 3023536973
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

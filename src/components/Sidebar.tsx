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

  // Navigation items with role permission filtering
  const navItems: { id: TabType; labelKey: any; icon: React.ReactNode; hidden?: boolean }[] = [
    {
      id: 'dashboard',
      labelKey: 'dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'orders',
      labelKey: 'orders',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      id: 'inventory',
      labelKey: 'inventory',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'categories',
      labelKey: 'categories',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'customers',
      labelKey: 'customers',
      icon: <Users className="w-4 h-4" />,
      hidden: isWorker && !user?.permissions?.canViewPurchases
    },
    {
      id: 'purchases',
      labelKey: 'purchases',
      icon: <Truck className="w-4 h-4" />,
      hidden: isWorker
    },
    {
      id: 'suppliers',
      labelKey: 'suppliers',
      icon: <Building2 className="w-4 h-4" />,
      hidden: isWorker
    },
    {
      id: 'expenses',
      labelKey: 'expenses',
      icon: <Receipt className="w-4 h-4" />,
      hidden: isWorker
    },
    {
      id: 'salaries',
      labelKey: 'salaries',
      icon: <BadgeDollarSign className="w-4 h-4" />,
      hidden: isWorker
    },
    {
      id: 'profitLoss',
      labelKey: 'profitLoss',
      icon: <TrendingUp className="w-4 h-4" />,
      hidden: isWorker
    },
    {
      id: 'reports',
      labelKey: 'reports',
      icon: <FileText className="w-4 h-4" />,
      hidden: isWorker
    },
    {
      id: 'settings',
      labelKey: 'settings',
      icon: <Settings className="w-4 h-4" />,
      hidden: isWorker
    },
    {
      id: 'activityLog',
      labelKey: 'activityLog',
      icon: <Activity className="w-4 h-4" />,
      hidden: isWorker
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`no-print fixed top-0 bottom-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : (language === 'ur' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
        } ${language === 'ur' ? 'right-0 lg:border-l lg:border-r-0' : 'left-0'}`}
      >
        {/* Top Header inside sidebar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
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
        <div className="px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
              {user?.name || 'Authorized'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
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
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>
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
        <div className="p-3 border-t border-slate-800 bg-slate-950/30 text-center">
          <div className="text-[11px] font-bold text-slate-300">
            {settings.ownerName} • {settings.contactNumber}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Dev: <span className="text-amber-400/80 font-medium">{settings.developer}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

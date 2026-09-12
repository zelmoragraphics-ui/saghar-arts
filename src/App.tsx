import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/DashboardView';
import { OrdersView } from './components/OrdersView';
import { PurchasesView } from './components/PurchasesView';
import { InventoryView } from './components/InventoryView';
import { CategoriesView } from './components/CategoriesView';
import { CustomersView } from './components/CustomersView';
import { SuppliersView } from './components/SuppliersView';
import { SalariesView } from './components/SalariesView';
import { ExpensesView } from './components/ExpensesView';
import { ProfitLossView } from './components/ProfitLossView';
import { SettingsView } from './components/SettingsView';

// Modals
import { InvoiceModal } from './components/InvoiceModal';
import { NewOrderModal } from './components/NewOrderModal';
import { NewPurchaseModal } from './components/NewPurchaseModal';
import { NewExpenseModal } from './components/NewExpenseModal';
import { PasswordChangeModal } from './components/PasswordChangeModal';

const MainLayout: React.FC = () => {
  const { 
    isAuthenticated, 
    activeInvoiceOrder, 
    setActiveInvoiceOrder,
    showPasswordChangeModal,
    setShowPasswordChangeModal,
    settings,
    user
  } = useApp();

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Creation Modals
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);

  if (!user || !isAuthenticated) {
    return <LoginScreen />;
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
            onOpenNewPurchaseModal={() => setIsNewPurchaseModalOpen(true)}
            onOpenNewExpenseModal={() => setIsNewExpenseModalOpen(true)}
          />
        );
      case 'orders':
        return <OrdersView onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)} />;
      case 'purchases':
        return <PurchasesView onOpenNewPurchaseModal={() => setIsNewPurchaseModalOpen(true)} />;
      case 'inventory':
        return <InventoryView />;
      case 'categories':
        return <CategoriesView />;
      case 'customers':
        return <CustomersView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'salaries':
        return <SalariesView />;
      case 'expenses':
        return <ExpensesView onOpenNewExpenseModal={() => setIsNewExpenseModalOpen(true)} />;
      case 'profitLoss':
      case 'reports':
        return <ProfitLossView />;
      case 'settings':
      case 'activityLog':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
            onOpenNewPurchaseModal={() => setIsNewPurchaseModalOpen(true)}
            onOpenNewExpenseModal={() => setIsNewExpenseModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Navigation Bar (Hidden when printing invoice) */}
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main workspace container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Role-based Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* View Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
      />

      <NewPurchaseModal
        isOpen={isNewPurchaseModalOpen}
        onClose={() => setIsNewPurchaseModalOpen(false)}
      />

      <NewExpenseModal
        isOpen={isNewExpenseModalOpen}
        onClose={() => setIsNewExpenseModalOpen(false)}
      />

      <InvoiceModal
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />

      <PasswordChangeModal
        isOpen={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

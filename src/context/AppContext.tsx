import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActivityLog, 
  BusinessSettings, 
  Customer, 
  Employee, 
  Expense, 
  MaterialStock, 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  ProductCategory, 
  Purchase, 
  SalaryRecord, 
  StockAdjustment, 
  Supplier, 
  User, 
  UserRole 
} from '../types';
import { 
  initialCategories, 
  initialCustomers, 
  initialEmployees, 
  initialExpenses, 
  initialMaterials, 
  initialOrders, 
  initialPurchases, 
  initialSalaries, 
  initialSettings, 
  initialSuppliers, 
  initialUsers 
} from '../utils/mockInitialData';
import { Language, getTranslation, translations } from '../utils/translations';

interface AppContextType {
  user: User | null;
  users: User[];
  settings: BusinessSettings;
  language: Language;
  toggleLanguage: (lang?: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  categories: ProductCategory[];
  materials: MaterialStock[];
  customers: Customer[];
  suppliers: Supplier[];
  orders: Order[];
  purchases: Purchase[];
  expenses: Expense[];
  employees: Employee[];
  salaries: SalaryRecord[];
  activityLogs: ActivityLog[];
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  showPasswordChangeModal: boolean;
  setShowPasswordChangeModal: (show: boolean) => void;

  // Authentication & Users
  login: (usernameOrEmail: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  updateUserPassword: (userId: string, newPass: string) => void;
  addUser: (newUser: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;

  // Orders & Sales
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrderPayment: (orderId: string, amount: number, method: PaymentMethod, note: string) => void;
  deleteOrder: (orderId: string) => void;

  // Purchases
  createPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
  deletePurchase: (purchaseId: string) => void;

  // Inventory
  adjustStock: (adjustment: Omit<StockAdjustment, 'id' | 'date' | 'performedBy'>) => void;
  addMaterial: (material: Omit<MaterialStock, 'id' | 'lastUpdated'>) => void;
  updateMaterial: (material: MaterialStock) => void;
  deleteMaterial: (materialId: string) => void;

  // Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalPaid' | 'remainingBalance' | 'createdAt'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addCustomerDirectPayment: (customerId: string, amount: number, method: PaymentMethod, note: string) => void;

  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalPurchases' | 'paidAmount' | 'remainingAmount' | 'createdAt'>) => Supplier;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;
  addSupplierPayment: (supplierId: string, amount: number, method: PaymentMethod, note: string) => void;

  // Expenses & Salaries
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (expenseId: string) => void;
  paySalary: (salary: Omit<SalaryRecord, 'id'>) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (emp: Employee) => void;

  // Settings & Categories
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (category: ProductCategory) => void;
  deleteCategory: (categoryId: string) => void;

  // Backup & Restore
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`saghar_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`saghar_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to localStorage key: ${key}`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = getStorage<User[]>('users', initialUsers);
    // Ensure default system accounts match user's exact required credentials:
    // admin: 1234, owner: 12345, worker: 123456
    return stored.map(u => {
      if (u.role === 'admin' && (u.password === 'admin' || !u.password)) {
        return { ...u, username: 'admin', password: '1234' };
      }
      if (u.role === 'owner' && (u.password === 'owner' || !u.password || u.username === 'hafiz')) {
        return { ...u, username: 'owner', password: '12345', name: 'Hafiz Saghar (Owner)' };
      }
      if (u.role === 'worker' && (u.password === 'worker' || !u.password)) {
        return { ...u, username: 'worker', password: '123456' };
      }
      return u;
    });
  });
  const [user, setUser] = useState<User | null>(() => getStorage('active_user', initialUsers[0])); // default logged in as Admin for instant usability
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const stored = getStorage<BusinessSettings>('settings', initialSettings);
    // Update developer if old attribution was stored
    if (!stored.developer || stored.developer.includes('Ahmad')) {
      return { ...stored, developer: 'Peak of Graphics (+92 3023536973)' };
    }
    return stored;
  });
  const [categories, setCategories] = useState<ProductCategory[]>(() => getStorage('categories', initialCategories));
  const [materials, setMaterials] = useState<MaterialStock[]>(() => getStorage('materials', initialMaterials));
  const [customers, setCustomers] = useState<Customer[]>(() => getStorage('customers', initialCustomers));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getStorage('suppliers', initialSuppliers));
  const [orders, setOrders] = useState<Order[]>(() => getStorage('orders', initialOrders));
  const [purchases, setPurchases] = useState<Purchase[]>(() => getStorage('purchases', initialPurchases));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStorage('expenses', initialExpenses));
  const [employees, setEmployees] = useState<Employee[]>(() => getStorage('employees', initialEmployees));
  const [salaries, setSalaries] = useState<SalaryRecord[]>(() => getStorage('salaries', initialSalaries));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getStorage('activity_logs', [
    {
      id: 'log-1',
      userId: 'user-admin',
      userName: 'Admin Ahmad',
      userRole: 'admin',
      action: 'System Startup',
      details: 'SAGHAR ARTS Commercial Management Suite Initialized',
      timestamp: new Date().toISOString()
    }
  ]));

  const [language, setLanguage] = useState<Language>(() => settings.language || 'en');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState<boolean>(false);

  // Sync language with document dir & settings
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  // Sync states to local storage
  useEffect(() => setStorage('users', users), [users]);
  useEffect(() => setStorage('active_user', user), [user]);
  useEffect(() => setStorage('settings', settings), [settings]);
  useEffect(() => setStorage('categories', categories), [categories]);
  useEffect(() => setStorage('materials', materials), [materials]);
  useEffect(() => setStorage('customers', customers), [customers]);
  useEffect(() => setStorage('suppliers', suppliers), [suppliers]);
  useEffect(() => setStorage('orders', orders), [orders]);
  useEffect(() => setStorage('purchases', purchases), [purchases]);
  useEffect(() => setStorage('expenses', expenses), [expenses]);
  useEffect(() => setStorage('employees', employees), [employees]);
  useEffect(() => setStorage('salaries', salaries), [salaries]);
  useEffect(() => setStorage('activity_logs', activityLogs), [activityLogs]);

  const logAction = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      userRole: user?.role || 'admin',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const toggleLanguage = (lang?: Language) => {
    const newLang = lang ? lang : (language === 'en' ? 'ur' : 'en');
    setLanguage(newLang);
    setSettings(prev => ({ ...prev, language: newLang }));
  };

  const t = (key: keyof typeof translations['en']) => {
    return getTranslation(language, key);
  };

  // Auth
  const login = (usernameOrEmail: string, password: string) => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check against standard users list
    let found = users.find(
      u => (u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput) &&
           u.password === cleanPass &&
           u.status === 'active'
    );

    // Support owner alias 'hafiz' or username 'owner' with 12345
    if (!found && (cleanInput === 'owner' || cleanInput === 'hafiz' || cleanInput === 'hafiz saghar') && cleanPass === '12345') {
      found = users.find(u => u.role === 'owner') || initialUsers.find(u => u.role === 'owner');
    }

    // Support admin with 1234 fallback
    if (!found && cleanInput === 'admin' && cleanPass === '1234') {
      found = users.find(u => u.role === 'admin') || initialUsers[0];
    }

    // Support worker with 123456 fallback
    if (!found && cleanInput === 'worker' && cleanPass === '123456') {
      found = users.find(u => u.role === 'worker') || initialUsers.find(u => u.role === 'worker');
    }

    if (found) {
      setUser(found);
      logAction('User Login', `Logged in as ${found.name} (${found.role})`);
      if (found.isFirstLogin && found.role === 'admin') {
        setShowPasswordChangeModal(true);
      }
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Please use Admin (1234), Owner (12345), or Worker (123456)' };
  };

  const logout = () => {
    if (user) {
      logAction('User Logout', `${user.name} logged out`);
    }
    setUser(null);
  };

  const updateUserPassword = (userId: string, newPass: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPass, isFirstLogin: false };
      }
      return u;
    }));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, password: newPass, isFirstLogin: false } : null);
    }
    logAction('Password Changed', 'User password updated successfully');
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const created: User = {
      ...newUser,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [...prev, created]);
    logAction('Add User', `Created user account for ${created.name} (${created.role})`);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
    }
    logAction('Update User', `Updated profile of ${updatedUser.name}`);
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target?.username === 'admin') {
      alert("Main Administrator account cannot be deleted!");
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    logAction('Delete User', `Removed user ${target?.name}`);
  };

  // Orders & Sales
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.name || 'Hafiz Saghar'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update customer stats
    setCustomers(prev => prev.map(c => {
      if (c.id === newOrder.customerId) {
        return {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalPaid: c.totalPaid + newOrder.advancePayment,
          remainingBalance: c.remainingBalance + newOrder.remainingBalance
        };
      }
      return c;
    }));

    // Deduct stock if matching category material exists
    setMaterials(prev => prev.map(m => {
      if (newOrder.productSummary.toLowerCase().includes(m.category.toLowerCase()) || 
          newOrder.items.some(item => item.category.toLowerCase().includes(m.category.toLowerCase()))) {
        const qtyToDeduct = newOrder.items.reduce((acc, curr) => acc + curr.quantity, 0);
        return {
          ...m,
          currentStock: Math.max(0, m.currentStock - qtyToDeduct),
          stockOutTotal: m.stockOutTotal + qtyToDeduct,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    }));

    logAction('New Order Created', `Invoice ${newOrder.invoiceNumber} for ${newOrder.customerName} - Total: ${settings.currency} ${newOrder.grandTotal}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, orderStatus: status, updatedAt: new Date().toISOString() };
      }
      return o;
    }));
    logAction('Order Status Updated', `Order ${orderId} changed to ${status}`);
  };

  const addOrderPayment = (orderId: string, amount: number, method: PaymentMethod, note: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newRemaining = Math.max(0, o.remainingBalance - amount);
        const newHistory = [
          ...o.paymentHistory,
          {
            id: `pay-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount,
            method,
            note
          }
        ];
        return {
          ...o,
          advancePayment: o.advancePayment + amount,
          remainingBalance: newRemaining,
          paymentHistory: newHistory,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    // Update customer remaining balance
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCustomers(prev => prev.map(c => {
        if (c.id === order.customerId) {
          return {
            ...c,
            totalPaid: c.totalPaid + amount,
            remainingBalance: Math.max(0, c.remainingBalance - amount)
          };
        }
        return c;
      }));
    }

    logAction('Payment Received', `Received ${settings.currency} ${amount} on Order ${order?.invoiceNumber} via ${method}`);
  };

  const deleteOrder = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      setCustomers(prev => prev.map(c => {
        if (c.id === ord.customerId) {
          return {
            ...c,
            totalOrders: Math.max(0, c.totalOrders - 1),
            totalPaid: Math.max(0, c.totalPaid - ord.advancePayment),
            remainingBalance: Math.max(0, c.remainingBalance - ord.remainingBalance)
          };
        }
        return c;
      }));
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
    logAction('Order Deleted', `Order ${ord?.invoiceNumber} deleted`);
  };

  // Purchases
  const createPurchase = (purchaseData: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPur: Purchase = {
      ...purchaseData,
      id: `pur-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPurchases(prev => [newPur, ...prev]);

    // Automatically increase material stock
    setMaterials(prev => prev.map(m => {
      if (m.id === newPur.materialId || m.name.toLowerCase() === newPur.materialName.toLowerCase()) {
        return {
          ...m,
          currentStock: m.currentStock + newPur.quantity,
          stockInTotal: m.stockInTotal + newPur.quantity,
          lastUpdated: newPur.purchaseDate
        };
      }
      return m;
    }));

    // Update supplier balance
    setSuppliers(prev => prev.map(s => {
      if (s.id === newPur.supplierId) {
        return {
          ...s,
          totalPurchases: s.totalPurchases + newPur.totalCost,
          paidAmount: s.paidAmount + newPur.paidAmount,
          remainingAmount: s.remainingAmount + newPur.remainingAmount
        };
      }
      return s;
    }));

    logAction('New Purchase', `Invoice ${newPur.invoiceNumber} from ${newPur.supplierName} - Cost: ${settings.currency} ${newPur.totalCost}`);
  };

  const deletePurchase = (purchaseId: string) => {
    setPurchases(prev => prev.filter(p => p.id !== purchaseId));
    logAction('Purchase Deleted', `Purchase ID ${purchaseId} removed`);
  };

  // Stock
  const adjustStock = (adjustment: Omit<StockAdjustment, 'id' | 'date' | 'performedBy'>) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === adjustment.materialId) {
        let newStock = m.currentStock;
        let wasted = m.wastedDamaged;
        let stockIn = m.stockInTotal;
        let stockOut = m.stockOutTotal;

        if (adjustment.type === 'in') {
          newStock += adjustment.quantity;
          stockIn += adjustment.quantity;
        } else if (adjustment.type === 'out') {
          newStock = Math.max(0, newStock - adjustment.quantity);
          stockOut += adjustment.quantity;
        } else if (adjustment.type === 'damage') {
          newStock = Math.max(0, newStock - adjustment.quantity);
          wasted += adjustment.quantity;
        } else if (adjustment.type === 'adjustment') {
          newStock = adjustment.quantity;
        }

        return {
          ...m,
          currentStock: newStock,
          wastedDamaged: wasted,
          stockInTotal: stockIn,
          stockOutTotal: stockOut,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    }));

    logAction('Stock Adjustment', `${adjustment.materialName}: ${adjustment.type} (${adjustment.quantity}) - Reason: ${adjustment.reason}`);
  };

  const addMaterial = (material: Omit<MaterialStock, 'id' | 'lastUpdated'>) => {
    const newMat: MaterialStock = {
      ...material,
      id: `mat-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setMaterials(prev => [...prev, newMat]);
    logAction('Material Added', `Added ${newMat.name} (${newMat.category})`);
  };

  const updateMaterial = (material: MaterialStock) => {
    setMaterials(prev => prev.map(m => m.id === material.id ? material : m));
    logAction('Material Updated', `Updated ${material.name}`);
  };

  const deleteMaterial = (materialId: string) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
    logAction('Material Deleted', `Material ID ${materialId} removed`);
  };

  // Customers
  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalPaid' | 'remainingBalance' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalOrders: 0,
      totalPaid: 0,
      remainingBalance: customerData.previousBalance || 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [...prev, newCust]);
    logAction('Customer Added', `Registered customer ${newCust.name}`);
    return newCust;
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    logAction('Customer Updated', `Updated customer ${customer.name}`);
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    logAction('Customer Deleted', `Customer ID ${customerId} deleted`);
  };

  const addCustomerDirectPayment = (customerId: string, amount: number, method: PaymentMethod, note: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          totalPaid: c.totalPaid + amount,
          remainingBalance: Math.max(0, c.remainingBalance - amount)
        };
      }
      return c;
    }));
    const cust = customers.find(c => c.id === customerId);
    logAction('Customer Payment', `Received direct payment ${settings.currency} ${amount} from ${cust?.name} via ${method}`);
  };

  // Suppliers
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'totalPurchases' | 'paidAmount' | 'remainingAmount' | 'createdAt'>): Supplier => {
    const newSup: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      totalPurchases: 0,
      paidAmount: 0,
      remainingAmount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSuppliers(prev => [...prev, newSup]);
    logAction('Supplier Added', `Registered supplier ${newSup.name} (${newSup.companyName})`);
    return newSup;
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
    logAction('Supplier Updated', `Updated supplier ${supplier.name}`);
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    logAction('Supplier Deleted', `Supplier ID ${supplierId} deleted`);
  };

  const addSupplierPayment = (supplierId: string, amount: number, method: PaymentMethod, note: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          paidAmount: s.paidAmount + amount,
          remainingAmount: Math.max(0, s.remainingAmount - amount)
        };
      }
      return s;
    }));
    const sup = suppliers.find(s => s.id === supplierId);
    logAction('Supplier Payment', `Paid ${settings.currency} ${amount} to ${sup?.name} via ${method}`);
  };

  // Expenses & Salaries
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    logAction('Expense Recorded', `${newExp.category}: ${settings.currency} ${newExp.amount} - ${newExp.description}`);
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    logAction('Expense Deleted', `Expense ID ${expenseId} removed`);
  };

  const paySalary = (salaryData: Omit<SalaryRecord, 'id'>) => {
    const newSal: SalaryRecord = {
      ...salaryData,
      id: `sal-${Date.now()}`
    };
    setSalaries(prev => [newSal, ...prev]);

    // Also track as operational salary expense
    const salaryExp: Expense = {
      id: `exp-sal-${Date.now()}`,
      category: 'Salary',
      description: `Disbursed salary for ${newSal.employeeName} (${newSal.month})`,
      amount: newSal.netSalary,
      date: newSal.paymentDate,
      paymentMethod: newSal.paymentMethod,
      notes: newSal.notes
    };
    setExpenses(prev => [salaryExp, ...prev]);

    logAction('Salary Paid', `Paid salary to ${newSal.employeeName} (${settings.currency} ${newSal.netSalary}) for ${newSal.month}`);
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [...prev, newEmp]);
    logAction('Employee Added', `Added employee ${newEmp.name} (${newEmp.designation})`);
  };

  const updateEmployee = (emp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
    logAction('Employee Updated', `Updated staff member ${emp.name}`);
  };

  // Settings & Categories
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAction('Settings Updated', 'Business configuration settings updated');
  };

  const addCategory = (categoryData: Omit<ProductCategory, 'id'>) => {
    const newCat: ProductCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
    logAction('Category Added', `Added product category ${newCat.name}`);
  };

  const updateCategory = (category: ProductCategory) => {
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    logAction('Category Updated', `Updated category ${category.name}`);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    logAction('Category Deleted', `Category ID ${categoryId} deleted`);
  };

  // Backup & Restore
  const exportBackup = () => {
    const backupData = {
      metadata: {
        appName: 'SAGHAR ARTS',
        exportDate: new Date().toISOString(),
        version: '2.0.0',
        developer: 'Peak of Graphics (+92 3023536973)'
      },
      settings,
      users,
      categories,
      materials,
      customers,
      suppliers,
      orders,
      purchases,
      expenses,
      employees,
      salaries,
      activityLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAGHAR_ARTS_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logAction('Backup Exported', 'Full database backup downloaded to JSON file');
  };

  const importBackup = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.settings) setSettings(data.settings);
      if (data.users) setUsers(data.users);
      if (data.categories) setCategories(data.categories);
      if (data.materials) setMaterials(data.materials);
      if (data.customers) setCustomers(data.customers);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.orders) setOrders(data.orders);
      if (data.purchases) setPurchases(data.purchases);
      if (data.expenses) setExpenses(data.expenses);
      if (data.employees) setEmployees(data.employees);
      if (data.salaries) setSalaries(data.salaries);
      if (data.activityLogs) setActivityLogs(data.activityLogs);
      logAction('Backup Restored', 'Database restored from uploaded JSON file');
      return true;
    } catch (err) {
      console.error('Failed to import backup JSON', err);
      return false;
    }
  };

  const resetToDemoData = () => {
    setUsers(initialUsers);
    setSettings(initialSettings);
    setCategories(initialCategories);
    setMaterials(initialMaterials);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setOrders(initialOrders);
    setPurchases(initialPurchases);
    setExpenses(initialExpenses);
    setEmployees(initialEmployees);
    setSalaries(initialSalaries);
    logAction('System Reset', 'All database records reset to default SAGHAR ARTS demo data');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        settings,
        language,
        toggleLanguage,
        t,
        categories,
        materials,
        customers,
        suppliers,
        orders,
        purchases,
        expenses,
        employees,
        salaries,
        activityLogs,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        showPasswordChangeModal,
        setShowPasswordChangeModal,
        login,
        logout,
        updateUserPassword,
        addUser,
        updateUser,
        deleteUser,
        createOrder,
        updateOrderStatus,
        addOrderPayment,
        deleteOrder,
        createPurchase,
        deletePurchase,
        adjustStock,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addCustomerDirectPayment,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addSupplierPayment,
        addExpense,
        deleteExpense,
        paySalary,
        addEmployee,
        updateEmployee,
        updateSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        exportBackup,
        importBackup,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

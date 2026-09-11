export type UserRole = 'admin' | 'owner' | 'manager' | 'accountant' | 'designer' | 'worker';

export type OrderStatus = 'Pending' | 'Designing' | 'Production' | 'Ready' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'Cash' | 'Bank' | 'JazzCash' | 'Easypaisa' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  phone?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  isFirstLogin?: boolean;
  permissions?: {
    canViewProfits: boolean;
    canViewSalaries: boolean;
    canViewPurchases: boolean;
    canManageUsers: boolean;
    canManageSettings: boolean;
    canDeleteRecords: boolean;
  };
}

export interface BusinessSettings {
  businessName: string;
  ownerName: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  developer: string;
  currency: string;
  invoicePrefix: string;
  taxRate: number;
  discountDefault: number;
  logoUrl?: string;
  invoiceHeaderNote: string;
  invoiceTerms: string;
  theme: 'dark' | 'light';
  language: 'en' | 'ur';
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'manual';
  lastBackupDate?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameUrdu: string;
  description?: string;
  defaultUnit: string;
  baseRate?: number;
  products?: string[];
}

export interface MaterialStock {
  id: string;
  name: string;
  nameUrdu: string;
  category: string;
  unit: string;
  currentStock: number;
  minStockAlert: number;
  stockInTotal: number;
  stockOutTotal: number;
  wastedDamaged: number;
  costPerUnit: number;
  lastUpdated: string;
}

export interface StockAdjustment {
  id: string;
  materialId: string;
  materialName: string;
  type: 'in' | 'out' | 'damage' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
  performedBy: string;
}

export interface Customer {
  id: string;
  name: string;
  fatherOrBusinessName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  previousBalance: number;
  totalOrders: number;
  totalPaid: number;
  remainingBalance: number;
  notes: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
  companyName: string;
  purchasedItems: string[];
  totalPurchases: number;
  paidAmount: number;
  remainingAmount: number;
  notes: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  category: string;
  product: string;
  designDetails: string;
  size: string;
  quantity: number;
  rate: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  // Summary fields
  productSummary: string;
  sizeSummary: string;
  totalAmount: number;
  discount: number;
  grandTotal: number;
  advancePayment: number;
  remainingBalance: number;
  deliveryDate: string;
  orderStatus: OrderStatus;
  assignedWorker: string;
  customerNotes: string;
  paymentMethod: PaymentMethod;
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    method: PaymentMethod;
    note: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  purchaseRate: number;
  totalCost: number;
  paidAmount: number;
  remainingAmount: number;
  purchaseDate: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  phone: string;
  monthlySalary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  role: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string; // e.g., "September 2026"
  baseSalary: number;
  advance: number;
  deduction: number;
  bonus: number;
  netSalary: number;
  paymentDate: string;
  status: 'Paid' | 'Unpaid';
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface Expense {
  id: string;
  category: 'Electricity' | 'Rent' | 'Transport' | 'Maintenance' | 'Material Wastage' | 'Salary' | 'Food & Tea' | 'Advertising' | 'Other';
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  type: 'sale_advance' | 'sale_balance' | 'purchase_payment' | 'expense' | 'salary' | 'customer_direct';
  referenceId: string;
  partyName: string;
  amount: number;
  method: PaymentMethod;
  note: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
}

import { 
  BusinessSettings, 
  Customer, 
  Employee, 
  Expense, 
  MaterialStock, 
  Order, 
  ProductCategory, 
  Purchase, 
  SalaryRecord, 
  Supplier, 
  User 
} from '../types';

export const initialSettings: BusinessSettings = {
  businessName: 'SAGHAR ARTS',
  ownerName: 'Hafiz Saghar',
  contactNumber: '03007639501',
  whatsappNumber: '03007639501',
  email: 'sagharts.fsd@gmail.com',
  address: 'Imtyaz Shaheed Road, Near Habeeb Chowk, Madina Town, Faisalabad',
  developer: 'Ahmad Jahanzaib',
  currency: 'Rs.',
  invoicePrefix: 'SA-',
  taxRate: 0,
  discountDefault: 0,
  invoiceHeaderNote: 'Sign Board • 3D Design • Acrylic & Neon • Digital Printing • Vehicle Graphics',
  invoiceTerms: '1. 50% advance is required before starting production.\n2. Goods once sold or fabricated as per approved proof will not be exchanged or returned.\n3. Electrical & Neon warranty is valid for 6 months.\n4. Balance must be cleared upon delivery/installation.',
  theme: 'dark',
  language: 'en',
  autoBackup: true,
  backupFrequency: 'daily',
  lastBackupDate: new Date().toISOString()
};

export const initialCategories: ProductCategory[] = [
  { id: 'cat-1', name: '3D Design', nameUrdu: 'تھری ڈی ڈیزائن', defaultUnit: 'Designs', baseRate: 3500 },
  { id: 'cat-2', name: 'LED Board', nameUrdu: 'ایل ای ڈی بورڈ', defaultUnit: 'Sq. Ft.', baseRate: 1200 },
  { id: 'cat-3', name: 'Black & White Board', nameUrdu: 'بلیک اینڈ وائٹ بورڈ', defaultUnit: 'Sq. Ft.', baseRate: 450 },
  { id: 'cat-4', name: 'Neon Sign', nameUrdu: 'نیون سائن', defaultUnit: 'Running Ft.', baseRate: 850 },
  { id: 'cat-5', name: 'Metal Art', nameUrdu: 'میٹل آرٹ', defaultUnit: 'Sq. Ft.', baseRate: 1500 },
  { id: 'cat-6', name: 'Flex Board', nameUrdu: 'فلیکس بورڈ', defaultUnit: 'Sq. Ft.', baseRate: 180 },
  { id: 'cat-7', name: 'Cloth Banner', nameUrdu: 'کپڑے کا بینر', defaultUnit: 'Sq. Ft.', baseRate: 120 },
  { id: 'cat-8', name: 'Angle Stand', nameUrdu: 'اینگل اسٹینڈ', defaultUnit: 'Pieces', baseRate: 2200 },
  { id: 'cat-9', name: 'Bike Sticker', nameUrdu: 'بائیک اسٹیکر', defaultUnit: 'Sets', baseRate: 350 },
  { id: 'cat-10', name: 'Car Sticker', nameUrdu: 'کار اسٹیکر', defaultUnit: 'Sets', baseRate: 1200 },
  { id: 'cat-11', name: 'White Lamination', nameUrdu: 'سفید لیمینیشن', defaultUnit: 'Sq. Ft.', baseRate: 90 },
  { id: 'cat-12', name: 'Black Lamination', nameUrdu: 'سیاہ لیمینیشن', defaultUnit: 'Sq. Ft.', baseRate: 110 },
  { id: 'cat-13', name: 'Car Lamination', nameUrdu: 'کار لیمینیشن / ریپنگ', defaultUnit: 'Vehicle', baseRate: 18000 },
  { id: 'cat-14', name: 'Bike Lamination', nameUrdu: 'بائیک لیمینیشن', defaultUnit: 'Vehicle', baseRate: 2500 },
  { id: 'cat-15', name: 'Government Number Plate', nameUrdu: 'سرکاری نمبر پلیٹ', defaultUnit: 'Pairs', baseRate: 1500 },
  { id: 'cat-16', name: 'Fancy Number Plate', nameUrdu: 'فینسی نمبر پلیٹ', defaultUnit: 'Pairs', baseRate: 1800 },
  { id: 'cat-17', name: 'Custom Number Plate', nameUrdu: 'کسٹم نمبر پلیٹ', defaultUnit: 'Pairs', baseRate: 2200 },
  { id: 'cat-18', name: 'Acrylic Work', nameUrdu: 'ایکرائلک کا کام', defaultUnit: 'Sq. Ft.', baseRate: 950 },
  { id: 'cat-19', name: 'ACP / Aluminium Sign Board', nameUrdu: 'اے سی پی / ایلومینیم بورڈ', defaultUnit: 'Sq. Ft.', baseRate: 750 },
  { id: 'cat-20', name: 'Vinyl Sticker', nameUrdu: 'ونائل اسٹیکر', defaultUnit: 'Sq. Ft.', baseRate: 140 },
  { id: 'cat-21', name: 'Shop Sign Board', nameUrdu: 'دکان کا سائن بورڈ', defaultUnit: 'Sq. Ft.', baseRate: 550 },
  { id: 'cat-22', name: 'Visiting Cards', nameUrdu: 'وزٹنگ کارڈز', defaultUnit: 'Box (1000 pcs)', baseRate: 1200 },
  { id: 'cat-23', name: 'Posters', nameUrdu: 'پوسٹرز', defaultUnit: 'Pieces', baseRate: 80 },
  { id: 'cat-24', name: 'Banners', nameUrdu: 'اشتہاری بینرز', defaultUnit: 'Sq. Ft.', baseRate: 40 },
  { id: 'cat-25', name: 'Digital Printing', nameUrdu: 'ڈیجیٹل پرنٹنگ', defaultUnit: 'Sq. Ft.', baseRate: 65 },
  { id: 'cat-26', name: 'Other Custom Services', nameUrdu: 'دیگر کسٹم سروسز', defaultUnit: 'Job', baseRate: 1000 }
];

export const initialMaterials: MaterialStock[] = [
  { id: 'mat-1', name: 'Flex Star Roll (10 ft)', nameUrdu: 'فلیکس اسٹار رول', category: 'Flex', unit: 'Rolls', currentStock: 14, minStockAlert: 5, stockInTotal: 40, stockOutTotal: 26, wastedDamaged: 1, costPerUnit: 14500, lastUpdated: '2026-09-10' },
  { id: 'mat-2', name: 'Vinyl Gloss White (5 ft)', nameUrdu: 'ونائل وائٹ رول', category: 'Vinyl', unit: 'Rolls', currentStock: 9, minStockAlert: 4, stockInTotal: 25, stockOutTotal: 16, wastedDamaged: 0, costPerUnit: 11000, lastUpdated: '2026-09-11' },
  { id: 'mat-3', name: 'LED Samsung Modules (3-Chip)', nameUrdu: 'ایل ای ڈی ماڈیولز', category: 'LED', unit: 'Pieces', currentStock: 650, minStockAlert: 200, stockInTotal: 2000, stockOutTotal: 1350, wastedDamaged: 20, costPerUnit: 45, lastUpdated: '2026-09-09' },
  { id: 'mat-4', name: 'Acrylic Cast Sheet 3mm (8x4)', nameUrdu: 'ایکرائلک شیٹ 3 ملی میٹر', category: 'Acrylic', unit: 'Sheets', currentStock: 18, minStockAlert: 6, stockInTotal: 45, stockOutTotal: 27, wastedDamaged: 1, costPerUnit: 8200, lastUpdated: '2026-09-08' },
  { id: 'mat-5', name: 'Metal GI Sheets 22 Gauge', nameUrdu: 'میٹل جی آئی شیٹ', category: 'Metal Sheets', unit: 'Sheets', currentStock: 12, minStockAlert: 5, stockInTotal: 30, stockOutTotal: 18, wastedDamaged: 0, costPerUnit: 4200, lastUpdated: '2026-09-07' },
  { id: 'mat-6', name: 'ACP Aluminium Panels (Metallic)', nameUrdu: 'اے سی پی پینلز', category: 'ACP', unit: 'Sheets', currentStock: 8, minStockAlert: 4, stockInTotal: 24, stockOutTotal: 16, wastedDamaged: 0, costPerUnit: 5800, lastUpdated: '2026-09-06' },
  { id: 'mat-7', name: 'Transparent Lamination Roll', nameUrdu: 'لیمینیشن رول', category: 'Lamination Rolls', unit: 'Rolls', currentStock: 6, minStockAlert: 3, stockInTotal: 20, stockOutTotal: 14, wastedDamaged: 0, costPerUnit: 6500, lastUpdated: '2026-09-05' },
  { id: 'mat-8', name: 'Reflective Neon Sticker Film', nameUrdu: 'ریفلیکٹو اسٹیکر فلم', category: 'Stickers', unit: 'Rolls', currentStock: 4, minStockAlert: 3, stockInTotal: 15, stockOutTotal: 11, wastedDamaged: 0, costPerUnit: 7200, lastUpdated: '2026-09-10' },
  { id: 'mat-9', name: 'Cloth Banner Fabric (Parachute)', nameUrdu: 'کپڑا بینر فیبرک', category: 'Cloth', unit: 'Meters', currentStock: 220, minStockAlert: 80, stockInTotal: 600, stockOutTotal: 380, wastedDamaged: 10, costPerUnit: 95, lastUpdated: '2026-09-04' },
  { id: 'mat-10', name: 'Neon Silicone Flex Tube (12V)', nameUrdu: 'نیون سلیکون ٹیوب', category: 'Neon Material', unit: 'Meters', currentStock: 85, minStockAlert: 40, stockInTotal: 300, stockOutTotal: 215, wastedDamaged: 5, costPerUnit: 180, lastUpdated: '2026-09-11' },
  { id: 'mat-11', name: 'Solvent Ink Cyan/Mag/Yel/Blk', nameUrdu: 'سالوینٹ پرنٹنگ انک', category: 'Printing Material', unit: 'Bottles (5L)', currentStock: 7, minStockAlert: 4, stockInTotal: 20, stockOutTotal: 13, wastedDamaged: 0, costPerUnit: 8500, lastUpdated: '2026-09-08' },
  { id: 'mat-12', name: 'Number Plate Aluminium Blanks', nameUrdu: 'نمبر پلیٹ ایلومینیم خالی', category: 'Number Plate Material', unit: 'Pairs', currentStock: 42, minStockAlert: 15, stockInTotal: 120, stockOutTotal: 78, wastedDamaged: 2, costPerUnit: 450, lastUpdated: '2026-09-11' },
  { id: 'mat-13', name: 'Enamel Industrial Paint Black', nameUrdu: 'انامیل پینٹ بلیک', category: 'Paint', unit: 'Cans', currentStock: 5, minStockAlert: 2, stockInTotal: 16, stockOutTotal: 11, wastedDamaged: 0, costPerUnit: 1400, lastUpdated: '2026-09-02' },
  { id: 'mat-14', name: 'Iron Angles & Screws Hardware', nameUrdu: 'آئرن اینگلز اور اسکرو', category: 'Hardware', unit: 'Kg', currentStock: 45, minStockAlert: 20, stockInTotal: 150, stockOutTotal: 105, wastedDamaged: 0, costPerUnit: 320, lastUpdated: '2026-09-01' }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Mian Tariq Mehmood',
    fatherOrBusinessName: 'Tariq Autos & Spare Parts',
    mobile: '03009654123',
    whatsapp: '03009654123',
    address: 'Susan Road, Madina Town, Faisalabad',
    previousBalance: 12000,
    totalOrders: 4,
    totalPaid: 65000,
    remainingBalance: 12000,
    notes: 'Regular client for shop front 3D boards and fancy number plates.',
    createdAt: '2026-08-10'
  },
  {
    id: 'cust-2',
    name: 'Sheikh Usman Ali',
    fatherOrBusinessName: 'Usman Fabrics & Boutique',
    mobile: '03217654890',
    whatsapp: '03217654890',
    address: 'Katchery Bazaar, Faisalabad',
    previousBalance: 0,
    totalOrders: 6,
    totalPaid: 115000,
    remainingBalance: 0,
    notes: 'Prompt payment, requires high-grade LED signs and cloth banners.',
    createdAt: '2026-08-15'
  },
  {
    id: 'cust-3',
    name: 'Malik Zeeshan',
    fatherOrBusinessName: 'Zeeshan Modern Cafe & Lounge',
    mobile: '03028889911',
    whatsapp: '03028889911',
    address: 'Kohinoor City, Jaranwala Road, Faisalabad',
    previousBalance: 8500,
    totalOrders: 3,
    totalPaid: 45000,
    remainingBalance: 8500,
    notes: 'Neon signs and outdoor ACP board specialist jobs.',
    createdAt: '2026-08-22'
  },
  {
    id: 'cust-4',
    name: 'Chaudhry Bilal Ahmad',
    fatherOrBusinessName: 'Al-Madina Rent a Car',
    mobile: '03017772233',
    whatsapp: '03017772233',
    address: 'Near Habeeb Chowk, Madina Town, Faisalabad',
    previousBalance: 3500,
    totalOrders: 8,
    totalPaid: 42000,
    remainingBalance: 3500,
    notes: 'Vehicle laminations, stickers, and custom number plates.',
    createdAt: '2026-08-01'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Al-Haram Flex & Vinyl Traders',
    companyName: 'Al-Haram Flex Traders',
    contact: '03008651234',
    address: 'Railway Road, Faisalabad',
    purchasedItems: ['Flex Star Roll', 'Vinyl Gloss White', 'Solvent Inks'],
    totalPurchases: 145000,
    paidAmount: 125000,
    remainingAmount: 20000,
    notes: 'Primary supplier for printing media. Bulk discount available.',
    createdAt: '2026-07-20'
  },
  {
    id: 'sup-2',
    name: 'Punjab Acrylic & Neon Center',
    companyName: 'Punjab Acrylic House',
    contact: '03226543210',
    address: 'Liaqat Road, Near Ghanta Ghar, Faisalabad',
    purchasedItems: ['Acrylic Cast Sheet 3mm', 'Neon Silicone Flex Tube', 'LED Samsung Modules'],
    totalPurchases: 220000,
    paidAmount: 205000,
    remainingAmount: 15000,
    notes: 'Delivers next day. High quality Taiwan cast acrylic.',
    createdAt: '2026-07-25'
  },
  {
    id: 'sup-3',
    name: 'Faisal Iron & ACP Warehouse',
    companyName: 'Faisal Iron Store',
    contact: '03049988776',
    address: 'Samundri Road Industrial Area, Faisalabad',
    purchasedItems: ['ACP Panels', 'Metal GI Sheets', 'Iron Angles'],
    totalPurchases: 95000,
    paidAmount: 95000,
    remainingAmount: 0,
    notes: 'All dues cleared. Reliable structural materials.',
    createdAt: '2026-08-05'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Hafiz Saghar',
    designation: 'Managing Director & Master Craftsman',
    phone: '03007639501',
    monthlySalary: 75000,
    joinDate: '2020-01-01',
    status: 'active',
    role: 'owner'
  },
  {
    id: 'emp-2',
    name: 'Muhammad Rizwan',
    designation: 'Senior 3D & Sign Designer',
    phone: '03058899221',
    monthlySalary: 42000,
    joinDate: '2022-03-15',
    status: 'active',
    role: 'designer'
  },
  {
    id: 'emp-3',
    name: 'Umar Farooq',
    designation: 'Master Welder & Board Fabricator',
    phone: '03126655443',
    monthlySalary: 38000,
    joinDate: '2022-06-01',
    status: 'active',
    role: 'worker'
  },
  {
    id: 'emp-4',
    name: 'Ali Raza',
    designation: 'Vehicle Graphics & Lamination Specialist',
    phone: '03081122334',
    monthlySalary: 32000,
    joinDate: '2023-02-10',
    status: 'active',
    role: 'worker'
  },
  {
    id: 'emp-5',
    name: 'Kamran Akram',
    designation: 'Accountant & Store Manager',
    phone: '03034455667',
    monthlySalary: 35000,
    joinDate: '2023-09-01',
    status: 'active',
    role: 'accountant'
  }
];

export const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Admin Ahmad',
    username: 'admin',
    email: 'admin@saghararts.com',
    password: 'admin', // Quick demo password, system prompts update
    role: 'admin',
    phone: '03007639501',
    status: 'active',
    isFirstLogin: false,
    permissions: {
      canViewProfits: true,
      canViewSalaries: true,
      canViewPurchases: true,
      canManageUsers: true,
      canManageSettings: true,
      canDeleteRecords: true
    }
  },
  {
    id: 'user-owner',
    name: 'Hafiz Saghar (Owner)',
    username: 'hafiz',
    email: 'hafiz@saghararts.com',
    password: 'owner',
    role: 'owner',
    phone: '03007639501',
    status: 'active',
    isFirstLogin: false,
    permissions: {
      canViewProfits: true,
      canViewSalaries: true,
      canViewPurchases: true,
      canManageUsers: false,
      canManageSettings: true,
      canDeleteRecords: false
    }
  },
  {
    id: 'user-worker',
    name: 'Muhammad Rizwan (Worker)',
    username: 'worker',
    email: 'worker@saghararts.com',
    password: 'worker',
    role: 'worker',
    phone: '03058899221',
    status: 'active',
    isFirstLogin: false,
    permissions: {
      canViewProfits: false,
      canViewSalaries: false,
      canViewPurchases: false,
      canManageUsers: false,
      canManageSettings: false,
      canDeleteRecords: false
    }
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    invoiceNumber: 'SA-INV-1001',
    orderNumber: 'ORD-2026-01',
    customerId: 'cust-1',
    customerName: 'Mian Tariq Mehmood',
    customerPhone: '03009654123',
    customerAddress: 'Susan Road, Madina Town, Faisalabad',
    items: [
      {
        id: 'item-1',
        category: 'LED Board',
        product: 'Front Elevation 3D LED Acrylic Board',
        designDetails: 'Gold mirror acrylic 3D raised letters with Samsung Samsung White LED backlight',
        size: '18 x 4 ft',
        quantity: 1,
        rate: 32000,
        discount: 2000,
        total: 30000
      }
    ],
    productSummary: 'Front Elevation 3D LED Acrylic Board',
    sizeSummary: '18 x 4 ft',
    totalAmount: 32000,
    discount: 2000,
    grandTotal: 30000,
    advancePayment: 18000,
    remainingBalance: 12000,
    deliveryDate: '2026-09-14',
    orderStatus: 'Production',
    assignedWorker: 'Umar Farooq (Fabricator)',
    customerNotes: 'Need installation completed before weekend opening.',
    paymentMethod: 'Bank',
    paymentHistory: [
      {
        id: 'pay-1',
        date: '2026-09-09',
        amount: 18000,
        method: 'Bank',
        note: 'Advance received via Meezan Bank'
      }
    ],
    createdAt: '2026-09-09T11:30:00Z',
    updatedAt: '2026-09-10T15:00:00Z',
    createdBy: 'Hafiz Saghar'
  },
  {
    id: 'ord-102',
    invoiceNumber: 'SA-INV-1002',
    orderNumber: 'ORD-2026-02',
    customerId: 'cust-3',
    customerName: 'Malik Zeeshan',
    customerPhone: '03028889911',
    customerAddress: 'Kohinoor City, Faisalabad',
    items: [
      {
        id: 'item-2',
        category: 'Neon Sign',
        product: 'Custom Warm-White Script Neon Sign',
        designDetails: 'Cafe Logo "Zeeshan Lounge" with transparent backing sheet',
        size: '6 x 2.5 ft',
        quantity: 1,
        rate: 14500,
        discount: 500,
        total: 14000
      }
    ],
    productSummary: 'Custom Warm-White Script Neon Sign',
    sizeSummary: '6 x 2.5 ft',
    totalAmount: 14500,
    discount: 500,
    grandTotal: 14000,
    advancePayment: 5500,
    remainingBalance: 8500,
    deliveryDate: '2026-09-12',
    orderStatus: 'Designing',
    assignedWorker: 'Muhammad Rizwan (Designer)',
    customerNotes: 'Please share vector mockups on WhatsApp before cutting acrylic.',
    paymentMethod: 'JazzCash',
    paymentHistory: [
      {
        id: 'pay-2',
        date: '2026-09-10',
        amount: 5500,
        method: 'JazzCash',
        note: 'Advance received via JazzCash'
      }
    ],
    createdAt: '2026-09-10T14:00:00Z',
    updatedAt: '2026-09-11T09:00:00Z',
    createdBy: 'Hafiz Saghar'
  },
  {
    id: 'ord-103',
    invoiceNumber: 'SA-INV-1003',
    orderNumber: 'ORD-2026-03',
    customerId: 'cust-4',
    customerName: 'Chaudhry Bilal Ahmad',
    customerPhone: '03017772233',
    customerAddress: 'Near Habeeb Chowk, Madina Town, Faisalabad',
    items: [
      {
        id: 'item-3',
        category: 'Car Lamination',
        product: 'Full Body Piano Gloss Black Roof Wrap & Door Protectors',
        designDetails: 'Toyota Corolla 2024 model - Bubble-free air release film',
        size: 'Sedan Car',
        quantity: 1,
        rate: 9500,
        discount: 500,
        total: 9000
      },
      {
        id: 'item-4',
        category: 'Custom Number Plate',
        product: 'Embossed Metal Laser Number Plate (Pair)',
        designDetails: 'FSD-24-9999 German font with blue border',
        size: 'Standard Pair',
        quantity: 1,
        rate: 2200,
        discount: 0,
        total: 2200
      }
    ],
    productSummary: 'Full Body Roof Wrap & Custom Number Plate',
    sizeSummary: 'Sedan + Standard Pair',
    totalAmount: 11700,
    discount: 500,
    grandTotal: 11200,
    advancePayment: 7700,
    remainingBalance: 3500,
    deliveryDate: '2026-09-11',
    orderStatus: 'Ready',
    assignedWorker: 'Ali Raza (Lamination)',
    customerNotes: 'Ready for customer pickup today.',
    paymentMethod: 'Cash',
    paymentHistory: [
      {
        id: 'pay-3',
        date: '2026-09-11',
        amount: 7700,
        method: 'Cash',
        note: 'Cash advance collected'
      }
    ],
    createdAt: '2026-09-11T08:15:00Z',
    updatedAt: '2026-09-11T12:00:00Z',
    createdBy: 'Hafiz Saghar'
  },
  {
    id: 'ord-104',
    invoiceNumber: 'SA-INV-1004',
    orderNumber: 'ORD-2026-04',
    customerId: 'cust-2',
    customerName: 'Sheikh Usman Ali',
    customerPhone: '03217654890',
    customerAddress: 'Katchery Bazaar, Faisalabad',
    items: [
      {
        id: 'item-5',
        category: 'Flex Board',
        product: 'Seasonal Sale Mega Flex Banner with Iron Frame',
        designDetails: 'High resolution digital print 720dpi Star flex',
        size: '20 x 8 ft',
        quantity: 1,
        rate: 6800,
        discount: 0,
        total: 6800
      }
    ],
    productSummary: 'Seasonal Sale Mega Flex Banner',
    sizeSummary: '20 x 8 ft',
    totalAmount: 6800,
    discount: 0,
    grandTotal: 6800,
    advancePayment: 6800,
    remainingBalance: 0,
    deliveryDate: '2026-09-08',
    orderStatus: 'Delivered',
    assignedWorker: 'Umar Farooq',
    customerNotes: 'Delivered & installed at Katchery Bazaar. Full payment received.',
    paymentMethod: 'Easypaisa',
    paymentHistory: [
      {
        id: 'pay-4',
        date: '2026-09-07',
        amount: 3000,
        method: 'Easypaisa',
        note: 'Advance'
      },
      {
        id: 'pay-5',
        date: '2026-09-08',
        amount: 3800,
        method: 'Easypaisa',
        note: 'Final settlement'
      }
    ],
    createdAt: '2026-09-07T10:00:00Z',
    updatedAt: '2026-09-08T18:00:00Z',
    createdBy: 'Hafiz Saghar'
  }
];

export const initialPurchases: Purchase[] = [
  {
    id: 'pur-1',
    invoiceNumber: 'PINV-2026-88',
    supplierId: 'sup-1',
    supplierName: 'Al-Haram Flex & Vinyl Traders',
    materialId: 'mat-1',
    materialName: 'Flex Star Roll (10 ft)',
    quantity: 5,
    unit: 'Rolls',
    purchaseRate: 14000,
    totalCost: 70000,
    paidAmount: 50000,
    remainingAmount: 20000,
    purchaseDate: '2026-09-06',
    paymentMethod: 'Bank',
    notes: '5 rolls received in warehouse in good condition.',
    createdAt: '2026-09-06'
  },
  {
    id: 'pur-2',
    invoiceNumber: 'PINV-2026-89',
    supplierId: 'sup-2',
    supplierName: 'Punjab Acrylic & Neon Center',
    materialId: 'mat-4',
    materialName: 'Acrylic Cast Sheet 3mm (8x4)',
    quantity: 4,
    unit: 'Sheets',
    purchaseRate: 8000,
    totalCost: 32000,
    paidAmount: 25000,
    remainingAmount: 7000,
    purchaseDate: '2026-09-08',
    paymentMethod: 'Cash',
    notes: 'Cast acrylic sheets for 3D letters.',
    createdAt: '2026-09-08'
  },
  {
    id: 'pur-3',
    invoiceNumber: 'PINV-2026-90',
    supplierId: 'sup-3',
    supplierName: 'Faisal Iron & ACP Warehouse',
    materialId: 'mat-6',
    materialName: 'ACP Aluminium Panels (Metallic)',
    quantity: 3,
    unit: 'Sheets',
    purchaseRate: 5800,
    totalCost: 17400,
    paidAmount: 17400,
    remainingAmount: 0,
    purchaseDate: '2026-09-10',
    paymentMethod: 'Bank',
    notes: 'Paid in full via Bank Transfer.',
    createdAt: '2026-09-10'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    category: 'Electricity',
    description: 'FESCO Workshop & Office Electricity Bill for August',
    amount: 14500,
    date: '2026-09-05',
    paymentMethod: 'Bank',
    notes: 'Paid online via FESCO portal'
  },
  {
    id: 'exp-2',
    category: 'Rent',
    description: 'Madina Town Workshop & Showroom Monthly Rent',
    amount: 35000,
    date: '2026-09-01',
    paymentMethod: 'Bank',
    notes: 'September rent paid to building landlord'
  },
  {
    id: 'exp-3',
    category: 'Transport',
    description: 'Cargo Rickshaw & Delivery Fuel for On-Site Signboard Installs',
    amount: 2800,
    date: '2026-09-09',
    paymentMethod: 'Cash',
    notes: 'Installation transport to Kohinoor & Katchery Bazaar'
  },
  {
    id: 'exp-4',
    category: 'Food & Tea',
    description: 'Staff daily refreshment & tea expenses',
    amount: 1850,
    date: '2026-09-10',
    paymentMethod: 'Cash',
    notes: 'Weekly workshop tea'
  },
  {
    id: 'exp-5',
    category: 'Maintenance',
    description: 'CNC Router cutting bit sharpening & compressor oil change',
    amount: 3200,
    date: '2026-09-07',
    paymentMethod: 'Cash',
    notes: 'Routine tool maintenance'
  }
];

export const initialSalaries: SalaryRecord[] = [
  {
    id: 'sal-1',
    employeeId: 'emp-2',
    employeeName: 'Muhammad Rizwan',
    designation: 'Senior 3D & Sign Designer',
    month: 'August 2026',
    baseSalary: 42000,
    advance: 5000,
    deduction: 0,
    bonus: 2000,
    netSalary: 39000,
    paymentDate: '2026-09-01',
    status: 'Paid',
    paymentMethod: 'Cash',
    notes: 'Salary for August disbursed on 1st Sept.'
  },
  {
    id: 'sal-2',
    employeeId: 'emp-3',
    employeeName: 'Umar Farooq',
    designation: 'Master Welder & Board Fabricator',
    month: 'August 2026',
    baseSalary: 38000,
    advance: 4000,
    deduction: 0,
    bonus: 1500,
    netSalary: 35500,
    paymentDate: '2026-09-02',
    status: 'Paid',
    paymentMethod: 'Cash',
    notes: 'August salary cleared.'
  },
  {
    id: 'sal-3',
    employeeId: 'emp-4',
    employeeName: 'Ali Raza',
    designation: 'Vehicle Graphics & Lamination Specialist',
    month: 'August 2026',
    baseSalary: 32000,
    advance: 2000,
    deduction: 0,
    bonus: 1000,
    netSalary: 31000,
    paymentDate: '2026-09-02',
    status: 'Paid',
    paymentMethod: 'Cash',
    notes: 'August salary cleared.'
  }
];

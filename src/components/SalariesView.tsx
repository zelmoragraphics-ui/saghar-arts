import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  DollarSign, 
  Calendar, 
  Printer, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Trash2, 
  Edit2,
  FileText,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Employee, SalaryRecord, PaymentMethod } from '../types';

export const SalariesView: React.FC = () => {
  const { 
    employees, 
    salaries, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    createSalaryRecord, 
    settings, 
    t, 
    language, 
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>('payroll');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Employee Modal
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empDesignation, setEmpDesignation] = useState('Signboard Fabricator & Installer');
  const [empPhone, setEmpPhone] = useState('');
  const [empCnic, setEmpCnic] = useState('');
  const [empSalary, setEmpSalary] = useState<number>(35000);
  const [empSalaryType, setEmpSalaryType] = useState<'monthly' | 'daily'>('monthly');

  // Process Salary Modal
  const [showProcessSalaryModal, setShowProcessSalaryModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [payMonth, setPayMonth] = useState<string>('September 2026');
  const [baseSalary, setBaseSalary] = useState<number>(employees[0]?.baseSalary || 35000);
  const [overtime, setOvertime] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Cash');
  const [payNote, setPayNote] = useState<string>('');

  // Printable Salary Voucher
  const [activeSalarySlip, setActiveSalarySlip] = useState<SalaryRecord | null>(null);

  const totalPayrollPaid = salaries.reduce((acc, s) => acc + s.netSalary, 0);

  const handleSelectEmpForSalary = (empId: string) => {
    setSelectedEmpId(empId);
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setBaseSalary(emp.baseSalary);
    }
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) return;

    addEmployee({
      name: empName,
      designation: empDesignation,
      phone: empPhone,
      cnic: empCnic,
      joiningDate: new Date().toISOString().split('T')[0],
      baseSalary: empSalary,
      salaryType: empSalaryType,
      status: 'active'
    });

    setShowAddEmpModal(false);
    setEmpName('');
    setEmpPhone('');
    setEmpCnic('');
  };

  const handleProcessSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    const netSalary = Math.max(0, baseSalary + overtime + bonus - deductions);

    const record = createSalaryRecord({
      employeeId: emp.id,
      employeeName: emp.name,
      designation: emp.designation,
      month: payMonth,
      baseSalary,
      overtimeAmount: overtime,
      bonus,
      deductions,
      netSalary,
      status: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod,
      notes: payNote
    });

    setShowProcessSalaryModal(false);
    setActiveSalarySlip(record);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('salaries')} & {t('staff')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'کاریگروں، ڈیزائنرز اور اسٹاف کی تنخواہیں اور سلپ' : 'Manage workshop artisans, graphic designers, payroll calculations & salary slips'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddEmpModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addEmployee')}</span>
          </button>

          <button
            onClick={() => {
              if (employees.length > 0) {
                handleSelectEmpForSalary(employees[0].id);
              }
              setShowProcessSalaryModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-purple-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'ur' ? 'تنخواہ ادا کریں' : 'Pay Salary'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{t('employeeCount')}</span>
          <div className="text-xl font-black text-white mt-1">
            {employees.length} <span className="text-xs text-slate-400 font-normal">Active Staff</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Designers, fabricators, installers</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{language === 'ur' ? 'ماہانہ پے رول تخمینہ' : 'Monthly Base Payroll'}</span>
          <div className="text-xl font-black text-purple-400 mt-1">
            {settings.currency} {employees.reduce((acc, e) => acc + e.baseSalary, 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Combined baseline monthly commitment</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{language === 'ur' ? 'کل تقسیم شدہ تنخواہیں' : 'Disbursed Salaries'}</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {settings.currency} {totalPayrollPaid.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{salaries.length} salary vouchers recorded</div>
        </div>
      </div>

      {/* Sub-tabs: Payroll Records vs Employees Directory */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'payroll'
              ? 'bg-purple-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ur' ? 'تنخواہوں کی تاریخ (واؤچرز)' : 'Payroll Records & Vouchers'} ({salaries.length})
        </button>

        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'employees'
              ? 'bg-purple-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ur' ? 'ملازمین کی فہرست' : 'Staff Directory'} ({employees.length})
        </button>
      </div>

      {/* Content depending on activeTab */}
      {activeTab === 'payroll' ? (
        <div className="space-y-3">
          {salaries.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
              <p className="text-sm font-semibold">No salary records generated yet.</p>
            </div>
          ) : (
            salaries.map(sal => (
              <div
                key={sal.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white">
                      {sal.employeeName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
                      {sal.month}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({sal.designation})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>Base: <strong className="text-slate-200">{settings.currency} {sal.baseSalary.toLocaleString()}</strong></span>
                    {sal.overtimeAmount > 0 && <span>• OT: <strong className="text-emerald-400">+{settings.currency} {sal.overtimeAmount.toLocaleString()}</strong></span>}
                    {sal.bonus > 0 && <span>• Bonus: <strong className="text-emerald-400">+{settings.currency} {sal.bonus.toLocaleString()}</strong></span>}
                    {sal.deductions > 0 && <span>• Deductions: <strong className="text-rose-400">-{settings.currency} {sal.deductions.toLocaleString()}</strong></span>}
                    <span>• Paid On: <strong className="text-slate-300">{sal.paymentDate}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Disbursed</span>
                    <span className="text-base font-black text-emerald-400">
                      {settings.currency} {sal.netSalary.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveSalarySlip(sal)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(emp => (
            <div
              key={emp.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">{emp.name}</h3>
                    <p className="text-xs text-purple-400 font-semibold">{emp.designation}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {emp.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 mt-3">
                  <p>Phone: <span className="font-mono text-slate-200">{emp.phone}</span></p>
                  <p>CNIC: <span className="font-mono text-slate-300">{emp.cnic}</span></p>
                  <p>Joined: <span className="text-slate-300">{emp.joiningDate}</span></p>
                  <p>Pay Model: <span className="font-semibold text-slate-200 uppercase">{emp.salaryType}</span></p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Base Salary</span>
                  <span className="text-sm font-black text-white">
                    {settings.currency} {emp.baseSalary.toLocaleString()}
                  </span>
                </div>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      if (confirm(t('confirmDelete'))) {
                        deleteEmployee(emp.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Process Salary Modal */}
      {showProcessSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-4">
              Disburse Salary Voucher
            </h3>

            <form onSubmit={handleProcessSalarySubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Select Employee *</label>
                <select
                  value={selectedEmpId}
                  onChange={e => handleSelectEmpForSalary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-purple-500 focus:outline-hidden"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.designation} (Rs. {emp.baseSalary.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Month / Period</label>
                <input
                  type="text"
                  value={payMonth}
                  onChange={e => setPayMonth(e.target.value)}
                  placeholder="e.g. September 2026"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Base Salary</label>
                  <input
                    type="number"
                    min="0"
                    value={baseSalary}
                    onChange={e => setBaseSalary(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Overtime</label>
                  <input
                    type="number"
                    min="0"
                    value={overtime}
                    onChange={e => setOvertime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bonus</label>
                  <input
                    type="number"
                    min="0"
                    value={bonus}
                    onChange={e => setBonus(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Advance Deductions</label>
                  <input
                    type="number"
                    min="0"
                    value={deductions}
                    onChange={e => setDeductions(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Easypaisa">Easypaisa</option>
                </select>
              </div>

              {/* Total Calculation */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Net Payable:</span>
                <span className="text-base font-black text-emerald-400">
                  {settings.currency} {(Math.max(0, baseSalary + overtime + bonus - deductions)).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProcessSalaryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md"
                >
                  Confirm & Print Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-4">
              Add New Staff Member
            </h3>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Aslam"
                  value={empName}
                  onChange={e => setEmpName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Designation / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Graphic & 3D Designer"
                  value={empDesignation}
                  onChange={e => setEmpDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="03001234567"
                    value={empPhone}
                    onChange={e => setEmpPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">CNIC</label>
                  <input
                    type="text"
                    placeholder="33100-XXXXXXX-X"
                    value={empCnic}
                    onChange={e => setEmpCnic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Base Monthly Salary</label>
                  <input
                    type="number"
                    min="0"
                    value={empSalary}
                    onChange={e => setEmpSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Payment Model</label>
                  <select
                    value={empSalaryType}
                    onChange={e => setEmpSalaryType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-purple-500 focus:outline-hidden"
                  >
                    <option value="monthly">Monthly Fixed</option>
                    <option value="daily">Daily Wage</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Slip Printable Modal */}
      {activeSalarySlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            <div className="no-print p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <span className="text-xs font-bold text-slate-300">Employee Salary Slip</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setActiveSalarySlip(null)}
                  className="p-1.5 rounded-xl bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="print-container p-6 bg-white text-slate-900 text-xs">
              <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                <h2 className="text-lg font-black tracking-wider text-slate-950">{settings.businessName}</h2>
                <p className="text-[10px] text-slate-600 font-semibold">{settings.address} • {settings.contactNumber}</p>
                <div className="mt-1 inline-block px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black uppercase tracking-widest text-slate-700">
                  SALARY VOUCHER / SLIP
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Employee:</span>
                  <span className="font-black text-slate-950">{activeSalarySlip.employeeName}</span>
                  <p className="text-slate-600 text-[11px]">{activeSalarySlip.designation}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Period:</span>
                  <span className="font-black text-slate-950">{activeSalarySlip.month}</span>
                  <p className="text-slate-600 text-[11px]">Disbursed: {activeSalarySlip.paymentDate}</p>
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden mb-4">
                <table className="w-full text-left border-collapse text-xs">
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 text-slate-600">Base Salary</td>
                      <td className="p-2 text-right font-bold">{settings.currency} {activeSalarySlip.baseSalary.toLocaleString()}</td>
                    </tr>
                    {activeSalarySlip.overtimeAmount > 0 && (
                      <tr>
                        <td className="p-2 text-emerald-700">Overtime Allowance</td>
                        <td className="p-2 text-right font-bold text-emerald-700">+{settings.currency} {activeSalarySlip.overtimeAmount.toLocaleString()}</td>
                      </tr>
                    )}
                    {activeSalarySlip.bonus > 0 && (
                      <tr>
                        <td className="p-2 text-emerald-700">Performance Bonus</td>
                        <td className="p-2 text-right font-bold text-emerald-700">+{settings.currency} {activeSalarySlip.bonus.toLocaleString()}</td>
                      </tr>
                    )}
                    {activeSalarySlip.deductions > 0 && (
                      <tr>
                        <td className="p-2 text-rose-600">Advance / Loan Deductions</td>
                        <td className="p-2 text-right font-bold text-rose-600">-{settings.currency} {activeSalarySlip.deductions.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-100 font-black text-slate-950">
                      <td className="p-2.5 text-sm">Net Disbursed Amount</td>
                      <td className="p-2.5 text-right text-sm font-black">{settings.currency} {activeSalarySlip.netSalary.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-300 text-[10px]">
                <div className="text-center">
                  <div className="h-6 border-b border-slate-400 w-24 mb-1" />
                  <span>Employee Signature</span>
                </div>
                <div className="text-center">
                  <div className="h-6 border-b border-slate-400 w-24 mb-1" />
                  <span>Authorized Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

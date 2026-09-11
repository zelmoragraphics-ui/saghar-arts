import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  SlidersHorizontal, 
  Layers, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaterialStock } from '../types';

export const InventoryView: React.FC = () => {
  const { 
    materials, 
    adjustStock, 
    addMaterial, 
    deleteMaterial, 
    settings, 
    t, 
    language, 
    user 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals
  const [selectedForAdjustment, setSelectedForAdjustment] = useState<MaterialStock | null>(null);
  const [adjustType, setAdjustType] = useState<'in' | 'out' | 'damage' | 'adjustment'>('in');
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMatName, setNewMatName] = useState('');
  const [newMatNameUrdu, setNewMatNameUrdu] = useState('');
  const [newMatCategory, setNewMatCategory] = useState('Flex');
  const [newMatUnit, setNewMatUnit] = useState('Rolls');
  const [newMatStock, setNewMatStock] = useState(10);
  const [newMatMinAlert, setNewMatMinAlert] = useState(3);
  const [newMatCost, setNewMatCost] = useState(5000);

  const categories = Array.from(new Set(materials.map(m => m.category)));

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.nameUrdu.includes(searchQuery);
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesLow = showLowStockOnly ? m.currentStock <= m.minStockAlert : true;
    return matchesSearch && matchesCat && matchesLow;
  });

  const lowStockCount = materials.filter(m => m.currentStock <= m.minStockAlert).length;
  const totalStockUnits = materials.reduce((acc, m) => acc + m.currentStock, 0);
  const totalWastedUnits = materials.reduce((acc, m) => acc + m.wastedDamaged, 0);

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForAdjustment || adjustQty <= 0) return;

    adjustStock({
      materialId: selectedForAdjustment.id,
      materialName: selectedForAdjustment.name,
      type: adjustType,
      quantity: adjustQty,
      previousStock: selectedForAdjustment.currentStock,
      newStock: adjustType === 'in' 
        ? selectedForAdjustment.currentStock + adjustQty 
        : adjustType === 'adjustment' 
          ? adjustQty 
          : Math.max(0, selectedForAdjustment.currentStock - adjustQty),
      reason: adjustReason || 'Manual inventory update'
    });

    setSelectedForAdjustment(null);
    setAdjustQty(1);
    setAdjustReason('');
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    addMaterial({
      name: newMatName,
      nameUrdu: newMatNameUrdu || newMatName,
      category: newMatCategory,
      unit: newMatUnit,
      currentStock: newMatStock,
      minStockAlert: newMatMinAlert,
      stockInTotal: newMatStock,
      stockOutTotal: 0,
      wastedDamaged: 0,
      costPerUnit: newMatCost
    });

    setShowAddMaterialModal(false);
    setNewMatName('');
    setNewMatNameUrdu('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('inventory')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'شیٹس، ایل ای ڈی، ایکرائلک، اسٹیکرز اور فلیکس کا لائیو اسٹاک' : 'Live stock tracking of acrylic, vinyl, LEDs, flex & fabrication materials'}
          </p>
        </div>

        <button
          onClick={() => setShowAddMaterialModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addMaterial')}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{t('totalStockItems')}</span>
          <div className="text-xl font-black text-white mt-1">
            {totalStockUnits.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{materials.length} tracked items</div>
        </div>

        <div className={`p-4 rounded-2xl border transition ${
          lowStockCount > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-xs font-bold text-slate-400 block">{t('lowStockAlerts')}</span>
          <div className={`text-xl font-black mt-1 ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {lowStockCount} {language === 'ur' ? 'آئٹمز' : 'Critical Items'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Requires replenishment</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-bold text-slate-400 block">{t('damagedStock')}</span>
          <div className="text-xl font-black text-rose-400 mt-1">
            {totalWastedUnits} <span className="text-xs text-slate-400 font-normal">units wasted</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Logged wastage & cuts</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 text-xs font-semibold text-white rounded-xl focus:outline-hidden"
          >
            <option value="all">{language === 'ur' ? 'تمام کیٹگریز' : 'All Categories'}</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showLowStockOnly
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'صرف کم اسٹاک' : 'Low Stock Only'} ({lowStockCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'ur' ? 'میٹریل یا کیٹگری تلاش کریں...' : 'Search material name or category...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Materials Table / Grid */}
      <div className="space-y-3">
        {filteredMaterials.map(mat => {
          const isLow = mat.currentStock <= mat.minStockAlert;
          return (
            <div
              key={mat.id}
              className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition ${
                isLow ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white">
                      {mat.name}
                    </span>
                    <span className="text-xs text-amber-400/90 font-medium">
                      ({mat.nameUrdu})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                      {mat.category}
                    </span>
                    {isLow && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        LOW STOCK
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>Unit: <strong className="text-slate-200">{mat.unit}</strong></span>
                    <span>•</span>
                    <span>Min Alert: <strong className="text-slate-200">{mat.minStockAlert} {mat.unit}</strong></span>
                    <span>•</span>
                    <span>Est. Unit Cost: <strong className="text-slate-200">{settings.currency} {mat.costPerUnit.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Last Updated: <span className="text-slate-300">{mat.lastUpdated}</span></span>
                  </div>
                </div>

                {/* Stock Stats */}
                <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-3 rounded-xl shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('currentStock')}</span>
                    <span className={`text-base font-black ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {mat.currentStock} <span className="text-xs font-normal text-slate-400">{mat.unit}</span>
                    </span>
                  </div>
                  <div className="h-7 w-px bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('stockIn')}</span>
                    <span className="text-xs font-bold text-slate-200">
                      +{mat.stockInTotal}
                    </span>
                  </div>
                  <div className="h-7 w-px bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('stockOut')}</span>
                    <span className="text-xs font-bold text-slate-200">
                      -{mat.stockOutTotal}
                    </span>
                  </div>
                  {mat.wastedDamaged > 0 && (
                    <>
                      <div className="h-7 w-px bg-slate-800" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Wasted</span>
                        <span className="text-xs font-bold text-rose-400">
                          {mat.wastedDamaged}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedForAdjustment(mat);
                      setAdjustQty(1);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('adjustStock')}</span>
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm(t('confirmDelete'))) {
                          deleteMaterial(mat.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition cursor-pointer"
                      title="Delete material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Adjustment Modal */}
      {selectedForAdjustment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-1">
              {t('adjustStock')}: {selectedForAdjustment.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Current Available: <strong className="text-amber-400">{selectedForAdjustment.currentStock} {selectedForAdjustment.unit}</strong>
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('in')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      adjustType === 'in' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    + Stock In (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('out')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      adjustType === 'out' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    - Stock Out (Used)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('damage')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      adjustType === 'damage' ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Waste / Damaged
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjustment')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      adjustType === 'adjustment' ? 'bg-sky-500/20 border-sky-500 text-sky-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Direct Override
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quantity ({selectedForAdjustment.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={e => setAdjustQty(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. Cut wastage on CNC router or physical stock count"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedForAdjustment(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-4">
              {t('addMaterial')}
            </h3>

            <form onSubmit={handleCreateMaterial} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Material Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gold Acrylic Mirror Sheet (8x4)"
                  value={newMatName}
                  onChange={e => setNewMatName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Material Name (Urdu)</label>
                <input
                  type="text"
                  placeholder="مثلاً گولڈ مرر ایکرائلک شیٹ"
                  value={newMatNameUrdu}
                  onChange={e => setNewMatNameUrdu(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acrylic"
                    value={newMatCategory}
                    onChange={e => setNewMatCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="Sheets, Rolls, Pcs"
                    value={newMatUnit}
                    onChange={e => setNewMatUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newMatStock}
                    onChange={e => setNewMatStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Min Alert</label>
                  <input
                    type="number"
                    min="1"
                    value={newMatMinAlert}
                    onChange={e => setNewMatMinAlert(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cost / Unit ({settings.currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={newMatCost}
                    onChange={e => setNewMatCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

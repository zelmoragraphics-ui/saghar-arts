import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Layers, Check, X, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCategory } from '../types';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, t, language, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [description, setDescription] = useState('');
  const [productItemsText, setProductItemsText] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameUrdu.includes(searchQuery) ||
    (c.products || []).some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setName('');
    setNameUrdu('');
    setDescription('');
    setProductItemsText('');
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameUrdu(cat.nameUrdu);
    setDescription(cat.description || '');
    setProductItemsText((cat.products || []).join(', '));
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const products = productItemsText
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        nameUrdu: nameUrdu || name,
        description,
        products
      });
    } else {
      addCategory({
        name,
        nameUrdu: nameUrdu || name,
        description,
        products
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            {t('categories')} ({categories.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' ? 'تمام 26+ مصنوعات، سائن بورڈ، 3D، نیون اور ایڈورٹائزنگ کیٹگریز' : 'All 26+ signboard, 3D, neon, flex, lamination & plate categories'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addCategory')}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <Search className="w-4 h-4 text-slate-500 absolute left-6 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={language === 'ur' ? 'کیٹگری یا مصنوع تلاش کریں...' : 'Search category name or sub-product...'}
          className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
        />
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map(cat => (
          <div
            key={cat.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold text-amber-400/90">
                    {cat.nameUrdu}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm(t('confirmDelete'))) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {cat.description && (
                <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                  {cat.description}
                </p>
              )}

              {/* Sub-products tags */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(cat.products || []).map((prod, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-medium"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{cat.products.length} standard items</span>
              <span className="text-amber-400/70 font-mono">SAGHAR ARTS</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-base font-black text-white mb-4">
              {editingCategory ? (language === 'ur' ? 'کیٹگری میں ترمیم کریں' : 'Edit Category') : t('addCategory')}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acrylic LED Board"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Category Name (Urdu)</label>
                <input
                  type="text"
                  placeholder="مثلاً ایکرائلک ایل ای ڈی بورڈ"
                  value={nameUrdu}
                  onChange={e => setNameUrdu(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief service description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Sub-Products (Comma separated)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Front Light, Backlit, 3D Letters, Golden Frame"
                  value={productItemsText}
                  onChange={e => setProductItemsText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

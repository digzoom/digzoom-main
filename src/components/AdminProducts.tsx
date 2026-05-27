import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit3, X, Star, Package, Check } from 'lucide-react';
import type { Product } from '@/types';

const CATEGORIES = [
  { id: 'graphics', nameAr: 'جرافيكس', nameEn: 'Graphics' },
  { id: 'videos', nameAr: 'فيديو', nameEn: 'Videos' },
  { id: 'audio', nameAr: 'صوت', nameEn: 'Audio' },
  { id: 'pdf', nameAr: 'PDF', nameEn: 'PDF' },
  { id: 'courses', nameAr: 'كورسات', nameEn: 'Courses' },
  { id: 'plr', nameAr: 'PLR', nameEn: 'PLR' },
  { id: 'templates', nameAr: 'قوالب', nameEn: 'Templates' },
  { id: 'ebooks', nameAr: 'كتب', nameEn: 'E-Books' },
  { id: 'fonts', nameAr: 'خطوط', nameEn: 'Fonts' },
  { id: 'scripts', nameAr: 'سكربتات', nameEn: 'Scripts' },
];

const emptyProduct: Omit<Product, 'id'> = {
  title: '',
  description: '',
  longDescription: '',
  price: 0,
  originalPrice: 0,
  image: '/images/placeholder.jpg',
  category: 'graphics',
  rating: 4.5,
  reviews: 0,
  features: [],
  fileType: 'ZIP',
  fileSize: '10 MB',
  inStock: true,
};

interface AdminProductsProps {
  isAr: boolean;
  adminProducts: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (productId: number, updates: Partial<Product>) => void;
  deleteProduct: (productId: number) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function AdminProducts({ isAr, adminProducts, addProduct, updateProduct, deleteProduct, showToast }: AdminProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  const [form, setForm] = useState<Omit<Product, 'id'>>({ ...emptyProduct });

  const filtered = useMemo(() => {
    return adminProducts.filter(p => {
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [adminProducts, searchQuery, categoryFilter]);

  const resetForm = () => {
    setForm({ ...emptyProduct });
    setFeatureInput('');
    setEditingProduct(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      features: [...product.features],
      fileType: product.fileType,
      fileSize: product.fileSize,
      inStock: product.inStock,
    });
    setFeatureInput('');
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title || !form.description || form.price <= 0) {
      showToast(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields', 'error');
      return;
    }
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...form });
      showToast(isAr ? 'تم تحديث المنتج!' : 'Product updated!');
    } else {
      addProduct({ ...form });
      showToast(isAr ? 'تم إضافة المنتج!' : 'Product added!');
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setConfirmDelete(null);
    showToast(isAr ? 'تم حذف المنتج!' : 'Product deleted!');
  };

  const addFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold text-lg">{isAr ? 'إدارة المنتجات' : 'Product Management'}</h3>
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full font-bold">{adminProducts.length}</span>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> {isAr ? 'إضافة منتج' : 'Add Product'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم أو الوصف...' : 'Search by name or description...'}
            className="w-full bg-[#151520] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="bg-[#151520] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm">
          <option value="">{isAr ? 'كل التصنيفات' : 'All Categories'}</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="bg-[#151520] rounded-2xl border border-white/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">{isAr ? 'لا توجد منتجات' : 'No products found'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 text-sm">
                  <th className="text-right px-4 py-3">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="text-right px-4 py-3">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="text-right px-4 py-3">{isAr ? 'السعر' : 'Price'}</th>
                  <th className="text-right px-4 py-3">{isAr ? 'التقييم' : 'Rating'}</th>
                  <th className="text-right px-4 py-3">{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-800" onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }} />
                        <div>
                          <p className="text-white text-sm font-medium">{product.title}</p>
                          <p className="text-gray-500 text-xs truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-lg">
                        {CATEGORIES.find(c => c.id === product.category)?.nameAr || product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-400 font-bold text-sm">{product.price} {isAr ? 'ر.س' : 'SAR'}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-500 text-xs line-through mr-2">{product.originalPrice}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-gray-500 text-xs">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" title={isAr ? 'تعديل' : 'Edit'}>
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(product.id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30" title={isAr ? 'حذف' : 'Delete'}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#151520] rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editingProduct ? (isAr ? 'تعديل منتج' : 'Edit Product') : (isAr ? 'إضافة منتج جديد' : 'Add New Product')}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">{isAr ? 'اسم المنتج *' : 'Product Name *'}</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>

              {/* Description */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">{isAr ? 'وصف قصير *' : 'Short Description *'}</label>
                <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>

              {/* Long Description */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">{isAr ? 'وصف طويل' : 'Long Description'}</label>
                <textarea value={form.longDescription} onChange={e => setForm(p => ({ ...p, longDescription: e.target.value }))} rows={3}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none" />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">{isAr ? 'السعر *' : 'Price *'}</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">{isAr ? 'السعر الأصلي' : 'Original Price'}</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: Number(e.target.value) }))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>

              {/* Category + File Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">{isAr ? 'التصنيف' : 'Category'}</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm">
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">{isAr ? 'نوع الملف' : 'File Type'}</label>
                  <input type="text" value={form.fileType} onChange={e => setForm(p => ({ ...p, fileType: e.target.value }))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">{isAr ? 'رابط الصورة' : 'Image URL'}</label>
                <div className="flex gap-2">
                  <input type="text" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                  <div className="w-12 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                    <img src={form.image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">{isAr ? 'المميزات' : 'Features'}</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder={isAr ? 'أضف ميزة...' : 'Add feature...'}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50" />
                  <button onClick={addFeature} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-lg">
                      {f}
                      <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* File Size + In Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">{isAr ? 'حجم الملف' : 'File Size'}</label>
                  <input type="text" value={form.fileSize} onChange={e => setForm(p => ({ ...p, fileSize: e.target.value }))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
                <div className="flex items-center gap-3 pt-7">
                  <input type="checkbox" id="instock" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/20 bg-black/30 text-blue-600" />
                  <label htmlFor="instock" className="text-gray-300 text-sm">{isAr ? 'متاح في المخزون' : 'In Stock'}</label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium transition-all">
                <Check className="w-4 h-4" /> {editingProduct ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة المنتج' : 'Add Product')}
              </button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-xl text-sm">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-[#151520] rounded-2xl border border-white/10 p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{isAr ? 'تأكيد الحذف' : 'Confirm Delete'}</h3>
              <p className="text-gray-400 text-sm mb-6">{isAr ? 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this product? This action cannot be undone.'}</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-medium">
                  {isAr ? 'حذف' : 'Delete'}
                </button>
                <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2.5 rounded-xl text-sm">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

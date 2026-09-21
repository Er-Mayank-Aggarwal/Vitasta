'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  ChevronDown,
  Sparkles,
  Package,
  Eye,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/product-actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminProductsClient({ initialProducts = [], categories = [] }) {
  const router = useRouter();
  const [productList, setProductList] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const emptyForm = {
    title: '',
    price: '',
    description: '',
    categoryId: categories.length > 0 ? categories[0].id : 'Riwaayat-e-Chiffon',
    fabric: 'Pure Chiffon',
    work: 'Intricate Adda Handwork & Gota Patti',
    color: 'Royal Rose',
    blouseFabric: 'Unstitched Pure Silk (Included)',
    blouseLength: '1 Metre',
    sareeLength: '5.5 Metres',
    materialCare: 'Dry Clean Only',
    stockStatus: 'MADE_TO_ORDER',
    isActive: true,
    isFeatured: true,
    primaryImage: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  // Filter products
  const filteredProducts = productList.filter((p) => {
    const title = p.title || p.name || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || product.name || '',
      price: product.price || '',
      description: product.description || '',
      categoryId: product.categoryId || (categories[0]?.id || 'Riwaayat-e-Chiffon'),
      fabric: product.fabric || 'Pure Chiffon',
      work: product.work || 'Intricate Adda Handwork',
      color: product.color || 'Royal Rose',
      blouseFabric: product.blouseFabric || 'Unstitched Pure Silk',
      blouseLength: product.blouseLength || '1 Metre',
      sareeLength: product.sareeLength || '5.5 Metres',
      materialCare: product.materialCare || 'Dry Clean Only',
      stockStatus: product.stockStatus || 'MADE_TO_ORDER',
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.isFeatured !== undefined ? product.isFeatured : true,
      primaryImage: product.primaryImage || product.image || '',
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.price) {
      setError('Please provide title and price');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title: formData.title,
      name: formData.title,
      description: formData.description || formData.title,
      price: Number(formData.price),
      categoryId: formData.categoryId,
      fabric: formData.fabric,
      work: formData.work,
      color: formData.color,
      blouseFabric: formData.blouseFabric,
      blouseLength: formData.blouseLength,
      sareeLength: formData.sareeLength,
      materialCare: formData.materialCare,
      stockStatus: formData.stockStatus,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      primaryImage: formData.primaryImage || 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg',
      imageUrls: [formData.primaryImage].filter(Boolean),
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, payload);
    } else {
      result = await createProduct(payload);
    }

    if (result.success) {
      if (result.product || result.data) {
        const item = result.product || result.data;
        if (editingProduct) {
          setProductList((prev) => prev.map((p) => (p.id === item.id ? { ...p, ...item } : p)));
        } else {
          setProductList((prev) => [item, ...prev]);
        }
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData(emptyForm);
      router.refresh();
    } else {
      setError(result.error || 'Failed to save product');
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    const res = await deleteProduct(id);
    if (res.success) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
      setShowDeleteConfirm(null);
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Jodhpur Heritage Catalog
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Sarees & Handloom Products
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage catalog, pricing, fabric details, and high-resolution CDN images
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Royal Saree
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by saree title, fabric, or color..."
            className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0B3B60] shadow-sm"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 font-medium focus:outline-none focus:border-[#0B3B60] shadow-sm"
        >
          <option value="all">All Royal Collections ({productList.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid / Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-neutral-200 uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Saree & Craft</th>
                <th className="p-4">Collection</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-400 font-medium">
                    No sarees match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const title = product.title || product.name;
                  const img = product.primaryImage || product.image || 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg';
                  return (
                    <tr key={product.id} className="hover:bg-neutral-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg bg-neutral-100 overflow-hidden relative shrink-0 border border-neutral-200">
                            <img
                              src={img}
                              alt={title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-neutral-900 line-clamp-1">{title}</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              {product.fabric || 'Pure Fabric'} • {product.work || 'Handwork'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0B3B60] border border-blue-200 text-[10px] font-semibold">
                          {product.category?.name || product.categoryId}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap font-serif font-bold text-neutral-900 text-sm">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {product.stockStatus || 'MADE_TO_ORDER'}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {product.isFeatured ? (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            ★ Featured
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">Standard</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#0B3B60] text-neutral-600 hover:text-white transition inline-flex items-center"
                          title="Edit Saree Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(product.id)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-600 text-neutral-600 hover:text-white transition inline-flex items-center"
                          title="Delete Saree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Saree Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0B3B60]">
                  {editingProduct ? 'Edit Royal Saree' : 'Add New Handcrafted Saree'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Update fabric specifications, Adda embroidery, pricing, and image URL
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-700 font-semibold">Saree Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Rose Pure Chiffon Saree with Intricate Adda Handwork"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="18500"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Collection / Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Fabric</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="Pure Chiffon"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Color / Shade</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Sunset Ombré"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Handwork / Embroidery</label>
                  <input
                    type="text"
                    value={formData.work}
                    onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                    placeholder="Aari & Gota Patti"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-700 font-semibold">Primary Image (Cloudinary CDN URL)</label>
                <input
                  type="text"
                  value={formData.primaryImage}
                  onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                  placeholder="https://res.cloudinary.com/sjl1rfvu/image/upload/..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-700 font-semibold">Description & Draping Notes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the royal drape, adda handwork hours, and heritage inspiration..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#0B3B60]"
                  />
                  <span>Show in Featured Spotlight</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-neutral-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#0B3B60]"
                  />
                  <span>Active in Catalog</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Saree' : 'Publish Saree'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">Delete Saree?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                This action will remove the saree from the active catalog.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-xl bg-[#C1272D] hover:bg-[#A01B20] text-white font-bold text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

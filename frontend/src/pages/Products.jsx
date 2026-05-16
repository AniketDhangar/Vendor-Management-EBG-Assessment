import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct } from '../redux/slices/productSlice';
import { vendorService } from '../services/vendorService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import Pagination from '../components/Pagination';

export default function Products() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, total, page, limit, loading, error } = useSelector((s) => s.products);
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', vendor: '', stock: '0', isPublished: false
  });
  const [image, setImage] = useState(null);

  const load = (p = page) => {
    dispatch(fetchProducts({ page: p, limit, search: search || undefined }));
  };

  useEffect(() => {
    load(1);
    if (user?.role === 'admin') {
      vendorService.list({ limit: 100 }).then(({ data }) => setVendors(data.data.items));
    }
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'vendor' && user?.role !== 'admin') return;
      fd.append(k, v);
    });
    if (image) fd.append('image', image);
    await dispatch(createProduct(fd));
    setShowForm(false);
    load(1);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button type="button" onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>
      <ErrorAlert message={error} />
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2">
          <input required placeholder="Title" className="rounded border px-3 py-2 text-sm" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required type="number" step="0.01" placeholder="Price" className="rounded border px-3 py-2 text-sm"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          {user?.role === 'admin' && (
            <select required className="rounded border px-3 py-2 text-sm" value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}>
              <option value="">Select vendor</option>
              {vendors.map((v) => <option key={v._id} value={v._id}>{v.name}</option>)}
            </select>
          )}
          <input type="number" placeholder="Stock" className="rounded border px-3 py-2 text-sm" value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <textarea placeholder="Description" className="rounded border px-3 py-2 text-sm sm:col-span-2"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="file" accept="image/*" className="text-sm sm:col-span-2" onChange={(e) => setImage(e.target.files[0])} />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white sm:col-span-2">Save</button>
        </form>
      )}
      <div className="mb-4 flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm" />
        <button type="button" onClick={() => load(1)} className="rounded-lg border px-4 py-2 text-sm hover:bg-white">Search</button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.vendor?.name || '—'}</td>
                  <td className="px-4 py-3">{p.isPublished ? 'Published' : 'Draft'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} total={total} limit={limit} onPageChange={load} />
    </div>
  );
}

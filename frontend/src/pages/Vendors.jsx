import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors, createVendor } from '../redux/slices/vendorSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import Pagination from '../components/Pagination';

export default function Vendors() {
  const dispatch = useDispatch();
  const { items, total, page, limit, loading, error } = useSelector((s) => s.vendors);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [showForm, setShowForm] = useState(false);

  const load = (p = page) => {
    dispatch(fetchVendors({ page: p, limit, search: search || undefined }));
  };

  useEffect(() => { load(1); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createVendor(form));
    setForm({ name: '', email: '', phone: '', address: '' });
    setShowForm(false);
    load(1);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Vendors</h2>
        <button type="button" onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          {showForm ? 'Cancel' : 'Add Vendor'}
        </button>
      </div>
      <ErrorAlert message={error} />
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2">
          <input required placeholder="Name" className="rounded border px-3 py-2 text-sm" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" className="rounded border px-3 py-2 text-sm" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" className="rounded border px-3 py-2 text-sm" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Address" className="rounded border px-3 py-2 text-sm" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white sm:col-span-2">Save</button>
        </form>
      )}
      <div className="mb-4 flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm" />
        <button type="button" onClick={() => load(1)} className="rounded-lg border px-4 py-2 text-sm hover:bg-white">Search</button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{v.name}</td>
                  <td className="px-4 py-3">{v.email}</td>
                  <td className="px-4 py-3">{v.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${v.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {v.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
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

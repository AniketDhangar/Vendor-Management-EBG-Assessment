import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../redux/slices/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import Pagination from '../components/Pagination';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const dispatch = useDispatch();
  const { items, total, page, limit, loading, error } = useSelector((s) => s.orders);
  const [statusFilter, setStatusFilter] = useState('');

  const load = (p = page) => {
    dispatch(fetchOrders({
      page: p,
      limit,
      ...(statusFilter && { status: statusFilter })
    }));
  };

  useEffect(() => { load(1); }, [statusFilter]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Orders</h2>
      <ErrorAlert message={error} />
      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{o._id.slice(-8)}</td>
                  <td className="px-4 py-3">{o.vendor?.name || '—'}</td>
                  <td className="px-4 py-3">${o.total}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="rounded border px-2 py-1 text-xs capitalize">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString()}</td>
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

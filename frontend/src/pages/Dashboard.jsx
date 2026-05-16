import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { fetchTotals, fetchMonthly } from '../redux/slices/analyticsSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { totals, monthly, loading, error } = useSelector((s) => s.analytics);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchTotals());
      dispatch(fetchMonthly(6));
    }
  }, [dispatch, isAdmin]);

  if (!isAdmin) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h2>
        <p className="mt-2 text-slate-600">Use the sidebar to manage your products and orders.</p>
      </div>
    );
  }

  if (loading && !totals) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h2>
      <ErrorAlert message={error} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Vendors" value={totals?.totalVendors ?? 0} accent="brand" />
        <StatCard title="Total Products" value={totals?.totalProducts ?? 0} accent="emerald" />
        <StatCard title="Total Orders" value={totals?.totalOrders ?? 0} accent="amber" />
        <StatCard title="Revenue" value={`$${(totals?.revenue ?? 0).toLocaleString()}`} accent="rose" />
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Monthly Revenue</h3>
        <RevenueChart data={monthly} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import ErrorAlert from '../components/ErrorAlert';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    vendorRef: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.role !== 'vendor') delete payload.vendorRef;
    else if (!payload.vendorRef) delete payload.vendorRef;
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) navigate('/login');
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold">Create account</h1>
        <ErrorAlert message={error} />
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input placeholder="Full name" required className={inputClass} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required className={inputClass} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password (min 8)" required minLength={8} className={inputClass}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className={inputClass} value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
          </select>
          {form.role === 'vendor' && (
            <input placeholder="Vendor ID (24-char hex)" className={inputClass} value={form.vendorRef}
              onChange={(e) => setForm({ ...form, vendorRef: e.target.value })} />
          )}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Have an account? <Link to="/login" className="text-brand-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' }
];

const vendorLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' }
];

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const links = user?.role === 'admin' ? adminLinks : vendorLinks;

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-lg font-bold text-brand-700">MultiVendor</h1>
        <p className="text-xs text-slate-500 capitalize">{user?.role} panel</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

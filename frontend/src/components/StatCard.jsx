export default function StatCard({ title, value, accent = 'brand' }) {
  const accents = {
    brand: 'border-brand-200 bg-brand-50 text-brand-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    rose: 'border-rose-200 bg-rose-50 text-rose-700'
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${accents[accent] || accents.brand}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

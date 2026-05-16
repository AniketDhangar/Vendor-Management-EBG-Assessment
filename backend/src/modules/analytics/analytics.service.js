const repo = require('./analytics.repository');

const totals = async () => {
  const [totalVendors, totalProducts, totalOrders, revenueAgg] = await Promise.all([
    repo.countVendors(),
    repo.countProducts(),
    repo.countOrders(),
    repo.aggregateRevenue()
  ]);
  const revenue = revenueAgg[0]?.revenue || 0;
  return { totalVendors, totalProducts, totalOrders, revenue };
};

const monthlyRevenue = async (months = 6) => {
  const from = new Date();
  from.setDate(1);
  from.setHours(0, 0, 0, 0);
  from.setMonth(from.getMonth() - (months - 1));

  const agg = await repo.aggregateMonthlyRevenue(from);
  return agg.map((x) => ({
    year: x._id.year,
    month: x._id.month,
    label: `${x._id.year}-${String(x._id.month).padStart(2, '0')}`,
    total: x.total
  }));
};

module.exports = { totals, monthlyRevenue };

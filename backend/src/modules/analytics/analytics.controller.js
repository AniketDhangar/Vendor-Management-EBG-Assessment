const service = require('./analytics.service');
const { asyncHandler } = require('../../common/middlewares/asyncHandler');

const totals = asyncHandler(async (req, res) => {
  const stats = await service.totals();
  res.json({ data: stats });
});

const monthly = asyncHandler(async (req, res) => {
  const months = Math.min(24, Math.max(1, parseInt(req.query.months, 10) || 6));
  const data = await service.monthlyRevenue(months);
  res.json({ data });
});

module.exports = { totals, monthly };

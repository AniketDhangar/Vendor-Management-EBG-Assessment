const Vendor = require('../vendor/vendor.model');
const Product = require('../product/product.model');
const Order = require('../order/order.model');

const countVendors = () => Vendor.countDocuments({});
const countProducts = () => Product.countDocuments({});
const countOrders = () => Order.countDocuments({});

const aggregateRevenue = () =>
  Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]);

const aggregateMonthlyRevenue = (fromDate) =>
  Order.aggregate([
    { $match: { createdAt: { $gte: fromDate }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$total' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

module.exports = { countVendors, countProducts, countOrders, aggregateRevenue, aggregateMonthlyRevenue };

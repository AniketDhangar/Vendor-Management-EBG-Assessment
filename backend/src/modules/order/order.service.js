const repo = require('./order.repository');
const productRepo = require('../product/product.repository');
const { buildQuery } = require('../../common/utils/searchFilter');
const { buildPagination } = require('../../common/utils/pagination');
const { ApiError } = require('../../common/middlewares/error.middleware');

const applyVendorScope = (q, user) => {
  if (user?.role === 'vendor' && user.vendorRef) {
    q.vendor = user.vendorRef;
  }
  return q;
};

const applyUserScope = (q, user) => {
  if (user?.role === 'user') {
    q.user = user._id;
  }
  return q;
};

const list = async (queryParams, user) => {
  let q = buildQuery(queryParams, []);
  q = applyVendorScope(q, user);
  const { skip, limit, sort, page } = buildPagination(queryParams);
  const [items, total] = await Promise.all([
    repo.findWithQuery(q, { skip, limit, sort }),
    repo.count(q)
  ]);
  return { items, total, page, limit };
};

const create = async (payload, user) => {
  if (user?.role === 'vendor') {
    if (!user.vendorRef) throw new ApiError(403, 'Vendor account not linked');
    payload.vendor = user.vendorRef;
  }

  for (const it of payload.items) {
    const prod = await productRepo.findById(it.product);
    if (!prod) throw new ApiError(400, `Product not found: ${it.product}`);
    if (String(prod.vendor._id || prod.vendor) !== String(payload.vendor)) {
      throw new ApiError(400, 'Product does not belong to this vendor');
    }
    if (prod.stock < it.qty) throw new ApiError(400, `Insufficient stock for ${prod.title}`);
    it.price = it.price ?? prod.price;
  }

  const subtotal = payload.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  payload.subtotal = payload.subtotal ?? subtotal;
  payload.total = payload.total ?? payload.subtotal;

  for (const it of payload.items) {
    const prod = await productRepo.findById(it.product);
    await productRepo.update(prod._id, { stock: prod.stock - it.qty });
  }

  return repo.create(payload);
};

// Create user order - groups items by vendor and creates separate orders
const createUserOrder = async (payload, user) => {
  const userId = user?.id || user?._id;
  if (!userId) throw new ApiError(401, 'User authentication required');

  // For vendors creating orders, don't set user field; for users, set their ID
  const userIdForOrder = user.role === 'vendor' ? null : userId;
  
  // Fetch all products and validate
  const products = {};
  const vendorProducts = {};

  for (const item of payload.items) {
    const prod = await productRepo.findById(item.product);
    if (!prod) throw new ApiError(400, `Product not found: ${item.product}`);
    if (prod.stock < item.qty) {
      throw new ApiError(400, `Insufficient stock for ${prod.title}. Available: ${prod.stock}, Requested: ${item.qty}`);
    }
    
    products[item.product] = prod;
    const vendorId = String(prod.vendor._id || prod.vendor);
    
    if (!vendorProducts[vendorId]) {
      vendorProducts[vendorId] = [];
    }
    vendorProducts[vendorId].push({ ...item, productData: prod });
  }

  // Create orders grouped by vendor
  const createdOrders = [];
  
  for (const [vendorId, items] of Object.entries(vendorProducts)) {
    const subtotal = items.reduce((sum, it) => sum + (it.productData?.price || it.price) * it.qty, 0);
    const total = subtotal; // Can add tax/shipping fees here if needed

    const orderPayload = {
      vendor: vendorId,
      user: userIdForOrder,
      items: items.map(it => ({
        product: it.product,
        qty: it.qty,
        price: it.productData?.price || it.price
      })),
      subtotal,
      total,
      shipping: {
        address: payload.shippingAddress,
        method: payload.shippingMethod || 'standard'
      },
      status: 'pending'
    };

    const order = await repo.create(orderPayload);
    createdOrders.push(order);

    // Reduce stock for each product
    for (const item of items) {
      const prod = products[item.product];
      await productRepo.update(prod._id, { stock: prod.stock - item.qty });
    }
  }

  return createdOrders;
};

const getUserOrders = async (queryParams, user) => {
  const userId = user?.id || user?._id;
  if (!userId) throw new ApiError(401, 'User authentication required');
  
  let q = buildQuery(queryParams, []);
  
  // For vendors, filter by their vendorRef; for users, filter by their ID
  if (user.role === 'vendor') {
    q.vendor = user.vendorRef;
  } else {
    q.user = userId;
  }
  
  const { skip, limit, sort, page } = buildPagination(queryParams);
  const [items, total] = await Promise.all([
    repo.findWithQuery(q, { skip, limit, sort }),
    repo.count(q)
  ]);
  
  return { items, total, page, limit };
};

const get = async (id, user) => {
  const o = await repo.findById(id);
  if (!o) throw new ApiError(404, 'Order not found');
  
  const userId = user?.id || user?._id;
  
  // Check access permissions
  if (user?.role === 'vendor' && String(o.vendor._id || o.vendor) !== user.vendorRef) {
    throw new ApiError(403, 'You can only view your vendor orders');
  }
  if (user?.role === 'user' && String(o.user._id || o.user) !== userId) {
    throw new ApiError(403, 'You can only view your own orders');
  }
  
  return o;
};

const updateStatus = async (id, status, user) => {
  const order = await get(id, user);
  
  // Vendors can only update to shipped/delivered
  if (user?.role === 'vendor' && !['processing', 'shipped', 'delivered'].includes(status)) {
    throw new ApiError(400, 'Vendors can only update to processing, shipped, or delivered');
  }
  
  const o = await repo.update(id, { status });
  if (!o) throw new ApiError(404, 'Order not found');
  return o;
};

const remove = async (id, user) => {
  const o = await get(id, user);
  if (o.status !== 'cancelled' && o.status !== 'pending') {
    throw new ApiError(400, 'Only pending or cancelled orders can be deleted');
  }
  const deleted = await repo.deleteById(id);
  if (!deleted) throw new ApiError(404, 'Order not found');
  return deleted;
};

module.exports = { list, create, get, updateStatus, remove, createUserOrder, getUserOrders };

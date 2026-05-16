const mongoose = require('mongoose');
const { sanitize } = require('./sanitize');

const RESERVED = new Set(['page', 'limit', 'sortBy', 'order', 'search', 'months']);

const buildQuery = (queryParams = {}, searchableFields = []) => {
  const q = {};
  const params = sanitize({ ...queryParams });

  if (params.search && searchableFields.length) {
    const regex = new RegExp(String(params.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    q.$or = searchableFields.map((f) => ({ [f]: regex }));
  }

  Object.keys(params).forEach((k) => {
    if (RESERVED.has(k)) return;
    let val = params[k];
    if (val === 'true') val = true;
    if (val === 'false') val = false;
    if (typeof val === 'string' && mongoose.Types.ObjectId.isValid(val) && String(val).length === 24) {
      val = new mongoose.Types.ObjectId(val);
    }
    q[k] = val;
  });

  return q;
};

module.exports = { buildQuery };

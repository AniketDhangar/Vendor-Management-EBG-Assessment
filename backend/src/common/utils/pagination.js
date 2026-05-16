const buildPagination = ({ page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = {}) => {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNumber - 1) * pageSize;
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
  return { page: pageNumber, limit: pageSize, skip, sort };
};

module.exports = { buildPagination };

/** Strip MongoDB operator keys from user input (NoSQL injection mitigation). */
const sanitize = (value) => {
  if (value == null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(sanitize);
  const clean = {};
  for (const [key, val] of Object.entries(value)) {
    if (key.startsWith('$') || key.includes('.')) continue;
    clean[key] = sanitize(val);
  }
  return clean;
};

module.exports = { sanitize };

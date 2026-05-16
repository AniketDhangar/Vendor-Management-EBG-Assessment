import api from './api';

export const orderService = {
  list: (params) => api.get('/orders', { params }),
  get: (id) => api.get(`/orders/${id}`),
  create: (payload) => api.post('/orders', payload),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  remove: (id) => api.delete(`/orders/${id}`)
};

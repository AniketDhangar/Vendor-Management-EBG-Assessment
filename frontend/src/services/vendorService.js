import api from './api';

export const vendorService = {
  list: (params) => api.get('/vendors', { params }),
  get: (id) => api.get(`/vendors/${id}`),
  create: (payload) => api.post('/vendors', payload),
  update: (id, payload) => api.patch(`/vendors/${id}`, payload),
  remove: (id) => api.delete(`/vendors/${id}`)
};

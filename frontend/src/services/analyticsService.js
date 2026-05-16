import api from './api';

export const analyticsService = {
  totals: () => api.get('/analytics/totals'),
  monthly: (months = 6) => api.get('/analytics/monthly', { params: { months } })
};

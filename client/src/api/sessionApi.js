import api from './axios';

export const sessionApi = {
  getMarketplaceSessions: async (params = {}) => {
    const response = await api.get('/sessions', { params });
    return response.data;
  },

  getMySessions: async () => {
    const response = await api.get('/sessions/my');
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  updateSession: async (id, sessionData) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  deleteSession: async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },
};

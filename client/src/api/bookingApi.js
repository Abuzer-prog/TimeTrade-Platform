import api from './axios';

export const bookingApi = {
  requestSlot: async ({ sessionId, message }) => {
    const response = await api.post('/bookings', { sessionId, message });
    return response.data;
  },

  getIncomingRequests: async () => {
    const response = await api.get('/bookings/incoming');
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  updateRequestStatus: async (bookingId, status) => {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  },

  cancelRequest: async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};

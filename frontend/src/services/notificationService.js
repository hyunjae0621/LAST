// frontend/src/services/notificationService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const notificationService = {
  async getNotifications(params) {
    const response = await axios.get(`${API_URL}/notifications/`, { params });
    return response.data;
  },

  async markAsRead(id) {
    const response = await axios.post(`${API_URL}/notifications/${id}/read/`);
    return response.data;
  },

  async updateSettings(settings) {
    const response = await axios.patch(`${API_URL}/notifications/settings/`, settings);
    return response.data;
  },

  async getSettings() {
    const response = await axios.get(`${API_URL}/notifications/settings/`);
    return response.data;
  },

};
// frontend/src/services/dashboardService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const dashboardService = {
  async getStats() {
    const response = await axios.get(`${API_URL}/dashboard/stats/`);
    return response.data;
  },

  async getTodayClasses() {
    const response = await axios.get(`${API_URL}/dashboard/today-classes/`);
    return response.data;
  }
};
// frontend/src/services/studentAnalyticsService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/analytics';

export const studentAnalyticsService = {
  async getEnrollmentTrends(startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await axios.get(`${API_URL}/enrollment-trends/`, { params });
    return response.data;
  },

  async getRetentionAnalysis(months = 6) {
    const response = await axios.get(`${API_URL}/retention/`, {
      params: { months }
    });
    return response.data;
  },

  async getClassPreferences() {
    const response = await axios.get(`${API_URL}/class-preferences/`);
    return response.data;
  },

  async getStudentBehavior(studentId) {
    const response = await axios.get(`${API_URL}/student-behavior/${studentId}/`);
    return response.data;
  }
};
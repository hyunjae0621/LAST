// frontend/src/services/revenueStatsService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/revenue/stats';

export const revenueStatsService = {
  async getRevenueSummary(startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await axios.get(`${API_URL}/summary/`, { params });
    return response.data;
  },

  async getMonthlyRevenue(year, month) {
    const params = { year, month };
    const response = await axios.get(`${API_URL}/monthly/`, { params });
    return response.data;
  },

  async getClassRevenue(classId, startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await axios.get(`${API_URL}/class/${classId}/`, { params });
    return response.data;
  },

  async getInstructorRevenue(instructorId, startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await axios.get(`${API_URL}/instructor/${instructorId}/`, { params });
    return response.data;
  }
};
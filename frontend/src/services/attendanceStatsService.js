// frontend/src/services/attendanceStatsService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/attendance/stats';

export const attendanceStatsService = {
  async getStudentStats(studentId, startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await axios.get(`${API_URL}/student/${studentId}/`, { params });
    return response.data;
  },

  async getClassStats(classId, startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await axios.get(`${API_URL}/class/${classId}/`, { params });
    return response.data;
  },

  async getInstructorStats(instructorId, startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await axios.get(`${API_URL}/instructor/${instructorId}/`, { params });
    return response.data;
  }
};
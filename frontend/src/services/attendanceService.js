// frontend/src/services/attendanceService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const attendanceService = {
  // 출석 관리
  async getAttendanceList(params) {
    const response = await axios.get(`${API_URL}/attendance/`, { params });
    return response.data;
  },

  async createAttendance(data) {
    const response = await axios.post(`${API_URL}/attendance/`, data);
    return response.data;
  },

  async bulkCreateAttendance(dataList) {
    const response = await axios.post(`${API_URL}/attendance/bulk_create/`, dataList);
    return response.data;
  },

  async updateAttendance(id, data) {
    const response = await axios.patch(`${API_URL}/attendance/${id}/`, data);
    return response.data;
  },

  // 보강 관리
  async getMakeupList(params) {
    const response = await axios.get(`${API_URL}/makeup/`, { params });
    return response.data;
  },

  async createMakeup(data) {
    const response = await axios.post(`${API_URL}/makeup/`, data);
    return response.data;
  },

  async updateMakeupStatus(id, action) {
    const response = await axios.post(`${API_URL}/makeup/${id}/${action}/`);
    return response.data;
  }
};
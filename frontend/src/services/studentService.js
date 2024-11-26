// frontend/src/services/studentService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const studentService = {
  async getStudents(params) {
    const response = await axios.get(`${API_URL}/students/`, { params });
    return response.data;
  },

  async getStudentById(id) {
    const response = await axios.get(`${API_URL}/students/${id}/`);
    return response.data;
  },

  async getStudentSubscriptions(id) {
    const response = await axios.get(`${API_URL}/students/${id}/subscriptions/`);
    return response.data;
  },

  async getStudentAttendance(id) {
    const response = await axios.get(`${API_URL}/students/${id}/attendance_history/`);
    return response.data;
  },

  async createStudent(data) {
    const response = await axios.post(`${API_URL}/students/`, data);
    return response.data;
  },

  async updateStudent(id, data) {
    const response = await axios.patch(`${API_URL}/students/${id}/`, data);
    return response.data;
  },

  async deleteStudent(id) {
    await axios.delete(`${API_URL}/students/${id}/`);
  }
};
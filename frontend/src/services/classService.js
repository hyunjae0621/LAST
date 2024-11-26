// frontend/src/services/classService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const classService = {
  async getClasses(params) {
    const response = await axios.get(`${API_URL}/classes/`, { params });
    return response.data;
  },

  async getClassById(id) {
    const response = await axios.get(`${API_URL}/classes/${id}/`);
    return response.data;
  },

  async createClass(data) {
    const response = await axios.post(`${API_URL}/classes/`, data);
    return response.data;
  },

  async updateClass(id, data) {
    const response = await axios.patch(`${API_URL}/classes/${id}/`, data);
    return response.data;
  },

  async deleteClass(id) {
    await axios.delete(`${API_URL}/classes/${id}/`);
  },

  async getClassStudents(id) {
    const response = await axios.get(`${API_URL}/classes/${id}/students/`);
    return response.data;
  },

  async getClassSchedules(id) {
    const response = await axios.get(`${API_URL}/classes/${id}/schedules/`);
    return response.data;
  }
};
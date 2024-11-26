  // frontend/src/services/subscriptionService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const subscriptionService = {
  async getSubscriptions(params) {
    const response = await axios.get(`${API_URL}/subscriptions/`, { params });
    return response.data;
  },

  async getSubscriptionById(id) {
    const response = await axios.get(`${API_URL}/subscriptions/${id}/`);
    return response.data;
  },

  async createSubscription(data) {
    const response = await axios.post(`${API_URL}/subscriptions/`, data);
    return response.data;
  },

  async updateSubscription(id, data) {
    const response = await axios.patch(`${API_URL}/subscriptions/${id}/`, data);
    return response.data;
  },

  async pauseSubscription(id, data) {
    const response = await axios.post(`${API_URL}/subscriptions/${id}/pause/`, data);
    return response.data;
  },

  async resumeSubscription(id) {
    const response = await axios.post(`${API_URL}/subscriptions/${id}/resume/`);
    return response.data;
  },

  async extendSubscription(id, days) {
    const response = await axios.post(`${API_URL}/subscriptions/${id}/extend/`, { days });
    return response.data;
  }
};
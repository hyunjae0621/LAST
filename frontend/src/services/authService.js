// frontend/src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const authService = {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password,
      });
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        return response.data;
      }
    } catch (error) {
      throw new Error('로그인에 실패했습니다.');
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register/`, userData);
      return response.data;
    } catch (error) {
      throw new Error('회원가입에 실패했습니다.');
    }
  },
};

export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
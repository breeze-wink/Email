// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://172.16.25.98:8081', // 开发阶段的后端地址
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

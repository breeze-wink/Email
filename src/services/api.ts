// src/services/api.ts
import axios from 'axios';

// 用于 JSON 请求的 Axios 实例
const apiClient = axios.create({
  baseURL: 'http://124.70.47.40:8081', // 开发阶段的后端地址
  headers: {
    'Content-Type': 'application/json',
  },
});

// 用于表单数据请求的 Axios 实例
const apiFormDataClient = axios.create({
  baseURL: 'http://124.70.47.40:8081',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// 使用默认导出一个实例（可以选 apiClient 作为默认）
export default apiClient;

// 使用命名导出另一个实例
export { apiFormDataClient };

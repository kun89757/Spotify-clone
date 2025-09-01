// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8888', // 你的API基础URL
  timeout: 50000, // 请求超时时间
  headers: { 'Content-Type': 'application/json' }
});

// 可以在这里配置拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 在发送请求之前可以做一些事情，例如添加token
    const accessToken = localStorage.getItem('accessToken');
    const token = localStorage.getItem('token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (token) {
      config.headers['token'] = `${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    return response;
  },
  error => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default axiosInstance;

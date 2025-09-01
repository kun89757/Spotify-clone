// src/albumService.js
import axiosInstance from './axiosInstance';

const handleError = (error) => {
  // 你可以在这里处理各种错误，例如网络错误，服务器错误等
  if (error.response) {
    // 服务器响应了一个错误状态码
    console.error('Server Error:', error.response.data);
  } else if (error.request) {
    // 请求已发送，但没有收到响应
    console.error('Network Error:', error.request);
  } else {
    // 其他错误
    console.error('Error:', error.message);
  }
  throw error;
};

const songService = {
  getAllSongs: async (endpoint) => {
    try {
      return await axiosInstance.get(endpoint);
    } catch (error) {
      handleError(error);
    }
  },

  getSongsByAlbumId: async (endpoint, albumId) => {
    try {
      return await axiosInstance.get(endpoint, {
        params: { albumId }
      })
    } catch (error) {
      handleError(error);
    }
  },

  uploadFile: async (endpoint, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      handleError(error);
    }
  },

  addSong: async (endpoint, data) => {
    try {
      return await axiosInstance.post(endpoint, data);
    } catch (error) {
      handleError(error);
    }
  },

  updateData: async (endpoint, data) => {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteSong: async (endpoint, id) => {
    try {
      return await axiosInstance.delete(endpoint, {
        params: { id }
      });
    } catch (error) {
      handleError(error);
    }
  }
};

export default songService;

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

const artistService = {
  getAllArtists: async (endpoint) => {
    try {
      return await axiosInstance.get(endpoint);
    } catch (error) {
      handleError(error);
    }
  },

  getArtistById: async (endpoint, id) => {
    try {
      return await axiosInstance.get(endpoint, {
        params: { id },
      });
    } catch (error) {
      handleError(error);
    }
  },

  postData: async (endpoint, data) => {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
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

  deleteData: async (endpoint) => {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};

export default artistService;

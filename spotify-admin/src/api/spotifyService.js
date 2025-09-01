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

const spotifyService = {
  login: async (endpoint, params) => {
    try {
      return await axiosInstance.get(endpoint, params);
    } catch (error) {
      handleError(error);
    }
  }
}

export default spotifyService;

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000'
});

axiosInstance.interceptors.request.use(
  (config) => {
      const accessToken = localStorage.getItem('token');
      console.log("Access Token:", accessToken);  // <-- Add this line
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);



export default axiosInstance;

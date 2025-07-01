import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token');
    if (token) {
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; 
  },
  (error) => {
    
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    
    if (error.response && error.response.status === 401) {

      console.error('Yetkisiz erişim veya token süresi doldu:', error.response.data);

    }
    return Promise.reject(error);
  }
);

export default apiClient;
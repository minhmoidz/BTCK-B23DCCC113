import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardApi = {
  getTongQuan: async () => {
    const response = await api.get('/thong-ke/tong-quan');
    return response.data;
  },

  getTruongPhooBien: async () => {
    const response = await api.get('/thong-ke/truong-pho-bien');
    return response.data;
  },

  getUserTheoThoiGian: async (loai: string = 'ngay') => {
    const response = await api.get(`/thong-ke/user-theo-thoi-gian?loai=${loai}`);
    return response.data;
  },

  getHoSoTheoThoiGian: async (loai: string = 'ngay') => {
    const response = await api.get(`/thong-ke/ho-so-theo-thoi-gian?loai=${loai}`);
    return response.data;
  },

  getSoSanh: async () => {
    const response = await api.get('/thong-ke/so-sanh');
    return response.data;
  },
};

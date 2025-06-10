import axios from 'axios';
import { TongQuanStats, TruongPhooBien, ThongKeTheoThoiGian, SoSanhData } from '../types/dashboard';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardApi = {
  // Lấy thống kê tổng quan
  getTongQuan: async (): Promise<TongQuanStats> => {
    const response = await api.get('/thong-ke/tong-quan');
    return response.data;
  },

  // Lấy trường phổ biến
  getTruongPhooBien: async (): Promise<TruongPhooBien[]> => {
    const response = await api.get('/thong-ke/truong-pho-bien');
    return response.data;
  },

  // Lấy thống kê user theo thời gian
  getUserTheoThoiGian: async (loai: 'ngay' | 'tuan' | 'thang' = 'ngay'): Promise<ThongKeTheoThoiGian[]> => {
    const response = await api.get(`/thong-ke/user-theo-thoi-gian?loai=${loai}`);
    return response.data;
  },

  // Lấy thống kê hồ sơ theo thời gian
  getHoSoTheoThoiGian: async (loai: 'ngay' | 'tuan' | 'thang' = 'ngay'): Promise<ThongKeTheoThoiGian[]> => {
    const response = await api.get(`/thong-ke/ho-so-theo-thoi-gian?loai=${loai}`);
    return response.data;
  },

  // Lấy so sánh user vs hồ sơ
  getSoSanh: async (): Promise<SoSanhData> => {
    const response = await api.get('/thong-ke/so-sanh');
    return response.data;
  },
};

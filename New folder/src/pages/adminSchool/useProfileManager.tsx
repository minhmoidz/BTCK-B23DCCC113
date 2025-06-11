import { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const API_URL = 'http://localhost:3000/api';

export const useProfileManager = () => {
  // Lấy thông tin user và token
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const schoolId = user.schoolId;

  // State cho profiles
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // State cho thống kê
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  // Bộ lọc
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [major, setMajor] = useState('');

  // Modal/Drawer
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // Gửi email
  const [sendingEmail, setSendingEmail] = useState(false);

  // Lấy thống kê
  const fetchStatistics = async () => {
    if (!schoolId || !token) return;
    setStatisticsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/admin/schools/${schoolId}/statistics`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Statistics data:', response.data);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      message.error('Không thể tải dữ liệu thống kê: ' + (error.response?.data?.message || error.message));
    }
    setStatisticsLoading(false);
  };

  // Transform profile data từ API response
  const transformProfileData = (profile) => {
    return {
      id: profile.maHoSo,
      hoTen: profile.hoTen,
      email: profile.email,
      soDienThoai: profile.soDienThoai,
      ngaySinh: moment(profile.ngaySinh).format('DD/MM/YYYY'),
      gioiTinh: profile.gioiTinh,
      cmnd: profile.soCCCD,
      diaChi: profile.diaChiThuongTru,
      truongThpt: profile.truongTHPT,
      phuongThucXetTuyen: profile.phuongThuc,
      nganhDangKy: profile.nganh,
      diemXetTuyen: profile.diemXetTuyen || profile.diemTongCong || profile.diemTBHocTap || profile.diemDanhGiaNangLuc || 0,
      trangThai: profile.trangThai,
      ngayCapNhat: profile.updatedAt ? moment(profile.updatedAt).format('DD/MM/YYYY HH:mm') : null,
      nguoiDuyet: profile.lichSuTrangThai?.length > 0
        ? profile.lichSuTrangThai[profile.lichSuTrangThai.length - 1].nguoiThucHien
        : null,
      ghiChu: profile.lichSuTrangThai?.length > 0
        ? profile.lichSuTrangThai[profile.lichSuTrangThai.length - 1].ghiChu
        : '',
      lichSuTrangThai: profile.lichSuTrangThai || [],
      taiLieu: profile.files ? profile.files.map((file, idx) => {
        const fileCategory = profile.fileCategories ? profile.fileCategories[file] : null;
        const ext = file.split('.').pop().toLowerCase();
        let type = 'text';
        if (['pdf'].includes(ext)) type = 'pdf';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'image';
        if (['xls', 'xlsx'].includes(ext)) type = 'excel';
        return {
          ten: fileCategory || `Tài liệu ${idx + 1}`,
          loai: type,
          url: `${API_URL}/${file}`,
          ngayTai: moment(profile.createdAt).format('DD/MM/YYYY')
        };
      }) : [],
      _id: profile._id
    };
  };

  // Lấy danh sách hồ sơ
  const fetchProfiles = async () => {
    if (!schoolId || !token) return;
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };
      if (status) params.trangThai = status;
      if (method) params.phuongThuc = method;
      if (major) params.nganh = major;

      const response = await axios.get(
        `${API_URL}/admin/schools/${schoolId}/profiles`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      const transformedProfiles = (response.data.profiles || []).map(profile => 
        transformProfileData(profile)
      );

      setProfiles(transformedProfiles);
      setTotal(response.data.pagination?.totalItems || transformedProfiles.length);
    } catch (error) {
      message.error('Không thể tải dữ liệu hồ sơ: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  // Gửi email trúng tuyển
  const handleSendAdmissionEmail = async (profile) => {
    try {
      setSendingEmail(true);
      await axios.post(`${API_URL}/auth/send-admission-notification`, {
        userEmail: profile.email,
        userName: profile.hoTen,
        schoolName: user.school?.name,
        majorName: profile.nganhDangKy,
        method: profile.phuongThucXetTuyen
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Đã gửi email trúng tuyển');
    } catch (error) {
      message.error('Gửi email thất bại: ' + (error.response?.data?.message || error.message));
    }
    setSendingEmail(false);
  };

  // Cập nhật trạng thái hồ sơ
  const submitStatusUpdate = async (values) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/profiles/${selectedProfile._id}/status`, {
        trangThai: values.trangThai,
        ghiChu: values.ghiChu
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfiles();
      fetchStatistics();
      setStatusModalVisible(false);
      setSelectedProfile(null);
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error('Không thể cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const getChartData = () => {
    if (!statistics) return null;

    const majorChartData = {
      labels: statistics.byMajor?.map(item => item.majorName) || [],
      datasets: [
        {
          label: 'Tổng hồ sơ',
          data: statistics.byMajor?.map(item => item.total) || [],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Trúng tuyển',
          data: statistics.byMajor?.map(item => item.trungTuyen) || [],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ],
    };

    const methodChartData = {
      labels: statistics.byMethod?.map(item => item.methodName) || [],
      datasets: [
        {
          data: statistics.byMethod?.map(item => item.total) || [],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ]
        }
      ]
    };

    const timeChartData = {
      labels: statistics.byTime?.map(item => moment(item._id).format('DD/MM')) || [],
      datasets: [
        {
          label: 'Số hồ sơ đăng ký',
          data: statistics.byTime?.map(item => item.count) || [],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };

    return { majorChartData, methodChartData, timeChartData };
  };

  // Effect để load dữ liệu
  useEffect(() => {
    fetchStatistics();
    fetchProfiles();
    // eslint-disable-next-line
  }, [schoolId, token, status, method, major, page, limit]);

  return {
    // Data
    user,
    token,
    schoolId,
    profiles,
    statistics,
    selectedProfile,
    
    // Loading states
    loading,
    statisticsLoading,
    sendingEmail,
    
    // Pagination
    total,
    page,
    limit,
    
    // Filters
    status,
    method,
    major,
    
    // Modal/Drawer states
    drawerVisible,
    statusModalVisible,
    
    // Chart data
    chartData: getChartData(),
    
    // Actions
    setPage,
    setLimit,
    setStatus,
    setMethod,
    setMajor,
    setSelectedProfile,
    setDrawerVisible,
    setStatusModalVisible,
    fetchProfiles,
    fetchStatistics,
    handleSendAdmissionEmail,
    submitStatusUpdate
  };
};

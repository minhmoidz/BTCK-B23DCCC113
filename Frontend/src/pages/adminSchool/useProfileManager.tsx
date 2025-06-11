import { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';

interface Profile {
  _id: string;
  id: string;
  maHoSo: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngaySinh: string;
  gioiTinh: string;
  cmnd: string;
  diaChi: string;
  truongThpt: string;
  phuongThucXetTuyen: string;
  nganhDangKy: string;
  diemXetTuyen: number;
  trangThai: string;
  ngayCapNhat: string | null;
  nguoiDuyet: string | null;
  ghiChu: string;
  lichSuTrangThai: any[];
  taiLieu: {
    ten: string;
    loai: string;
    url: string;
    ngayTai: string;
  }[];
  truongDangKy?: string;
}

interface FetchProfilesParams {
  page: number;
  limit: number;
  trangThai?: string;
  phuongThuc?: string;
  nganh?: string;
}

const API_URL = 'https://btck-426k.onrender.com/api';

export const useProfileManager = () => {
  // Lấy thông tin user và token
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const schoolId = user.schoolId;

  // State cho profiles
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // State cho thống kê
  const [statistics, setStatistics] = useState<any>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  // Bộ lọc
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [major, setMajor] = useState('');

  // Modal/Drawer
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
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
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      message.error('Không thể tải dữ liệu thống kê: ' + (error.response?.data?.message || error.message));
    }
    setStatisticsLoading(false);
  };

  // Transform profile data từ API response
  const transformProfileData = (profile: any): Profile => {
    return {
      _id: profile._id,
      id: profile.maHoSo,
      maHoSo: profile.maHoSo,
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
      taiLieu: profile.files ? profile.files.map((file: string, idx: number) => {
        const fileCategory = profile.fileCategories ? profile.fileCategories[file] : null;
        const ext = file.split('.').pop()?.toLowerCase();
        let type = 'text';
        if (ext && ['pdf'].includes(ext)) type = 'pdf';
        if (ext && ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'image';
        if (ext && ['xls', 'xlsx'].includes(ext)) type = 'excel';
        return {
          ten: fileCategory || `Tài liệu ${idx + 1}`,
          loai: type,
          url: `${API_URL}/${file}`,
          ngayTai: moment(profile.createdAt).format('DD/MM/YYYY')
        };
      }) : [],
      truongDangKy: profile.truongDangKy,
    };
  };

  // Lấy danh sách hồ sơ
  const fetchProfiles = async () => {
    if (!schoolId || !token) return;
    setLoading(true);
    try {
      const params: FetchProfilesParams = {
        page,
        limit,
        trangThai: status || undefined,
        phuongThuc: method || undefined,
        nganh: major || undefined,
      };

      const response = await axios.get(
        `${API_URL}/admin/schools/${schoolId}/profiles`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      const transformedProfiles: Profile[] = (response.data.profiles || []).map((profile: any) => 
        transformProfileData(profile)
      );

      setProfiles(transformedProfiles);
      setTotal(response.data.pagination?.totalItems || transformedProfiles.length);
    } catch (error: any) {
      message.error('Không thể tải dữ liệu hồ sơ: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  // Gửi email trúng tuyển
  const handleSendAdmissionEmail = async (profile: Profile) => {
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
    } catch (error: any) {
      message.error('Gửi email thất bại: ' + (error.response?.data?.message || error.message));
    }
    setSendingEmail(false);
  };

  // Cập nhật trạng thái hồ sơ
  const submitStatusUpdate = async (values: { trangThai: string; ghiChu: string }) => {
    if (!selectedProfile) return;
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
    } catch (error: any) {
      message.error('Không thể cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const getChartData = () => {
    if (!statistics) return null;

    const majorChartData = {
      labels: statistics.byMajor?.map((item: any) => item.majorName) || [],
      datasets: [
        {
          label: 'Tổng hồ sơ',
          data: statistics.byMajor?.map((item: any) => item.total) || [],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Trúng tuyển',
          data: statistics.byMajor?.map((item: any) => item.trungTuyen) || [],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ],
    };

    const methodChartData = {
      labels: statistics.byMethod?.map((item: any) => item.methodName) || [],
      datasets: [
        {
          label: 'Tổng hồ sơ',
          data: statistics.byMethod?.map((item: any) => item.total) || [],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
        {
          label: 'Trúng tuyển',
          data: statistics.byMethod?.map((item: any) => item.trungTuyen) || [],
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        }
      ],
    };

    const statusChartData = {
      labels: statistics.byStatus?.map((item: any) => item.statusName) || [],
      datasets: [
        {
          label: 'Tổng hồ sơ',
          data: statistics.byStatus?.map((item: any) => item.count) || [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return { majorChartData, methodChartData, statusChartData };
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

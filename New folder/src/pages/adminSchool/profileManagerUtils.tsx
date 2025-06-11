import React from 'react';
import { Tag, Button, Space, Tooltip } from 'antd';
import {
  EyeOutlined, EditOutlined, MailOutlined, FileTextOutlined, FilePdfOutlined, FileImageOutlined, FileExcelOutlined
} from '@ant-design/icons';
import moment from 'moment';

export const API_URL = 'http://localhost:3000/api';

// Transform profile data từ API response
export const transformProfileData = (profile, apiUrl) => {
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
        url: `${apiUrl}/${file}`,
        ngayTai: moment(profile.createdAt).format('DD/MM/YYYY')
      };
    }) : [],
    _id: profile._id
  };
};

// Render file icon dựa trên loại file
export const renderFileIcon = (loai) => {
  switch (loai) {
    case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    case 'image': return <FileImageOutlined style={{ color: '#1890ff' }} />;
    case 'excel': return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    default: return <FileTextOutlined />;
  }
};

// Lấy options cho dropdown trạng thái
export const getStatusOptions = () => [
  { value: 'dang_duyet', label: 'Chờ duyệt' },
  { value: 'duyet', label: 'Đã duyệt' },
  { value: 'tu_choi', label: 'Từ chối' },
  { value: 'yeu_cau_bo_sung', label: 'Yêu cầu bổ sung' },
  { value: 'trung_tuyen', label: 'Trúng tuyển' },
  { value: 'khong_trung_tuyen', label: 'Không trúng tuyển' },
  { value: 'xac_nhan_nhap_hoc', label: 'Đã nhập học' }
];

// Lấy options cho dropdown phương thức
export const getMethodOptions = () => [
  { value: 'thpt', label: 'THPT' },
  { value: 'hsa', label: 'HSA' },
  { value: 'tsa', label: 'TSA' },
  { value: 'dgnl', label: 'ĐGNL' },
  { value: 'xthb', label: 'XTHB' }
];

// Hiển thị trạng thái với Tag
export const getStatusDisplay = (status, withTag = true) => {
  const statusMap = {
    'dang_duyet': { text: 'Chờ duyệt', color: '' },
    'cho_duyet': { text: 'Chờ duyệt', color: '' },
    'duyet': { text: 'Đã duyệt', color: 'success' },
    'tu_choi': { text: 'Từ chối', color: 'error' },
    'yeu_cau_bo_sung': { text: 'Yêu cầu bổ sung', color: 'warning' },
    'trung_tuyen': { text: 'Trúng tuyển', color: 'green' },
    'khong_trung_tuyen': { text: 'Không trúng tuyển', color: 'red' },
    'xac_nhan_nhap_hoc': { text: 'Đã nhập học', color: 'blue' }
  };

  const statusInfo = statusMap[status] || { text: 'Không xác định', color: '' };
  
  if (withTag) {
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  }
  return statusInfo.text;
};

// Hiển thị phương thức với Tag
export const getMethodDisplay = (method, withTag = true) => {
  const methodMap = {
    'thpt': { text: 'THPT', color: 'blue' },
    'hsa': { text: 'HSA', color: 'green' },
    'tsa': { text: 'TSA', color: 'purple' },
    'dgnl': { text: 'ĐGNL', color: 'orange' },
    'xthb': { text: 'XTHB', color: 'cyan' }
  };

  const methodInfo = methodMap[method] || { text: 'Không xác định', color: '' };
  
  if (withTag) {
    return <Tag color={methodInfo.color}>{methodInfo.text}</Tag>;
  }
  return methodInfo.text;
};

// Định nghĩa columns cho Table
export const getTableColumns = ({ onViewProfile, onUpdateStatus, onSendEmail, sendingEmail }) => [
  { 
    title: 'Mã hồ sơ', 
    dataIndex: 'id', 
    key: 'id', 
    width: 100 
  },
  {
    title: 'Họ tên', 
    dataIndex: 'hoTen', 
    key: 'hoTen',
    render: (text, record) => (
      <a onClick={() => onViewProfile(record)}>{text}</a>
    ),
  },
  { 
    title: 'CMND/CCCD', 
    dataIndex: 'cmnd', 
    key: 'cmnd' 
  },
  {
    title: 'Phương thức XT', 
    dataIndex: 'phuongThucXetTuyen', 
    key: 'phuongThucXetTuyen',
    render: (method) => getMethodDisplay(method)
  },
  { 
    title: 'Ngành đăng ký', 
    dataIndex: 'nganhDangKy', 
    key: 'nganhDangKy' 
  },
  {
    title: 'Điểm', 
    dataIndex: 'diemXetTuyen', 
    key: 'diemXetTuyen',
    render: (score) => score ? score.toFixed(2) : 'N/A',
    sorter: (a, b) => a.diemXetTuyen - b.diemXetTuyen,
  },
  {
    title: 'Trạng thái', 
    dataIndex: 'trangThai', 
    key: 'trangThai',
    render: (status) => getStatusDisplay(status)
  },
  {
    title: 'Cập nhật', 
    dataIndex: 'ngayCapNhat', 
    key: 'ngayCapNhat',
    render: (text) => text || 'Chưa cập nhật',
  },
  {
    title: 'Thao tác', 
    key: 'action', 
    width: 180,
    render: (_, record) => (
      <Space size="small">
        <Tooltip title="Xem chi tiết">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => onViewProfile(record)} 
          />
        </Tooltip>
        <Tooltip title="Cập nhật trạng thái">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onUpdateStatus(record)} 
          />
        </Tooltip>
        {record.trangThai === 'trung_tuyen' && (
          <Tooltip title="Gửi email thông báo trúng tuyển">
            <Button
              type="text"
              icon={<MailOutlined />}
              loading={sendingEmail}
              onClick={() => onSendEmail(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
        )}
      </Space>
    ),
  }
];
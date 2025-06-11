import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Divider, Table, Tag, Space, Button, 
  Input, Select, Form, Modal, Tabs, Row, Col, Badge,
  Drawer, Descriptions, Timeline, Avatar, message, Tooltip,
  Upload, Popconfirm, List, notification, Alert, Empty, Spin,
  TableProps
} from 'antd';
import { 
  UserOutlined, SearchOutlined, FilterOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, 
  ExclamationCircleOutlined, UploadOutlined,
  DownloadOutlined, EditOutlined, EyeOutlined,
  MessageOutlined, HistoryOutlined, DeleteOutlined,
  ExportOutlined, ImportOutlined, FileTextOutlined,
  FilePdfOutlined, FileImageOutlined, FileExcelOutlined,
  MailOutlined, TrophyOutlined, SendOutlined,
  ReloadOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const API_URL = 'https://btck-123.onrender.com/api';
const ADMIN_TOKEN = localStorage.getItem('token');

interface Profile {
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
  truongDangKy: string;
  diemXetTuyen: number;
  trangThai: string;
  nguoiDuyet: string | null;
  ngayCapNhat: string | null;
  ghiChu: string;
  lichSuTrangThai: any[];
  taiLieu: {
    ten: string;
    loai: string;
    url: string;
    ngayTai: string;
  }[];
  _id: string;
}

const ProfileManager = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [searchVisible, setSearchVisible] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Thêm states mới cho chức năng gửi mail và lọc
  const [sendingEmail, setSendingEmail] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [bulkEmailModalVisible, setBulkEmailModalVisible] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetchProfiles();
    fetchSchools();
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      applyFilters();
    } else {
      const filtered = profiles.filter(profile => profile.trangThai === activeTab);
      applyFiltersToList(filtered);
    }
  }, [activeTab, profiles, selectedSchool, selectedMajor, selectedMethod]);

  // Hàm áp dụng bộ lọc
  const applyFilters = () => {
    let filtered: Profile[] = [...profiles];
    
    if (activeTab !== 'all') {
      filtered = filtered.filter((profile: Profile) => profile.trangThai === activeTab);
    }
    
    applyFiltersToList(filtered);
  };

  const applyFiltersToList = (list: Profile[]) => {
    let filtered: Profile[] = [...list];
    
    if (selectedSchool) {
      filtered = filtered.filter((profile: Profile) => profile.truongDangKy === selectedSchool);
    }
    
    if (selectedMajor) {
      filtered = filtered.filter((profile: Profile) => profile.nganhDangKy === selectedMajor);
    }
    
    if (selectedMethod) {
      filtered = filtered.filter((profile: Profile) => profile.phuongThucXetTuyen === selectedMethod);
    }
    
    setFilteredProfiles(filtered);
  };

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/profiles`, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      
      const formattedProfiles: Profile[] = response.data.map((profile: any) => ({
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
        truongDangKy: profile.truong,
        diemXetTuyen: profile.diemXetTuyen || profile.diemTongCong || profile.diemTBHocTap || profile.diemDanhGiaNangLuc || 0,
        trangThai: profile.trangThai,
        nguoiDuyet: profile.lichSuTrangThai && profile.lichSuTrangThai.length > 0 
          ? profile.lichSuTrangThai[profile.lichSuTrangThai.length - 1].nguoiThucHien 
          : null,
        ngayCapNhat: profile.updatedAt ? moment(profile.updatedAt).format('DD/MM/YYYY HH:mm') : null,
        ghiChu: profile.lichSuTrangThai && profile.lichSuTrangThai.length > 0 
          ? profile.lichSuTrangThai[profile.lichSuTrangThai.length - 1].ghiChu 
          : '',
        lichSuTrangThai: profile.lichSuTrangThai || [],
        taiLieu: profile.files ? profile.files.map((file: string, index: number) => {
          const fileCategory = profile.fileCategories ? profile.fileCategories[file] : null;
          const fileExt = file.split('.').pop()?.toLowerCase() || '';
          let fileType = 'text';
          if (['pdf'].includes(fileExt)) fileType = 'pdf';
          if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) fileType = 'image';
          if (['xls', 'xlsx'].includes(fileExt)) fileType = 'excel';
          
          return {
            ten: fileCategory || `Tài liệu ${index + 1}`,
            loai: fileType,
            url: `${API_URL}${file}`,
            ngayTai: moment(profile.createdAt).format('DD/MM/YYYY')
          };
        }) : [],
        _id: profile._id
      }));
      
      setProfiles(formattedProfiles);
      setFilteredProfiles(formattedProfiles);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      message.error('Không thể tải dữ liệu hồ sơ: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  // Hàm lấy danh sách trường
  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/schools`, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      setSchools(response.data);
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      message.error('Không thể tải danh sách trường: ' + (error.response?.data?.error || error.message));
    }
  };

  // Hàm lấy danh sách ngành theo trường
  const fetchMajors = async (schoolId: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/schools/${schoolId}/majors`, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      setMajors(response.data);
    } catch (error: any) {
      console.error('Error fetching majors:', error);
      message.error('Không thể tải danh sách ngành: ' + (error.response?.data?.error || error.message));
    }
  };

  // Hàm gửi email thông báo trúng tuyển cho một thí sinh
  const handleSendAdmissionEmail = async (profile: Profile) => {
    try {
      setSendingEmail(true);
      
      const emailData = {
        userEmail: profile.email,
        userName: profile.hoTen,
        schoolName: profile.truongDangKy,
        majorName: profile.nganhDangKy,
        method: getMethodName(profile.phuongThucXetTuyen)
      };

      const response = await axios.post(`${API_URL}/auth/send-admission-notification`, emailData, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });

      notification.success({
        message: 'Gửi email thành công',
        description: `Đã gửi thông báo trúng tuyển đến ${profile.email}`,
        icon: <MailOutlined style={{ color: '#52c41a' }} />
      });

    } catch (error: any) {
      console.error('Error sending email:', error);
      notification.error({
        message: 'Gửi email thất bại',
        description: error.response?.data?.message || 'Có lỗi xảy ra khi gửi email',
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Hàm gửi email hàng loạt
  const handleBulkSendEmails = async () => {
    try {
      setSendingEmail(true);
      
      const admissionResults = selectedProfiles.map((profile: Profile) => ({
        userEmail: profile.email,
        userName: profile.hoTen,
        schoolName: profile.truongDangKy,
        majorName: profile.nganhDangKy,
        method: getMethodName(profile.phuongThucXetTuyen)
      }));

      const response = await axios.post(`${API_URL}/auth/send-bulk-admission-notifications`, {
        admissionResults
      }, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });

      const { summary } = response.data;
      
      notification.success({
        message: 'Gửi email hàng loạt hoàn thành',
        description: `Đã gửi ${summary.success} email thành công, ${summary.failed} email thất bại`,
        icon: <MailOutlined style={{ color: '#52c41a' }} />
      });

      setBulkEmailModalVisible(false);
      setSelectedProfiles([]);

    } catch (error: any) {
      console.error('Error sending bulk emails:', error);
      notification.error({
        message: 'Gửi email hàng loạt thất bại',
        description: error.response?.data?.message || 'Có lỗi xảy ra khi gửi email',
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Hàm chuyển đổi tên phương thức
  const getMethodName = (method: string) => {
    const methodNames: { [key: string]: string } = {
      'thpt': 'Xét điểm thi THPT',
      'hsa': 'Xét tuyển học bạ',
      'tsa': 'Xét tuyển thẳng',
      'dgnl': 'Đánh giá năng lực',
      'xthb': 'Xét tuyển kết hợp'
    };
    return methodNames[method] || method;
  };

  // Các hàm khác giữ nguyên...
  const handleViewProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setDrawerVisible(true);
  };

  const handleUpdateStatus = (profile: Profile) => {
    setSelectedProfile(profile);
    statusForm.setFieldsValue({
      trangThai: profile.trangThai,
      ghiChu: profile.ghiChu
    });
    setStatusModalVisible(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedProfile) return;
    try {
      setLoading(true);
      const values = await statusForm.validateFields();
      
      const response = await axios.post(`${API_URL}/admin/profiles/${selectedProfile._id}/status`, {
        trangThai: values.trangThai,
        ghiChu: values.ghiChu
      }, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      
      setProfiles(profiles.map(p => p.id === selectedProfile.id ? { ...p, trangThai: values.trangThai, ghiChu: values.ghiChu, ngayCapNhat: moment().format('DD/MM/YYYY HH:mm') } : p));
      setFilteredProfiles(filteredProfiles.map(p => p.id === selectedProfile.id ? { ...p, trangThai: values.trangThai, ghiChu: values.ghiChu, ngayCapNhat: moment().format('DD/MM/YYYY HH:mm') } : p));
      setStatusModalVisible(false);
      message.success('Cập nhật trạng thái thành công');
    } catch (error: any) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    
    let filtered: Profile[] = [...profiles];
    
    if (values.hoTen) {
      filtered = filtered.filter(profile => profile.hoTen.toLowerCase().includes(values.hoTen.toLowerCase()));
    }
    if (values.email) {
      filtered = filtered.filter(profile => profile.email.toLowerCase().includes(values.email.toLowerCase()));
    }
    if (values.soDienThoai) {
      filtered = filtered.filter(profile => profile.soDienThoai.includes(values.soDienThoai));
    }
    if (values.cmnd) {
      filtered = filtered.filter(profile => profile.cmnd.includes(values.cmnd));
    }
    
    setFilteredProfiles(filtered);
    setSearchVisible(false);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    applyFilters();
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/profiles/export-excel`, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'danh_sach_ho_so.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Xuất Excel thành công');
    } catch (error: any) {
      console.error('Error exporting to Excel:', error);
      message.error('Không thể xuất file Excel: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDownloadProfile = async (profileId: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/profiles/${profileId}/download`, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hoso_${profileId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Tải xuống hồ sơ thành công');
    } catch (error: any) {
      console.error('Error downloading profile:', error);
      message.error('Không thể tải xuống hồ sơ: ' + (error.response?.data?.error || error.message));
    }
  };

  const renderTrangThai = (trangThai: string) => {
    switch (trangThai) {
      case 'dang_duyet': return <Tag icon={<ClockCircleOutlined />} color="processing">Đang duyệt</Tag>;
      case 'duyet': return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
      case 'tu_choi': return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
      case 'yeu_cau_bo_sung': return <Tag icon={<ExclamationCircleOutlined />} color="warning">Yêu cầu bổ sung</Tag>;
      case 'trung_tuyen': return <Tag icon={<TrophyOutlined />} color="gold">Trúng tuyển</Tag>;
      case 'xac_nhan_nhap_hoc': return <Tag icon={<CheckCircleOutlined />} color="blue">Đã xác nhận nhập học</Tag>;
      default: return <Tag>{trangThai}</Tag>;
    }
  };

  const renderPhuongThucXetTuyen = (phuongThuc: string) => {
    switch (phuongThuc) {
      case 'thpt': return <Tag color="blue">THPT</Tag>;
      case 'hsa': return <Tag color="green">HSA</Tag>;
      case 'tsa': return <Tag color="purple">TSA</Tag>;
      case 'dgnl': return <Tag color="orange">ĐGNL</Tag>;
      case 'xthb': return <Tag color="red">XTHB</Tag>;
      default: return <Tag>{phuongThuc}</Tag>;
    }
  };

  const renderFileIcon = (loai: string) => {
    switch (loai) {
      case 'pdf': return <FilePdfOutlined />; 
      case 'image': return <FileImageOutlined />; 
      case 'excel': return <FileExcelOutlined />; 
      default: return <FileTextOutlined />; 
    }
  };

  const columns: TableProps<Profile>['columns'] = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      key: 'maHoSo',
      width: 120,
      render: (text: string, record: Profile) => (
        <a onClick={() => handleViewProfile(record)}>{text}</a>
      ),
      sorter: (a: Profile, b: Profile) => a.maHoSo.localeCompare(b.maHoSo)
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 180,
      sorter: (a: Profile, b: Profile) => a.hoTen.localeCompare(b.hoTen)
    },
    {
      title: 'Trường đăng ký',
      dataIndex: 'truongDangKy',
      key: 'truongDangKy',
      width: 200,
      sorter: (a: Profile, b: Profile) => a.truongDangKy.localeCompare(b.truongDangKy)
    },
    {
      title: 'Ngành đăng ký',
      dataIndex: 'nganhDangKy',
      key: 'nganhDangKy',
      width: 180,
      sorter: (a: Profile, b: Profile) => a.nganhDangKy.localeCompare(b.nganhDangKy)
    },
    {
      title: 'Phương thức',
      dataIndex: 'phuongThucXetTuyen',
      key: 'phuongThucXetTuyen',
      width: 150,
      render: (phuongThuc: string) => renderPhuongThucXetTuyen(phuongThuc),
      filters: [
        { text: 'THPT', value: 'thpt' },
        { text: 'HSA', value: 'hsa' },
        { text: 'TSA', value: 'tsa' },
        { text: 'ĐGNL', value: 'dgnl' },
        { text: 'XTHB', value: 'xthb' },
      ],
      onFilter: (value: any, record: Profile) => record.phuongThucXetTuyen === String(value),
    },
    {
      title: 'Điểm xét tuyển',
      dataIndex: 'diemXetTuyen',
      key: 'diemXetTuyen',
      width: 150,
      render: (score: number) => score ? score.toFixed(2) : 'N/A',
      sorter: (a: Profile, b: Profile) => a.diemXetTuyen - b.diemXetTuyen,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (trangThai: string) => renderTrangThai(trangThai),
      filters: [
        { text: 'Đang duyệt', value: 'dang_duyet' },
        { text: 'Đã duyệt', value: 'duyet' },
        { text: 'Từ chối', value: 'tu_choi' },
        { text: 'Yêu cầu bổ sung', value: 'yeu_cau_bo_sung' },
        { text: 'Trúng tuyển', value: 'trung_tuyen' },
        { text: 'Đã xác nhận nhập học', value: 'xac_nhan_nhap_hoc' },
      ],
      onFilter: (value: any, record: Profile) => record.trangThai === String(value),
    },
    {
      title: 'Cập nhật bởi',
      dataIndex: 'nguoiDuyet',
      key: 'nguoiDuyet',
      width: 150,
    },
    {
      title: 'Cập nhật',
      dataIndex: 'ngayCapNhat',
      key: 'ngayCapNhat',
      width: 150,
      render: (text: string | null) => text || 'Chưa cập nhật',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Profile) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewProfile(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleUpdateStatus(record)}
            />
          </Tooltip>
          {record.trangThai === 'trung_tuyen' && (
            <Tooltip title="Gửi email trúng tuyển">
              <Button 
                type="text" 
                icon={<MailOutlined />} 
                onClick={() => handleSendAdmissionEmail(record)}
                loading={sendingEmail}
              />
            </Tooltip>
          )}
          <Tooltip title="Tải hồ sơ">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownloadProfile(record.id)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa hồ sơ?"
            description="Bạn có chắc chắn muốn xóa hồ sơ này không?"
            onConfirm={() => message.info("Chức năng xóa đang phát triển")}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa hồ sơ">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedProfiles.map(p => p.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: Profile[]) => {
      setSelectedProfiles(selectedRows.filter(row => row.trangThai === 'trung_tuyen'));
    },
    getCheckboxProps: (record: Profile) => ({
      disabled: record.trangThai !== 'trung_tuyen',
    }),
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🧑‍🎓 Quản lý Hồ sơ Thí sinh</Title>
      
      <Card
        title="Danh sách Hồ sơ"
        extra={
          <Space>
          <Button 
              type="default" 
              icon={<SearchOutlined />} 
            onClick={() => setSearchVisible(true)}
          >
              Tìm kiếm & Lọc
          </Button>
            <Button 
              type="primary"
            icon={<ExportOutlined />}
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={() => setBulkEmailModalVisible(true)}
              disabled={selectedProfiles.length === 0}
            >
              Gửi email trúng tuyển hàng loạt ({selectedProfiles.length})
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchProfiles}>Làm mới</Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={<Badge count={profiles.length} size="small">Tất cả hồ sơ</Badge>} 
            key="all" 
          />
          <TabPane 
            tab={<Badge count={profiles.filter(p => p.trangThai === 'dang_duyet').length} size="small" offset={[10, 0]}>Đang duyệt</Badge>} 
            key="dang_duyet" 
          />
          <TabPane 
            tab={<Badge count={profiles.filter(p => p.trangThai === 'duyet').length} size="small" offset={[10, 0]}>Đã duyệt</Badge>} 
            key="duyet" 
          />
          <TabPane 
            tab={<Badge count={profiles.filter(p => p.trangThai === 'tu_choi').length} size="small" offset={[10, 0]}>Từ chối</Badge>} 
            key="tu_choi" 
          />
          <TabPane 
            tab={<Badge count={profiles.filter(p => p.trangThai === 'yeu_cau_bo_sung').length} size="small" offset={[10, 0]}>Yêu cầu bổ sung</Badge>} 
            key="yeu_cau_bo_sung" 
          />
          <TabPane 
            tab={<Badge count={profiles.filter(p => p.trangThai === 'trung_tuyen').length} size="small" offset={[10, 0]}>Trúng tuyển</Badge>} 
            key="trung_tuyen" 
          />
          <TabPane 
            tab={<Badge count={profiles.filter(p => p.trangThai === 'xac_nhan_nhap_hoc').length} size="small" offset={[10, 0]}>Đã xác nhận nhập học</Badge>} 
            key="xac_nhan_nhap_hoc" 
          />
        </Tabs>

        <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredProfiles}
          rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }} 
            scroll={{ x: 'max-content' }} 
            bordered
            rowSelection={rowSelection}
        />
        </Spin>
      </Card>
      
      {/* Drawer xem chi tiết hồ sơ */}
      <Drawer
        title="Chi tiết Hồ sơ"
        placement="right"
        width={720}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
              <Button 
                type="primary" 
              icon={<EditOutlined />} 
              onClick={() => handleUpdateStatus(selectedProfile!)}
            >
              Cập nhật trạng thái
              </Button>
          </Space>
        }
      >
        {selectedProfile ? (
          <Descriptions title="Thông tin cá nhân" bordered column={1}>
            <Descriptions.Item label="Mã hồ sơ">{selectedProfile.maHoSo}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">{selectedProfile.hoTen}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{selectedProfile.ngaySinh}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{selectedProfile.gioiTinh}</Descriptions.Item>
            <Descriptions.Item label="Số CCCD/CMND">{selectedProfile.cmnd}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ thường trú">{selectedProfile.diaChi}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedProfile.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{selectedProfile.soDienThoai}</Descriptions.Item>
                <Descriptions.Item label="Trường THPT">{selectedProfile.truongThpt}</Descriptions.Item>
                <Descriptions.Item label="Trường đăng ký">{selectedProfile.truongDangKy}</Descriptions.Item>
                <Descriptions.Item label="Ngành đăng ký">{selectedProfile.nganhDangKy}</Descriptions.Item>
            <Descriptions.Item label="Phương thức">{renderPhuongThucXetTuyen(selectedProfile.phuongThucXetTuyen)}</Descriptions.Item>
            <Descriptions.Item label="Điểm xét tuyển"><Text strong>{selectedProfile.diemXetTuyen?.toFixed(2) || 'N/A'}</Text></Descriptions.Item>
            <Descriptions.Item label="Trạng thái hồ sơ">{renderTrangThai(selectedProfile.trangThai)}</Descriptions.Item>
            {selectedProfile.nguoiDuyet && <Descriptions.Item label="Người duyệt">{selectedProfile.nguoiDuyet}</Descriptions.Item>}
            {selectedProfile.ngayCapNhat && <Descriptions.Item label="Cập nhật cuối">{selectedProfile.ngayCapNhat}</Descriptions.Item>}
            {selectedProfile.ghiChu && <Descriptions.Item label="Ghi chú">{selectedProfile.ghiChu}</Descriptions.Item>}
              </Descriptions>
        ) : (
          <Empty description="Không có dữ liệu hồ sơ" />
        )}
            
        <Divider orientation="left">Tài liệu đính kèm</Divider>
        {selectedProfile && selectedProfile.taiLieu && selectedProfile.taiLieu.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={selectedProfile.taiLieu}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        icon={<DownloadOutlined />}
                    onClick={() => handleDownloadProfile(selectedProfile.id)}
                  >Tải xuống</Button>
                    ]}
                  >
                    <List.Item.Meta
                  avatar={<Avatar icon={renderFileIcon(item.loai)} />}
                  title={<a href={item.url} target="_blank" rel="noopener noreferrer">{item.ten}</a>}
                  description={`Ngày tải: ${item.ngayTai}`}
                    />
                  </List.Item>
                )}
              />
        ) : (
          <Empty description="Không có tài liệu đính kèm" />
        )}

        <Divider orientation="left">Lịch sử trạng thái</Divider>
        {selectedProfile && selectedProfile.lichSuTrangThai && selectedProfile.lichSuTrangThai.length > 0 ? (
          <Timeline reverse>
            {selectedProfile.lichSuTrangThai.map((entry, index) => (
                  <Timeline.Item 
                    key={index}
                dot={renderTrangThai(entry.trangThai)}
                color={entry.trangThai === 'duyet' ? 'green' : entry.trangThai === 'tu_choi' ? 'red' : 'blue'}
                  >
                <Text strong>{getMethodName(entry.trangThai)}</Text> {' '}
                <Text type="secondary">bởi {entry.nguoiThucHien} vào lúc {moment(entry.thoiGian).format('HH:mm DD/MM/YYYY')}</Text>
                {entry.ghiChu && <Paragraph style={{ margin: 0 }}>Ghi chú: {entry.ghiChu}</Paragraph>}
                  </Timeline.Item>
                ))}
              </Timeline>
        ) : (
          <Empty description="Không có lịch sử trạng thái" />
        )}
      </Drawer>
      
      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái Hồ sơ"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form form={statusForm} layout="vertical" onFinish={submitStatusUpdate}>
          <Form.Item
              label="Trạng thái mới" 
            name="trangThai"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
              <Select placeholder="Chọn trạng thái">
                <Option value="dang_duyet">Đang duyệt</Option>
                <Option value="duyet">Đã duyệt</Option>
              <Option value="tu_choi">Từ chối</Option>
              <Option value="yeu_cau_bo_sung">Yêu cầu bổ sung</Option>
              <Option value="trung_tuyen">Trúng tuyển</Option>
                <Option value="xac_nhan_nhap_hoc">Đã xác nhận nhập học</Option>
            </Select>
          </Form.Item>
            <Form.Item label="Ghi chú" name="ghiChu">
              <TextArea rows={4} placeholder="Nhập ghi chú nếu cần" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Cập nhật
              </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
      
      {/* Modal tìm kiếm và lọc nâng cao */}
      <Modal
        title="Tìm kiếm và Lọc Hồ sơ"
        open={searchVisible}
        onCancel={() => setSearchVisible(false)}
        footer={null}
      >
        <Form form={searchForm} layout="vertical" onFinish={handleSearch}>
          <Form.Item label="Họ và tên" name="hoTen">
            <Input placeholder="Nhập họ và tên" />
              </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Nhập email" />
              </Form.Item>
          <Form.Item label="Số điện thoại" name="soDienThoai">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Số CCCD/CMND" name="cmnd">
            <Input placeholder="Nhập số CCCD/CMND" />
          </Form.Item>
          <Form.Item label="Trường đăng ký" name="truongDangKy">
            <Select
              placeholder="Chọn trường"
              onChange={setSelectedSchool}
              allowClear
            >
              {schools.map(school => (
                <Option key={school.id} value={school.id}>{school.name}</Option>
              ))}
                </Select>
              </Form.Item>
          <Form.Item label="Ngành đăng ký" name="nganhDangKy">
            <Select
              placeholder="Chọn ngành"
              onChange={setSelectedMajor}
              disabled={!selectedSchool}
              allowClear
            >
              {majors.map(major => (
                <Option key={major.id} value={major.id}>{major.name}</Option>
              ))}
                </Select>
              </Form.Item>
          <Form.Item label="Phương thức xét tuyển" name="phuongThucXetTuyen">
            <Select
              placeholder="Chọn phương thức"
              onChange={setSelectedMethod}
              allowClear
            >
              <Option value="thpt">Xét điểm thi THPT</Option>
              <Option value="hsa">Xét tuyển học bạ</Option>
              <Option value="tsa">Xét tuyển thẳng</Option>
              <Option value="dgnl">Đánh giá năng lực</Option>
              <Option value="xthb">Xét tuyển kết hợp</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
                Lọc
              </Button>
              <Button onClick={resetSearch} icon={<ReloadOutlined />}>
                Đặt lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal gửi email hàng loạt */}
      <Modal
        title="Gửi email trúng tuyển hàng loạt"
        open={bulkEmailModalVisible}
        onCancel={() => setBulkEmailModalVisible(false)}
        onOk={handleBulkSendEmails}
        okText="Gửi email"
        cancelText="Hủy"
        confirmLoading={sendingEmail}
        maskClosable={false}
      >
        {selectedProfiles.length > 0 ? (
          <Alert
            message="Xác nhận gửi email"
            description={
              `Bạn có chắc chắn muốn gửi email thông báo trúng tuyển đến ${selectedProfiles.length} hồ sơ đã chọn?`
            }
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
        ) : (
          <Alert
            message="Không có hồ sơ nào được chọn"
            description="Vui lòng chọn ít nhất một hồ sơ trúng tuyển để gửi email."
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <List
          size="small"
          bordered
          dataSource={selectedProfiles}
          renderItem={profile => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={profile.hoTen}
                description={profile.email}
              />
              <Tag color="green">Trúng tuyển</Tag>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ProfileManager;

import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Divider, Table, Tag, Space, Button, 
  Input, Select, Form, Modal, Tabs, Row, Col, Badge,
  Drawer, Descriptions, Timeline, Avatar, message, Tooltip,
  Upload, Popconfirm, List, notification
} from 'antd';
import { 
  UserOutlined, SearchOutlined, FilterOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, 
  ExclamationCircleOutlined, UploadOutlined,
  DownloadOutlined, EditOutlined, EyeOutlined,
  MessageOutlined, HistoryOutlined, DeleteOutlined,
  ExportOutlined, ImportOutlined, FileTextOutlined,
  FilePdfOutlined, FileImageOutlined, FileExcelOutlined,
  MailOutlined, TrophyOutlined, SendOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const API_URL = 'http://localhost:3000/api';
const ADMIN_TOKEN = localStorage.getItem('adminToken') || 'admin-token';

const ProfileManager = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [searchVisible, setSearchVisible] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Thêm states mới cho chức năng gửi mail và lọc
  const [sendingEmail, setSendingEmail] = useState(false);
  const [schools, setSchools] = useState([]);
  const [majors, setMajors] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [bulkEmailModalVisible, setBulkEmailModalVisible] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

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
    let filtered = [...profiles];
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(profile => profile.trangThai === activeTab);
    }
    
    applyFiltersToList(filtered);
  };

  const applyFiltersToList = (list) => {
    let filtered = [...list];
    
    if (selectedSchool) {
      filtered = filtered.filter(profile => profile.truongDangKy === selectedSchool);
    }
    
    if (selectedMajor) {
      filtered = filtered.filter(profile => profile.nganhDangKy === selectedMajor);
    }
    
    if (selectedMethod) {
      filtered = filtered.filter(profile => profile.phuongThucXetTuyen === selectedMethod);
    }
    
    setFilteredProfiles(filtered);
  };

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/profiles`, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      
      const formattedProfiles = response.data.map(profile => ({
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
        taiLieu: profile.files ? profile.files.map((file, index) => {
          const fileCategory = profile.fileCategories ? profile.fileCategories[file] : null;
          const fileExt = file.split('.').pop().toLowerCase();
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
    } catch (error) {
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
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  // Hàm lấy danh sách ngành theo trường
  const fetchMajors = async (schoolId) => {
    try {
      const response = await axios.get(`${API_URL}/admin/schools/${schoolId}/majors`, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      setMajors(response.data);
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };

  // Hàm gửi email thông báo trúng tuyển cho một thí sinh
  const handleSendAdmissionEmail = async (profile) => {
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

    } catch (error) {
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
      
      const admissionResults = selectedProfiles.map(profile => ({
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

    } catch (error) {
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
  const getMethodName = (method) => {
    const methodNames = {
      'thpt': 'Xét điểm thi THPT',
      'hsa': 'Xét học bạ',
      'tsa': 'Xét tài năng/năng khiếu',
      'dgnl': 'Xét đánh giá năng lực',
      'xthb': 'Xét tổng hợp'
    };
    return methodNames[method] || method;
  };

  // Các hàm khác giữ nguyên...
  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setDrawerVisible(true);
  };

  const handleUpdateStatus = (profile) => {
    setSelectedProfile(profile);
    statusForm.setFieldsValue({
      trangThai: profile.trangThai,
      ghiChu: ''
    });
    setStatusModalVisible(true);
  };

  const submitStatusUpdate = async () => {
    try {
      const values = await statusForm.validateFields();
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/admin/profiles/${selectedProfile._id}/status`, {
        trangThai: values.trangThai,
        ghiChu: values.ghiChu
      }, {
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      
      fetchProfiles();
      
      setSelectedProfile(null);
      setStatusModalVisible(false);
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    
    let filtered = [...profiles];
    
    if (values.hoTen) {
      filtered = filtered.filter(profile => 
        profile.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())
      );
    }
    
    if (values.cmnd) {
      filtered = filtered.filter(profile => 
        profile.cmnd.includes(values.cmnd)
      );
    }
    
    if (values.phuongThucXetTuyen) {
      filtered = filtered.filter(profile => 
        profile.phuongThucXetTuyen === values.phuongThucXetTuyen
      );
    }
    
    if (values.trangThai) {
      filtered = filtered.filter(profile => 
        profile.trangThai === values.trangThai
      );
    }
    
    if (values.nganhDangKy) {
      filtered = filtered.filter(profile => 
        profile.nganhDangKy.toLowerCase().includes(values.nganhDangKy.toLowerCase())
      );
    }
    
    setFilteredProfiles(filtered);
    setSearchVisible(false);
  };

  const resetSearch = () => {
    searchForm.resetFields();
    setFilteredProfiles(profiles);
    setSearchVisible(false);
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/profiles/export`, {
        params: { trangThai: activeTab !== 'all' ? activeTab : undefined },
        headers: { 
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `danh-sach-ho-so-${moment().format('YYYYMMDD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Xuất Excel thành công');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      message.error('Không thể xuất file Excel: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDownloadProfile = async (profileId) => {
    try {
      const response = await axios.get(`${API_URL}/admin/profiles/${profileId}/download`, {
        headers: { 
          'Authorization': `Bearer ${ADMIN_TOKEN}` 
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ho-so-${profileId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Tải xuống hồ sơ thành công');
    } catch (error) {
      console.error('Error downloading profile:', error);
      message.error('Không thể tải xuống hồ sơ: ' + (error.response?.data?.error || error.message));
    }
  };

  const renderTrangThai = (trangThai) => {
    switch (trangThai) {
      case 'dang_duyet':
      case 'cho_duyet':
        return <Tag color="default">Chờ duyệt</Tag>;
      case 'duyet':
        return <Tag color="success">Đã duyệt</Tag>;
      case 'tu_choi':
        return <Tag color="error">Từ chối</Tag>;
      case 'yeu_cau_bo_sung':
        return <Tag color="warning">Yêu cầu bổ sung</Tag>;
      case 'da_nhap_hoc':
      case 'xac_nhan_nhap_hoc':
        return <Tag color="blue">Đã nhập học</Tag>;
      case 'trung_tuyen':
        return <Tag color="green">Trúng tuyển</Tag>;
      case 'khong_trung_tuyen':
        return <Tag color="red">Không trúng tuyển</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const renderPhuongThucXetTuyen = (phuongThuc) => {
    switch (phuongThuc) {
      case 'thpt':
        return <Tag color="blue">THPT</Tag>;
      case 'hsa':
        return <Tag color="green">HSA</Tag>;
      case 'tsa':
        return <Tag color="purple">TSA</Tag>;
      case 'dgnl':
        return <Tag color="orange">ĐGNL</Tag>;
      case 'xthb':
        return <Tag color="cyan">XTHB</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const renderFileIcon = (loai) => {
    switch (loai) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'image':
        return <FileImageOutlined style={{ color: '#1890ff' }} />;
      case 'excel':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  // Cập nhật columns để thêm nút gửi email
  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (text, record) => (
        <a onClick={() => handleViewProfile(record)}>{text}</a>
      ),
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'cmnd',
      key: 'cmnd',
    },
    {
      title: 'Phương thức XT',
      dataIndex: 'phuongThucXetTuyen',
      key: 'phuongThucXetTuyen',
      render: renderPhuongThucXetTuyen,
      filters: [
        { text: 'THPT', value: 'thpt' },
        { text: 'HSA', value: 'hsa' },
        { text: 'TSA', value: 'tsa' },
        { text: 'ĐGNL', value: 'dgnl' },
        { text: 'XTHB', value: 'xthb' },
      ],
      onFilter: (value, record) => record.phuongThucXetTuyen === value,
    },
    {
      title: 'Ngành đăng ký',
      dataIndex: 'nganhDangKy',
      key: 'nganhDangKy',
    },
    {
      title: 'Trường',
      dataIndex: 'truongDangKy',
      key: 'truongDangKy',
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
      render: renderTrangThai,
      filters: [
        { text: 'Chờ duyệt', value: 'dang_duyet' },
        { text: 'Đã duyệt', value: 'duyet' },
        { text: 'Từ chối', value: 'tu_choi' },
        { text: 'Yêu cầu bổ sung', value: 'yeu_cau_bo_sung' },
        { text: 'Trúng tuyển', value: 'trung_tuyen' },
        { text: 'Không trúng tuyển', value: 'khong_trung_tuyen' },
        { text: 'Đã nhập học', value: 'xac_nhan_nhap_hoc' },
      ],
      onFilter: (value, record) => record.trangThai === value,
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
      width: 200,
      render: (_, record) => (
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
            <Tooltip title="Gửi email thông báo trúng tuyển">
              <Button 
                type="text" 
                icon={<MailOutlined />} 
                loading={sendingEmail}
                onClick={() => handleSendAdmissionEmail(record)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Tải xuống">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownloadProfile(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Tính toán số lượng hồ sơ theo từng trạng thái
  const countByStatus = {
    all: profiles.length,
    dang_duyet: profiles.filter(p => p.trangThai === 'dang_duyet').length,
    duyet: profiles.filter(p => p.trangThai === 'duyet').length,
    tu_choi: profiles.filter(p => p.trangThai === 'tu_choi').length,
    yeu_cau_bo_sung: profiles.filter(p => p.trangThai === 'yeu_cau_bo_sung').length,
    trung_tuyen: profiles.filter(p => p.trangThai === 'trung_tuyen').length,
    khong_trung_tuyen: profiles.filter(p => p.trangThai === 'khong_trung_tuyen').length,
    xac_nhan_nhap_hoc: profiles.filter(p => p.trangThai === 'xac_nhan_nhap_hoc').length
  };

  const tabList = [
    { key: 'all', tab: 'Tất cả', count: countByStatus.all },
    { key: 'dang_duyet', tab: 'Chờ duyệt', count: countByStatus.dang_duyet },
    { key: 'duyet', tab: 'Đã duyệt', count: countByStatus.duyet },
    { key: 'tu_choi', tab: 'Từ chối', count: countByStatus.tu_choi },
    { key: 'yeu_cau_bo_sung', tab: 'Yêu cầu bổ sung', count: countByStatus.yeu_cau_bo_sung },
    { key: 'trung_tuyen', tab: 'Trúng tuyển', count: countByStatus.trung_tuyen },
    { key: 'khong_trung_tuyen', tab: 'Không trúng tuyển', count: countByStatus.khong_trung_tuyen },
    { key: 'xac_nhan_nhap_hoc', tab: 'Đã nhập học', count: countByStatus.xac_nhan_nhap_hoc }
  ];

  // Lấy danh sách thí sinh trúng tuyển để gửi email hàng loạt
  const admittedProfiles = filteredProfiles.filter(p => p.trangThai === 'trung_tuyen');

  const rowSelection = {
    selectedRowKeys: selectedProfiles.map(p => p.id),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedProfiles(selectedRows.filter(row => row.trangThai === 'trung_tuyen'));
    },
    getCheckboxProps: (record) => ({
      disabled: record.trangThai !== 'trung_tuyen',
    }),
  };

  return (
    <div>
      <Title level={2}>Quản lý Hồ sơ</Title>
      <Text type="secondary">Quản lý và xử lý hồ sơ xét tuyển của thí sinh</Text>
      
      <Divider />
      
      {/* Bộ lọc nâng cao */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Bộ lọc nâng cao</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Text strong>Trường:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Chọn trường"
              allowClear
              value={selectedSchool}
              onChange={(value) => {
                setSelectedSchool(value);
                setSelectedMajor('');
                if (value) {
                  fetchMajors(value);
                } else {
                  setMajors([]);
                }
              }}
            >
              {schools.map(school => (
                <Option key={school.id} value={school.name}>{school.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Ngành:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Chọn ngành"
              allowClear
              value={selectedMajor}
              onChange={setSelectedMajor}
              disabled={!selectedSchool}
            >
              {majors.map(major => (
                <Option key={major.id} value={major.name}>{major.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Phương thức:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Chọn phương thức"
              allowClear
              value={selectedMethod}
              onChange={setSelectedMethod}
            >
              <Option value="thpt">THPT</Option>
              <Option value="hsa">HSA</Option>
              <Option value="tsa">TSA</Option>
              <Option value="dgnl">ĐGNL</Option>
              <Option value="xthb">XTHB</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Thao tác:</Text>
            <div style={{ marginTop: 8 }}>
              <Button 
                onClick={() => {
                  setSelectedSchool('');
                  setSelectedMajor('');
                  setSelectedMethod('');
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
      
      <Card
        tabList={tabList.map(item => ({
          key: item.key,
          tab: (
            <span>
              {item.tab} <Badge count={item.count} style={{ backgroundColor: item.key === 'dang_duyet' ? '#faad14' : '#1890ff' }} />
            </span>
          )
        }))}
        activeTabKey={activeTab}
        onTabChange={key => setActiveTab(key)}
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Button 
            icon={<FilterOutlined />} 
            onClick={() => setSearchVisible(true)}
          >
            Tìm kiếm nâng cao
          </Button>
          
          {activeTab === 'trung_tuyen' && admittedProfiles.length > 0 && (
            <Button 
              type="primary"
              icon={<SendOutlined />}
              onClick={() => setBulkEmailModalVisible(true)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Gửi email hàng loạt ({admittedProfiles.length})
            </Button>
          )}
          
          <Upload
            beforeUpload={(file) => {
              handleImportExcel(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<ImportOutlined />}>
              Nhập Excel
            </Button>
          </Upload>
          
          <Button 
            icon={<ExportOutlined />}
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
          
          <Input.Search
            placeholder="Tìm kiếm theo tên hoặc mã hồ sơ"
            style={{ width: 300 }}
            onSearch={value => {
              if (value) {
                const searched = profiles.filter(profile => 
                  profile.hoTen.toLowerCase().includes(value.toLowerCase()) || 
                  profile.id.toLowerCase().includes(value.toLowerCase())
                );
                applyFiltersToList(searched);
              } else {
                applyFilters();
              }
            }}
            allowClear
          />
        </Space>
        
        <Table
          columns={columns}
          dataSource={filteredProfiles}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`
          }}
          rowSelection={activeTab === 'trung_tuyen' ? rowSelection : null}
        />
      </Card>
      
      {/* Modal gửi email hàng loạt */}
      <Modal
        title={
          <span>
            <MailOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            Gửi email thông báo trúng tuyển hàng loạt
          </span>
        }
        visible={bulkEmailModalVisible}
        onOk={handleBulkSendEmails}
        onCancel={() => setBulkEmailModalVisible(false)}
        confirmLoading={sendingEmail}
        width={800}
        okText="Gửi email"
        cancelText="Hủy"
        okButtonProps={{ 
          style: { backgroundColor: '#52c41a', borderColor: '#52c41a' },
          disabled: selectedProfiles.length === 0
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Số lượng thí sinh được chọn: </Text>
          <Badge count={selectedProfiles.length} style={{ backgroundColor: '#52c41a' }} />
        </div>
        
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <List
            itemLayout="horizontal"
            dataSource={selectedProfiles}
            renderItem={profile => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<TrophyOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                  title={profile.hoTen}
                  description={
                    <div>
                      <Text type="secondary">Email: {profile.email}</Text><br/>
                      <Text type="secondary">Trường: {profile.truongDangKy}</Text><br/>
                      <Text type="secondary">Ngành: {profile.nganhDangKy}</Text><br/>
                      <Text type="secondary">Phương thức: {getMethodName(profile.phuongThucXetTuyen)}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
        
        {selectedProfiles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Text type="secondary">Vui lòng chọn ít nhất một thí sinh để gửi email</Text>
          </div>
        )}
      </Modal>

      {/* Các Modal và Drawer khác giữ nguyên... */}
      <Drawer
        title={selectedProfile ? `Hồ sơ: ${selectedProfile.hoTen}` : 'Chi tiết hồ sơ'}
        width={700}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        extra={
          <Space>
            {selectedProfile?.trangThai === 'trung_tuyen' && (
              <Button 
                type="primary" 
                icon={<MailOutlined />}
                loading={sendingEmail}
                onClick={() => handleSendAdmissionEmail(selectedProfile)}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Gửi email trúng tuyển
              </Button>
            )}
            <Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
            <Button type="primary" onClick={() => handleUpdateStatus(selectedProfile)}>Cập nhật trạng thái</Button>
          </Space>
        }
      >
        {selectedProfile && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Thông tin cá nhân" key="1">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã hồ sơ" span={2}>{selectedProfile.id}</Descriptions.Item>
                <Descriptions.Item label="Họ tên">{selectedProfile.hoTen}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{selectedProfile.gioiTinh}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{selectedProfile.ngaySinh}</Descriptions.Item>
                <Descriptions.Item label="CMND/CCCD">{selectedProfile.cmnd}</Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>{selectedProfile.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{selectedProfile.soDienThoai}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>{selectedProfile.diaChi}</Descriptions.Item>
                <Descriptions.Item label="Trường THPT">{selectedProfile.truongThpt}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane tab="Thông tin xét tuyển" key="2">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Phương thức xét tuyển">
                  {renderPhuongThucXetTuyen(selectedProfile.phuongThucXetTuyen)}
                </Descriptions.Item>
                <Descriptions.Item label="Trường đăng ký">{selectedProfile.truongDangKy}</Descriptions.Item>
                <Descriptions.Item label="Ngành đăng ký">{selectedProfile.nganhDangKy}</Descriptions.Item>
                <Descriptions.Item label="Điểm xét tuyển">{selectedProfile.diemXetTuyen}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {renderTrangThai(selectedProfile.trangThai)}
                </Descriptions.Item>
                <Descriptions.Item label="Người duyệt">{selectedProfile.nguoiDuyet || 'Chưa có'}</Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">{selectedProfile.ngayCapNhat || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Ghi chú">{selectedProfile.ghiChu || 'Không có'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane tab="Tài liệu" key="3">
              <List
                itemLayout="horizontal"
                dataSource={selectedProfile.taiLieu}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          window.open(item.url, '_blank');
                        }}
                      >
                        Tải xuống
                      </Button>,
                      <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={() => {
                          window.open(item.url, '_blank');
                        }}
                      >
                        Xem
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={renderFileIcon(item.loai)}
                      title={item.ten}
                      description={`Ngày tải lên: ${item.ngayTai}`}
                    />
                  </List.Item>
                )}
              />
              
              <Divider />
              
              <Upload
                action={`${API_URL}/admin/profiles/${selectedProfile._id}/upload`}
                headers={{ 'Authorization': `Bearer ${ADMIN_TOKEN}` }}
                onChange={info => {
                  if (info.file.status === 'done') {
                    message.success(`${info.file.name} tải lên thành công`);
                    fetchProfiles();
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} tải lên thất bại.`);
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Tải lên tài liệu mới</Button>
              </Upload>
            </TabPane>
            
            <TabPane tab="Lịch sử" key="4">
              <Timeline mode="left">
                {selectedProfile.lichSuTrangThai.map((item, index) => (
                  <Timeline.Item 
                    key={index}
                    color={
                      item.trangThai === 'duyet' || item.trangThai === 'trung_tuyen' ? 'green' : 
                      item.trangThai === 'tu_choi' || item.trangThai === 'khong_trung_tuyen' ? 'red' : 
                      item.trangThai === 'yeu_cau_bo_sung' ? 'orange' : 
                      'blue'
                    }
                    label={moment(item.thoiGian).format('DD/MM/YYYY HH:mm')}
                  >
                    <p><strong>{
                      item.trangThai === 'dang_duyet' ? 'Chờ duyệt' : 
                      item.trangThai === 'duyet' ? 'Đã duyệt' : 
                      item.trangThai === 'tu_choi' ? 'Từ chối' : 
                      item.trangThai === 'yeu_cau_bo_sung' ? 'Yêu cầu bổ sung' : 
                      item.trangThai === 'trung_tuyen' ? 'Trúng tuyển' :
                      item.trangThai === 'khong_trung_tuyen' ? 'Không trúng tuyển' :
                      item.trangThai === 'xac_nhan_nhap_hoc' ? 'Đã nhập học' : 
                      'Không xác định'
                    }</strong></p>
                    <p>Người thực hiện: {item.nguoiThucHien === 'system' ? 'Hệ thống' : item.nguoiThucHien}</p>
                    <p>Ghi chú: {item.ghiChu || 'Không có'}</p>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
      
      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái hồ sơ"
        visible={statusModalVisible}
        onOk={submitStatusUpdate}
        onCancel={() => setStatusModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={statusForm}
          layout="vertical"
        >
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="dang_duyet">Chờ duyệt</Option>
              <Option value="duyet">Duyệt</Option>
              <Option value="tu_choi">Từ chối</Option>
              <Option value="yeu_cau_bo_sung">Yêu cầu bổ sung</Option>
              <Option value="trung_tuyen">Trúng tuyển</Option>
              <Option value="khong_trung_tuyen">Không trúng tuyển</Option>
              <Option value="xac_nhan_nhap_hoc">Đã nhập học</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ghiChu"
            label="Ghi chú"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal tìm kiếm nâng cao */}
      <Modal
        title="Tìm kiếm nâng cao"
        visible={searchVisible}
        onOk={handleSearch}
        onCancel={() => setSearchVisible(false)}
        footer={[
          <Button key="reset" onClick={resetSearch}>
            Đặt lại
          </Button>,
          <Button key="cancel" onClick={() => setSearchVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>,
        ]}
      >
        <Form
          form={searchForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hoTen"
                label="Họ tên"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cmnd"
                label="CMND/CCCD"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phuongThucXetTuyen"
                label="Phương thức xét tuyển"
              >
                <Select allowClear>
                  <Option value="thpt">THPT</Option>
                  <Option value="hsa">HSA</Option>
                  <Option value="tsa">TSA</Option>
                  <Option value="dgnl">ĐGNL</Option>
                  <Option value="xthb">XTHB</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="trangThai"
                label="Trạng thái"
              >
                <Select allowClear>
                  <Option value="dang_duyet">Chờ duyệt</Option>
                  <Option value="duyet">Đã duyệt</Option>
                  <Option value="tu_choi">Từ chối</Option>
                  <Option value="yeu_cau_bo_sung">Yêu cầu bổ sung</Option>
                  <Option value="trung_tuyen">Trúng tuyển</Option>
                  <Option value="khong_trung_tuyen">Không trúng tuyển</Option>
                  <Option value="xac_nhan_nhap_hoc">Đã nhập học</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="nganhDangKy"
            label="Ngành đăng ký"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileManager;

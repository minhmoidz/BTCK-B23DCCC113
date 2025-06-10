import React, { useState, useEffect } from 'react';
import {
  Layout, Card, Typography, Divider, Table, Tag, Space, Button,
  Input, Select, Form, Modal, Row, Col, Drawer, Descriptions, Tabs, Timeline, Avatar, message, Tooltip, List, Upload
} from 'antd';
import {
  EyeOutlined, EditOutlined, MailOutlined, DownloadOutlined, UploadOutlined, FileTextOutlined, FilePdfOutlined, FileImageOutlined, FileExcelOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import SchoolAdminHeader from './SchoolAdminHeader';
import SchoolAdminFooter from './SchoolAdminFooter';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Content } = Layout;

const API_URL = 'http://localhost:3000/api';

const SchoolAdminProfileManager = () => {
  // Lấy thông tin user và token
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const schoolId = user.schoolId;

  // State
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Bộ lọc
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [major, setMajor] = useState('');

  // Modal/Drawer
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusForm] = Form.useForm();

  // Gửi email
  const [sendingEmail, setSendingEmail] = useState(false);

  // Lấy danh sách hồ sơ theo API mới
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

      // Chuẩn hóa dữ liệu từ response
      const profiles = (response.data.profiles || []).map(profile => ({
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
      }));

      setProfiles(profiles);
      setTotal(response.data.pagination?.totalItems || profiles.length);
    } catch (error) {
      message.error('Không thể tải dữ liệu hồ sơ: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line
  }, [schoolId, token, status, method, major, page, limit]);

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
      await axios.post(`${API_URL}/admin/profiles/${selectedProfile._id}/status`, {
        trangThai: values.trangThai,
        ghiChu: values.ghiChu
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfiles();
      setStatusModalVisible(false);
      setSelectedProfile(null);
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error('Không thể cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  // Table columns
  const columns = [
    { title: 'Mã hồ sơ', dataIndex: 'id', key: 'id', width: 100 },
    {
      title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen',
      render: (text, record) => (
        <a onClick={() => { setSelectedProfile(record); setDrawerVisible(true); }}>{text}</a>
      ),
    },
    { title: 'CMND/CCCD', dataIndex: 'cmnd', key: 'cmnd' },
    {
      title: 'Phương thức XT', dataIndex: 'phuongThucXetTuyen', key: 'phuongThucXetTuyen',
      render: (v) => {
        switch (v) {
          case 'thpt': return <Tag color="blue">THPT</Tag>;
          case 'hsa': return <Tag color="green">HSA</Tag>;
          case 'tsa': return <Tag color="purple">TSA</Tag>;
          case 'dgnl': return <Tag color="orange">ĐGNL</Tag>;
          case 'xthb': return <Tag color="cyan">XTHB</Tag>;
          default: return <Tag>Không xác định</Tag>;
        }
      }
    },
    { title: 'Ngành đăng ký', dataIndex: 'nganhDangKy', key: 'nganhDangKy' },
    {
      title: 'Điểm', dataIndex: 'diemXetTuyen', key: 'diemXetTuyen',
      render: (score) => score ? score.toFixed(2) : 'N/A',
      sorter: (a, b) => a.diemXetTuyen - b.diemXetTuyen,
    },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai',
      render: (v) => {
        switch (v) {
          case 'dang_duyet': case 'cho_duyet': return <Tag>Chờ duyệt</Tag>;
          case 'duyet': return <Tag color="success">Đã duyệt</Tag>;
          case 'tu_choi': return <Tag color="error">Từ chối</Tag>;
          case 'yeu_cau_bo_sung': return <Tag color="warning">Yêu cầu bổ sung</Tag>;
          case 'trung_tuyen': return <Tag color="green">Trúng tuyển</Tag>;
          case 'khong_trung_tuyen': return <Tag color="red">Không trúng tuyển</Tag>;
          case 'xac_nhan_nhap_hoc': return <Tag color="blue">Đã nhập học</Tag>;
          default: return <Tag>Không xác định</Tag>;
        }
      }
    },
    {
      title: 'Cập nhật', dataIndex: 'ngayCapNhat', key: 'ngayCapNhat',
      render: (text) => text || 'Chưa cập nhật',
    },
    {
      title: 'Thao tác', key: 'action', width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedProfile(record); setDrawerVisible(true); }} />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleUpdateStatus(record)} />
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
        </Space>
      ),
    }
  ];

  // Render file icon
  const renderFileIcon = (loai) => {
    switch (loai) {
      case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'image': return <FileImageOutlined style={{ color: '#1890ff' }} />;
      case 'excel': return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      default: return <FileTextOutlined />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SchoolAdminHeader user={user} onLogout={() => {
        localStorage.clear();
        window.location.href = '/login';
      }} />
      <Content style={{ padding: '32px 16px 0 16px', background: '#f5f7fa' }}>
        <Title level={2} style={{ marginBottom: 16 }}>Quản lý Hồ sơ trường {user.school?.name || schoolId}</Title>
        <Divider />
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Text strong>Trạng thái:</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Chọn trạng thái"
                allowClear
                value={status}
                onChange={v => { setStatus(v); setPage(1); }}
              >
                <Option value="dang_duyet">Chờ duyệt</Option>
                <Option value="duyet">Đã duyệt</Option>
                <Option value="tu_choi">Từ chối</Option>
                <Option value="yeu_cau_bo_sung">Yêu cầu bổ sung</Option>
                <Option value="trung_tuyen">Trúng tuyển</Option>
                <Option value="khong_trung_tuyen">Không trúng tuyển</Option>
                <Option value="xac_nhan_nhap_hoc">Đã nhập học</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Text strong>Phương thức:</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Chọn phương thức"
                allowClear
                value={method}
                onChange={v => { setMethod(v); setPage(1); }}
              >
                <Option value="thpt">THPT</Option>
                <Option value="hsa">HSA</Option>
                <Option value="tsa">TSA</Option>
                <Option value="dgnl">ĐGNL</Option>
                <Option value="xthb">XTHB</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Text strong>Ngành:</Text>
              <Input
                placeholder="Nhập ngành"
                value={major}
                onChange={e => { setMajor(e.target.value); setPage(1); }}
                style={{ marginTop: 8 }}
              />
            </Col>
            <Col span={6}>
              <Text strong>Thao tác:</Text>
              <div style={{ marginTop: 8 }}>
                <Button onClick={() => { setStatus(''); setMethod(''); setMajor(''); setPage(1); }}>
                  Đặt lại bộ lọc
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
        <Table
          columns={columns}
          dataSource={profiles}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t, range) => `${range[0]}-${range[1]} của ${t} hồ sơ`,
            onChange: (p, l) => { setPage(p); setLimit(l); },
          }}
        />

        {/* Drawer xem chi tiết */}
        <Drawer
          title={selectedProfile ? `Hồ sơ: ${selectedProfile.hoTen}` : 'Chi tiết hồ sơ'}
          width={700}
          placement="right"
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          extra={
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
              <Button type="primary" onClick={() => handleUpdateStatus(selectedProfile)}>Cập nhật trạng thái</Button>
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
                    {columns.find(col => col.dataIndex === 'phuongThucXetTuyen').render(selectedProfile.phuongThucXetTuyen)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngành đăng ký">{selectedProfile.nganhDangKy}</Descriptions.Item>
                  <Descriptions.Item label="Điểm xét tuyển">{selectedProfile.diemXetTuyen}</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {columns.find(col => col.dataIndex === 'trangThai').render(selectedProfile.trangThai)}
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
                          onClick={() => window.open(item.url, '_blank')}
                        >Tải xuống</Button>,
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => window.open(item.url, '_blank')}
                        >Xem</Button>
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
                  headers={{ 'Authorization': `Bearer ${token}` }}
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
                  {selectedProfile.lichSuTrangThai.map((item, idx) => (
                    <Timeline.Item
                      key={idx}
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
          <Form form={statusForm} layout="vertical">
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
            <Form.Item name="ghiChu" label="Ghi chú">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
      <SchoolAdminFooter />
    </Layout>
  );
};

export default SchoolAdminProfileManager;

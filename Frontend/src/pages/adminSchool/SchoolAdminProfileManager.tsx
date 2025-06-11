import React from 'react';
import { Form } from 'antd';
import {
  Layout, Card, Typography, Divider, Table, Tag, Space, Button,
  Input, Select, Modal, Row, Col, Drawer, Descriptions, Tabs, Timeline, List, Upload,
  Statistic, Progress
} from 'antd';
import {
  EyeOutlined, EditOutlined, MailOutlined, DownloadOutlined, UploadOutlined, 
  UserOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  TrophyOutlined, BookOutlined, BarChartOutlined, CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import SchoolAdminHeader from './SchoolAdminHeader';
import SchoolAdminFooter from './SchoolAdminFooter';
import { useProfileManager } from './useProfileManager';
import {
  getTableColumns,
  renderFileIcon,
  getStatusOptions,
  getMethodOptions,
  getStatusDisplay,
  getMethodDisplay
} from './profileManagerUtils';

// Đăng ký Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  ArcElement
);

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Content } = Layout;

const SchoolAdminProfileManager = () => {
  const {
    // Data
    user,
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
    chartData,
    
    // Actions
    setPage,
    setLimit,
    setStatus,
    setMethod,
    setMajor,
    setSelectedProfile,
    setDrawerVisible,
    setStatusModalVisible,
    handleSendAdmissionEmail,
    submitStatusUpdate
  } = useProfileManager();

  const [statusForm] = Form.useForm();

  // Handlers
  const handleViewProfile = (record) => {
    setSelectedProfile(record);
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

  const handleStatusSubmit = async () => {
    try {
      const values = await statusForm.validateFields();
      await submitStatusUpdate(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Table columns
  const columns = getTableColumns({
    onViewProfile: handleViewProfile,
    onUpdateStatus: handleUpdateStatus,
    onSendEmail: handleSendAdmissionEmail,
    sendingEmail
  });

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <SchoolAdminHeader user={user} onLogout={() => {
        localStorage.clear();
        window.location.href = '/login';
      }} />
      
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Title level={2} style={{ marginBottom: 24, color: '#1890ff' }}>
            <BookOutlined /> Dashboard - {statistics?.schoolInfo?.name || 'Trường học'}
          </Title>

          {/* Thống kê tổng quan */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                bodyStyle={{ padding: '20px' }}
                loading={statisticsLoading}
              >
                <Statistic
                  title={<span style={{ color: 'white', fontSize: '14px' }}>Tổng hồ sơ</span>}
                  value={statistics?.overview?.totalProfiles || 0}
                  prefix={<UserOutlined style={{ color: 'white' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                bodyStyle={{ padding: '20px' }}
                loading={statisticsLoading}
              >
                <Statistic
                  title={<span style={{ color: 'white', fontSize: '14px' }}>Đã duyệt</span>}
                  value={statistics?.overview?.daDuyet || 0}
                  prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                bodyStyle={{ padding: '20px' }}
                loading={statisticsLoading}
              >
                <Statistic
                  title={<span style={{ color: 'white', fontSize: '14px' }}>Chờ duyệt</span>}
                  value={statistics?.overview?.dangDuyet || 0}
                  prefix={<ClockCircleOutlined style={{ color: 'white' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                bodyStyle={{ padding: '20px' }}
                loading={statisticsLoading}
              >
                <Statistic
                  title={<span style={{ color: 'white', fontSize: '14px' }}>Trúng tuyển</span>}
                  value={statistics?.overview?.trungTuyen || 0}
                  prefix={<TrophyOutlined style={{ color: 'white' }} />}
                  valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ thống kê */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={<><BarChartOutlined /> Thống kê theo ngành</>}
                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                bodyStyle={{ height: '350px' }}
                loading={statisticsLoading}
              >
                {chartData?.majorChartData && (
                  <Bar 
                    data={chartData.majorChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={<><BarChartOutlined /> Phân bố theo phương thức</>}
                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                bodyStyle={{ height: '350px' }}
                loading={statisticsLoading}
              >
                {chartData?.methodChartData && (
                  <Pie 
                    data={chartData.methodChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                      },
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* Thống kê chi tiết theo ngành */}
          <Card 
            title={<><BookOutlined /> Chi tiết theo ngành</>}
            style={{ marginBottom: 24, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            loading={statisticsLoading}
          >
            <Row gutter={[16, 16]}>
              {statistics?.byMajor?.map((major, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <Card 
                    size="small" 
                    style={{ 
                      background: '#fafafa',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}
                  >
                    <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>
                      {major.majorName}
                    </Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Chỉ tiêu:</Text>
                        <Text strong>{major.quota}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Đã đăng ký:</Text>
                        <Text strong>{major.total}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Trúng tuyển:</Text>
                        <Text strong style={{ color: '#52c41a' }}>{major.trungTuyen}</Text>
                      </div>
                      <Progress 
                        percent={parseFloat(major.tiLeDangKy)} 
                        format={percent => `${percent}%`}
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Tỷ lệ đăng ký: {major.tiLeDangKy}%
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Divider />
          
          {/* Bộ lọc */}
          <Card 
            title="Bộ lọc hồ sơ"
            style={{ marginBottom: 16, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
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
                  {getStatusOptions().map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
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
                  {getMethodOptions().map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
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
                  <Button 
                    onClick={() => { setStatus(''); setMethod(''); setMajor(''); setPage(1); }}
                    style={{ borderRadius: '6px' }}
                  >
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
          
          {/* Bảng dữ liệu */}
          <Card 
            title="Danh sách hồ sơ"
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
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
              scroll={{ x: 1200 }}
              style={{ borderRadius: '8px' }}
            />
          </Card>
        </div>

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
              <Button type="primary" onClick={() => handleUpdateStatus(selectedProfile)}>
                Cập nhật trạng thái
              </Button>
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
                    {getMethodDisplay(selectedProfile.phuongThucXetTuyen)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngành đăng ký">{selectedProfile.nganhDangKy}</Descriptions.Item>
                  <Descriptions.Item label="Điểm xét tuyển">{selectedProfile.diemXetTuyen}</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {getStatusDisplay(selectedProfile.trangThai)}
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
                      <p><strong>{getStatusDisplay(item.trangThai, false)}</strong></p>
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
          onOk={handleStatusSubmit}
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
                {getStatusOptions().map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
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

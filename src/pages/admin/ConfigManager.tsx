import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Divider, Tabs, Form, Input, Button, 
  Switch, Select, InputNumber, DatePicker, TimePicker, 
  Row, Col, Space, message, Spin, Collapse, Alert,
  Popconfirm, Upload, Table, Tag
} from 'antd';
import { 
  SaveOutlined, ReloadOutlined, UploadOutlined,
  DownloadOutlined, SettingOutlined, MailOutlined,
  LockOutlined, BellOutlined, UserOutlined,
  DatabaseOutlined, CloudServerOutlined, FileTextOutlined,
  GlobalOutlined, CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const ConfigManager = () => {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [generalForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [backupHistory, setBackupHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    // Giả lập tải dữ liệu cấu hình
    setTimeout(() => {
      // Cấu hình chung
      generalForm.setFieldsValue({
        siteName: 'Hệ thống Quản lý Tuyển sinh',
        siteDescription: 'Hệ thống quản lý tuyển sinh trực tuyến',
        adminEmail: 'admin@tuyensinh.edu.vn',
        supportPhone: '1900 1234',
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'jpg', 'png', 'doc', 'docx'],
        defaultLanguage: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        maintenanceMode: false
      });
      
      // Cấu hình thông báo
      notificationForm.setFieldsValue({
        enableEmailNotifications: true,
        enableSmsNotifications: false,
        enableBrowserNotifications: true,
        notifyOnNewApplication: true,
        notifyOnStatusChange: true,
        notifyOnDeadlineApproaching: true,
        reminderDays: 3,
        dailySummary: true,
        summaryTime: moment('08:00:00', 'HH:mm:ss')
      });
      
      // Cấu hình bảo mật
      securityForm.setFieldsValue({
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireNumbers: true,
        passwordRequireSpecial: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        enableTwoFactor: false,
        enableCaptcha: true,
        ipWhitelist: '',
        enableAuditLog: true
      });
      
      // Cấu hình email
      emailForm.setFieldsValue({
        smtpServer: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'noreply@tuyensinh.edu.vn',
        smtpPassword: '********',
        smtpEncryption: 'tls',
        senderName: 'Hệ thống Tuyển sinh',
        senderEmail: 'noreply@tuyensinh.edu.vn',
        emailFooter: 'Đây là email tự động, vui lòng không trả lời email này.',
        testEmail: ''
      });
      
      // Cấu hình lịch trình
      scheduleForm.setFieldsValue({
        registrationPeriod: [moment('2025-03-01'), moment('2025-06-30')],
        evaluationPeriod: [moment('2025-07-01'), moment('2025-07-15')],
        resultAnnouncementDate: moment('2025-07-20'),
        confirmationDeadline: moment('2025-07-30'),
        enrollmentPeriod: [moment('2025-08-15'), moment('2025-08-30')],
        academicYearStart: moment('2025-09-05')
      });
      
      // Lịch sử sao lưu
      setBackupHistory([
        { id: 1, date: '2025-05-21 01:00:00', size: '42.5 MB', type: 'Tự động', status: 'success' },
        { id: 2, date: '2025-05-20 01:00:00', size: '42.3 MB', type: 'Tự động', status: 'success' },
        { id: 3, date: '2025-05-19 01:00:00', size: '42.1 MB', type: 'Tự động', status: 'success' },
        { id: 4, date: '2025-05-18 13:45:22', size: '41.8 MB', type: 'Thủ công', status: 'success' },
        { id: 5, date: '2025-05-18 01:00:00', size: '41.8 MB', type: 'Tự động', status: 'success' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveGeneral = async () => {
    try {
      await generalForm.validateFields();
      setSaveLoading(true);
      
      // Giả lập lưu cấu hình
      setTimeout(() => {
        setSaveLoading(false);
        message.success('Lưu cấu hình chung thành công');
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await notificationForm.validateFields();
      setSaveLoading(true);
      
      // Giả lập lưu cấu hình
      setTimeout(() => {
        setSaveLoading(false);
        message.success('Lưu cấu hình thông báo thành công');
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await securityForm.validateFields();
      setSaveLoading(true);
      
      // Giả lập lưu cấu hình
      setTimeout(() => {
        setSaveLoading(false);
        message.success('Lưu cấu hình bảo mật thành công');
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSaveEmail = async () => {
    try {
      await emailForm.validateFields();
      setSaveLoading(true);
      
      // Giả lập lưu cấu hình
      setTimeout(() => {
        setSaveLoading(false);
        message.success('Lưu cấu hình email thành công');
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      await scheduleForm.validateFields();
      setSaveLoading(true);
      
      // Giả lập lưu cấu hình
      setTimeout(() => {
        setSaveLoading(false);
        message.success('Lưu cấu hình lịch trình thành công');
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleTestEmail = async () => {
    try {
      const values = await emailForm.validateFields();
      message.loading('Đang gửi email thử nghiệm...', 2.5);
      
      // Giả lập gửi email
      setTimeout(() => {
        message.success(`Đã gửi email thử nghiệm đến ${values.testEmail}`);
      }, 2500);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCreateBackup = () => {
    message.loading('Đang tạo bản sao lưu...', 2.5);
    
    // Giả lập tạo bản sao lưu
    setTimeout(() => {
      const newBackup = {
        id: backupHistory.length + 1,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        size: '42.7 MB',
        type: 'Thủ công',
        status: 'success'
      };
      
      setBackupHistory([newBackup, ...backupHistory]);
      message.success('Tạo bản sao lưu thành công');
    }, 2500);
  };

  const handleRestoreBackup = (id) => {
    message.loading('Đang khôi phục dữ liệu...', 3);
    
    // Giả lập khôi phục dữ liệu
    setTimeout(() => {
      message.success('Khôi phục dữ liệu thành công');
    }, 3000);
  };

  const backupColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        text === 'Tự động' ? 
          <Tag color="blue">Tự động</Tag> : 
          <Tag color="green">Thủ công</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        text === 'success' ? 
          <Tag color="success">Thành công</Tag> : 
          <Tag color="error">Thất bại</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => message.success(`Đang tải xuống bản sao lưu #${record.id}`)}
          >
            Tải xuống
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn khôi phục dữ liệu từ bản sao lưu này?"
            onConfirm={() => handleRestoreBackup(record.id)}
            okText="Khôi phục"
            cancelText="Hủy"
          >
            <Button 
              type="link" 
              size="small"
              danger
            >
              Khôi phục
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>Đang tải cấu hình...</div>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Cấu hình hệ thống</Title>
      <Text type="secondary">Quản lý các cài đặt và cấu hình của hệ thống tuyển sinh</Text>
      
      <Divider />
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              Cấu hình chung
            </span>
          } 
          key="1"
        >
          <Card>
            <Form
              form={generalForm}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="siteName"
                    label="Tên hệ thống"
                    rules={[{ required: true, message: 'Vui lòng nhập tên hệ thống' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="adminEmail"
                    label="Email quản trị"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email quản trị' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="siteDescription"
                label="Mô tả hệ thống"
              >
                <Input.TextArea rows={3} />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="supportPhone"
                    label="Số điện thoại hỗ trợ"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxFileSize"
                    label="Kích thước tệp tối đa (MB)"
                    rules={[{ required: true, message: 'Vui lòng nhập kích thước tệp tối đa' }]}
                  >
                    <InputNumber min={1} max={50} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="allowedFileTypes"
                label="Định dạng tệp cho phép"
                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một định dạng tệp' }]}
              >
                <Select mode="multiple" placeholder="Chọn định dạng tệp">
                  <Option value="pdf">PDF</Option>
                  <Option value="jpg">JPG</Option>
                  <Option value="png">PNG</Option>
                  <Option value="doc">DOC</Option>
                  <Option value="docx">DOCX</Option>
                  <Option value="xls">XLS</Option>
                  <Option value="xlsx">XLSX</Option>
                </Select>
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="defaultLanguage"
                    label="Ngôn ngữ mặc định"
                    rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ mặc định' }]}
                  >
                    <Select>
                      <Option value="vi">Tiếng Việt</Option>
                      <Option value="en">Tiếng Anh</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="timezone"
                    label="Múi giờ"
                    rules={[{ required: true, message: 'Vui lòng chọn múi giờ' }]}
                  >
                    <Select>
                      <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</Option>
                      <Option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</Option>
                      <Option value="Asia/Singapore">Asia/Singapore (GMT+8)</Option>
                      <Option value="UTC">UTC</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="maintenanceMode"
                label="Chế độ bảo trì"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveGeneral}
                    loading={saveLoading}
                  >
                    Lưu cấu hình
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => generalForm.resetFields()}
                  >
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BellOutlined />
              Thông báo
            </span>
          } 
          key="2"
        >
          <Card>
            <Form
              form={notificationForm}
              layout="vertical"
            >
              <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
                <Panel header="Kênh thông báo" key="1">
                  <Form.Item
                    name="enableEmailNotifications"
                    label="Thông báo qua email"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="enableSmsNotifications"
                    label="Thông báo qua SMS"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="enableBrowserNotifications"
                    label="Thông báo trên trình duyệt"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Panel>
                
                <Panel header="Sự kiện thông báo" key="2">
                  <Form.Item
                    name="notifyOnNewApplication"
                    label="Thông báo khi có hồ sơ mới"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="notifyOnStatusChange"
                    label="Thông báo khi thay đổi trạng thái hồ sơ"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="notifyOnDeadlineApproaching"
                    label="Thông báo khi gần đến hạn"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="reminderDays"
                    label="Số ngày thông báo trước hạn"
                    rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
                  >
                    <InputNumber min={1} max={30} style={{ width: '100%' }} />
                  </Form.Item>
                </Panel>
                
                <Panel header="Báo cáo tổng hợp" key="3">
                  <Form.Item
                    name="dailySummary"
                    label="Báo cáo tổng hợp hàng ngày"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="summaryTime"
                    label="Thời gian gửi báo cáo"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </Panel>
              </Collapse>
              
              <Divider />
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveNotifications}
                    loading={saveLoading}
                  >
                    Lưu cấu hình
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => notificationForm.resetFields()}
                  >
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <LockOutlined />
              Bảo mật
            </span>
          } 
          key="3"
        >
          <Card>
            <Form
              form={securityForm}
              layout="vertical"
            >
              <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
                <Panel header="Chính sách mật khẩu" key="1">
                  <Form.Item
                    name="passwordMinLength"
                    label="Độ dài tối thiểu của mật khẩu"
                    rules={[{ required: true, message: 'Vui lòng nhập độ dài tối thiểu' }]}
                  >
                    <InputNumber min={6} max={20} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item
                    name="passwordRequireUppercase"
                    label="Yêu cầu ít nhất một chữ hoa"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="passwordRequireNumbers"
                    label="Yêu cầu ít nhất một chữ số"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="passwordRequireSpecial"
                    label="Yêu cầu ít nhất một ký tự đặc biệt"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Panel>
                
                <Panel header="Phiên đăng nhập" key="2">
                  <Form.Item
                    name="sessionTimeout"
                    label="Thời gian hết hạn phiên (phút)"
                    rules={[{ required: true, message: 'Vui lòng nhập thời gian hết hạn phiên' }]}
                  >
                    <InputNumber min={5} max={120} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item
                    name="maxLoginAttempts"
                    label="Số lần đăng nhập thất bại tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập số lần đăng nhập thất bại tối đa' }]}
                  >
                    <InputNumber min={3} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item
                    name="lockoutDuration"
                    label="Thời gian khóa tài khoản (phút)"
                    rules={[{ required: true, message: 'Vui lòng nhập thời gian khóa tài khoản' }]}
                  >
                    <InputNumber min={5} max={60} style={{ width: '100%' }} />
                  </Form.Item>
                </Panel>
                
                <Panel header="Xác thực" key="3">
                  <Form.Item
                    name="enableTwoFactor"
                    label="Bật xác thực hai yếu tố"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="enableCaptcha"
                    label="Bật CAPTCHA cho đăng nhập"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="ipWhitelist"
                    label="Danh sách IP được phép (mỗi IP một dòng)"
                  >
                    <Input.TextArea rows={4} placeholder="Để trống nếu cho phép tất cả IP" />
                  </Form.Item>
                </Panel>
                
                <Panel header="Nhật ký hệ thống" key="4">
                  <Form.Item
                    name="enableAuditLog"
                    label="Bật nhật ký kiểm toán"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Panel>
              </Collapse>
              
              <Divider />
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveSecurity}
                    loading={saveLoading}
                  >
                    Lưu cấu hình
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => securityForm.resetFields()}
                  >
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <MailOutlined />
              Email
            </span>
          } 
          key="4"
        >
          <Card>
            <Form
              form={emailForm}
              layout="vertical"
            >
              <Alert
                message="Cấu hình SMTP"
                description="Cấu hình máy chủ SMTP để gửi email từ hệ thống."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />
              
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    name="smtpServer"
                    label="Máy chủ SMTP"
                    rules={[{ required: true, message: 'Vui lòng nhập máy chủ SMTP' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="smtpPort"
                    label="Cổng SMTP"
                    rules={[{ required: true, message: 'Vui lòng nhập cổng SMTP' }]}
                  >
                    <InputNumber min={1} max={65535} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="smtpUsername"
                    label="Tên đăng nhập SMTP"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập SMTP' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="smtpPassword"
                    label="Mật khẩu SMTP"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu SMTP' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="smtpEncryption"
                label="Mã hóa SMTP"
                rules={[{ required: true, message: 'Vui lòng chọn loại mã hóa' }]}
              >
                <Select>
                  <Option value="none">Không mã hóa</Option>
                  <Option value="ssl">SSL</Option>
                  <Option value="tls">TLS</Option>
                </Select>
              </Form.Item>
              
              <Divider />
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="senderName"
                    label="Tên người gửi"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người gửi' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="senderEmail"
                    label="Email người gửi"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email người gửi' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="emailFooter"
                label="Chân trang email"
              >
                <Input.TextArea rows={3} />
              </Form.Item>
              
              <Divider />
              
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    name="testEmail"
                    label="Email thử nghiệm"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email thử nghiệm' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="Nhập email để kiểm tra cấu hình" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label=" " colon={false}>
                    <Button 
                      type="default" 
                      onClick={handleTestEmail}
                      style={{ marginTop: '5px' }}
                    >
                      Gửi email thử nghiệm
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveEmail}
                    loading={saveLoading}
                  >
                    Lưu cấu hình
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => emailForm.resetFields()}
                  >
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CalendarOutlined />
              Lịch trình
            </span>
          } 
          key="5"
        >
          <Card>
            <Form
              form={scheduleForm}
              layout="vertical"
            >
              <Alert
                message="Cấu hình lịch trình tuyển sinh"
                description="Thiết lập thời gian cho các giai đoạn trong quy trình tuyển sinh."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />
              
              <Form.Item
                name="registrationPeriod"
                label="Thời gian đăng ký"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian đăng ký' }]}
              >
                <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              
              <Form.Item
                name="evaluationPeriod"
                label="Thời gian xét tuyển"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian xét tuyển' }]}
              >
                <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              
              <Form.Item
                name="resultAnnouncementDate"
                label="Ngày công bố kết quả"
                rules={[{ required: true, message: 'Vui lòng chọn ngày công bố kết quả' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              
              <Form.Item
                name="confirmationDeadline"
                label="Hạn xác nhận nhập học"
                rules={[{ required: true, message: 'Vui lòng chọn hạn xác nhận nhập học' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              
              <Form.Item
                name="enrollmentPeriod"
                label="Thời gian nhập học"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian nhập học' }]}
              >
                <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              
              <Form.Item
                name="academicYearStart"
                label="Ngày bắt đầu năm học"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu năm học' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveSchedule}
                    loading={saveLoading}
                  >
                    Lưu cấu hình
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => scheduleForm.resetFields()}
                  >
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <DatabaseOutlined />
              Sao lưu & Phục hồi
            </span>
          } 
          key="6"
        >
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleCreateBackup}
              >
                Tạo bản sao lưu mới
              </Button>
              <Upload>
                <Button icon={<UploadOutlined />}>Tải lên bản sao lưu</Button>
              </Upload>
            </Space>
            
            <Divider />
            
            <Table
              columns={backupColumns}
              dataSource={backupHistory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <GlobalOutlined />
              Tích hợp
            </span>
          } 
          key="7"
        >
          <Card>
            <Alert
              message="Tích hợp với các dịch vụ bên ngoài"
              description="Trang này đang được phát triển. Sẽ hỗ trợ tích hợp với các dịch vụ như Google Analytics, Facebook, Zalo, v.v."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Paragraph>
              Chức năng tích hợp sẽ được cập nhật trong phiên bản tiếp theo.
            </Paragraph>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ConfigManager;

import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Divider, Steps, Button, Space, 
  Select, DatePicker, InputNumber, Form, Modal,
  Table, Tag, Statistic, Row, Col, Alert, Tabs,
  Progress, message
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  FileSearchOutlined,
  FileDoneOutlined,
  CalculatorOutlined,
  NotificationOutlined,
  ExportOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

const API_URL = 'http://localhost:3000/api';
const ADMIN_TOKEN = localStorage.getItem('adminToken') || 'admin-token';

const XetTuyenManager = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [namTuyenSinh, setNamTuyenSinh] = useState(2025);
  const [dotXetTuyen, setDotXetTuyen] = useState(1);
  const [xetTuyenForm] = Form.useForm();
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [ketQuaXetTuyen, setKetQuaXetTuyen] = useState([]);
  const [ketQuaTrungTuyen, setKetQuaTrungTuyen] = useState([]);
  const [thongKe, setThongKe] = useState({
    tongHoSo: 0,
    daXetTuyen: 0,
    trungTuyen: 0,
    khongTrungTuyen: 0
  });
  
  useEffect(() => {
    fetchKetQuaXetTuyen();
    fetchKetQuaTrungTuyen();
  }, [namTuyenSinh, dotXetTuyen]);

  const fetchKetQuaXetTuyen = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/ket-qua-xet-tuyen`, {
        params: { namTuyenSinh, dotXetTuyen },
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      
      setKetQuaXetTuyen(response.data);
      
      // Tính toán thống kê
      const tongHoSo = response.data.length;
      const daXetTuyen = response.data.length;
      const trungTuyen = response.data.filter(item => 
        item.soLuongTrungTuyen > 0
      ).length;
      const khongTrungTuyen = tongHoSo - trungTuyen;
      
      setThongKe({
        tongHoSo,
        daXetTuyen,
        trungTuyen,
        khongTrungTuyen
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ket qua xet tuyen:', error);
      message.error('Không thể tải dữ liệu kết quả xét tuyển');
      setLoading(false);
    }
  };

  const fetchKetQuaTrungTuyen = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/ket-qua-trung-tuyen`, {
        params: { namTuyenSinh, dotXetTuyen },
        headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
      });
      
      setKetQuaTrungTuyen(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ket qua trung tuyen:', error);
      message.error('Không thể tải dữ liệu kết quả trúng tuyển');
      setLoading(false);
    }
  };

  const showConfirm = (action) => {
    setModalAction(action);
    setConfirmModal(true);
  };

  const handleConfirm = async () => {
    setConfirmModal(false);
    setLoading(true);
    
    try {
      if (modalAction === 'xet-tuyen') {
        const response = await axios.post(`${API_URL}/admin/xet-tuyen`, 
          { namTuyenSinh, dotXetTuyen },
          { headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` } }
        );
        
        message.success('Xét tuyển thành công');
        setCurrentStep(1);
        fetchKetQuaXetTuyen();
      } else if (modalAction === 'xet-nguyen-vong') {
        const response = await axios.post(`${API_URL}/admin/xet-nguyen-vong`, 
          { namTuyenSinh, dotXetTuyen },
          { headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` } }
        );
        
        message.success('Xét nguyện vọng thành công');
        setCurrentStep(2);
        fetchKetQuaTrungTuyen();
      } else if (modalAction === 'cong-bo') {
        const response = await axios.post(`${API_URL}/admin/cong-bo-ket-qua`, 
          { namTuyenSinh, dotXetTuyen },
          { headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` } }
        );
        
        message.success('Công bố kết quả thành công');
        setCurrentStep(3);
        fetchKetQuaTrungTuyen();
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const columnsKetQuaXetTuyen = [
    {
      title: 'Ngành',
      dataIndex: 'tenNganh',
      key: 'tenNganh',
    },
    {
      title: 'Trường',
      dataIndex: 'tenTruong',
      key: 'tenTruong',
    },
    {
      title: 'Phương thức',
      dataIndex: 'phuongThuc',
      key: 'phuongThuc',
      filters: [
        { text: 'THPT', value: 'thpt' },
        { text: 'HSA', value: 'hsa' },
        { text: 'TSA', value: 'tsa' },
        { text: 'ĐGNL', value: 'dgnl' },
        { text: 'XTHB', value: 'xthb' },
      ],
      onFilter: (value, record) => record.phuongThuc === value,
      render: (text) => {
        const phuongThucMap = {
          'thpt': 'THPT',
          'hsa': 'HSA',
          'tsa': 'TSA',
          'dgnl': 'ĐGNL',
          'xthb': 'XTHB'
        };
        return phuongThucMap[text] || text;
      }
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'chiTieu',
      key: 'chiTieu',
      sorter: (a, b) => a.chiTieu - b.chiTieu,
    },
    {
      title: 'Số lượng trúng tuyển',
      dataIndex: 'soLuongTrungTuyen',
      key: 'soLuongTrungTuyen',
      sorter: (a, b) => a.soLuongTrungTuyen - b.soLuongTrungTuyen,
    },
    {
      title: 'Điểm chuẩn',
      dataIndex: 'diemChuan',
      key: 'diemChuan',
      sorter: (a, b) => a.diemChuan - b.diemChuan,
    },
    {
      title: 'Ngày xét tuyển',
      dataIndex: 'ngayXetTuyen',
      key: 'ngayXetTuyen',
      render: (text) => text ? moment(text).format('DD/MM/YYYY') : '',
    }
  ];

  const columnsKetQuaTrungTuyen = [
    {
      title: 'Thí sinh',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (_, record) => (
        <div>
          <div>{record.hoTen}</div>
          <div><small>ID: {record.profileId}</small></div>
        </div>
      )
    },
    {
      title: 'Ngành trúng tuyển',
      dataIndex: 'tenNganh',
      key: 'tenNganh',
    },
    {
      title: 'Trường',
      dataIndex: 'tenTruong',
      key: 'tenTruong',
    },
    {
      title: 'Phương thức',
      dataIndex: 'phuongThuc',
      key: 'phuongThuc',
      render: (text) => {
        const phuongThucMap = {
          'thpt': 'THPT',
          'hsa': 'HSA',
          'tsa': 'TSA',
          'dgnl': 'ĐGNL',
          'xthb': 'XTHB'
        };
        return phuongThucMap[text] || text;
      }
    },
    {
      title: 'Nguyện vọng',
      dataIndex: 'nguyenVong',
      key: 'nguyenVong',
    },
    {
      title: 'Công bố',
      dataIndex: 'congBo',
      key: 'congBo',
      render: (congBo) => {
        if (congBo) {
          return <Tag color="success">Đã công bố</Tag>;
        } else {
          return <Tag color="default">Chưa công bố</Tag>;
        }
      },
      filters: [
        { text: 'Đã công bố', value: true },
        { text: 'Chưa công bố', value: false },
      ],
      onFilter: (value, record) => record.congBo === value,
    },
    {
      title: 'Xác nhận nhập học',
      dataIndex: 'xacNhanNhapHoc',
      key: 'xacNhanNhapHoc',
      render: (xacNhan) => {
        if (xacNhan) {
          return <Tag color="success">Đã xác nhận</Tag>;
        } else {
          return <Tag color="default">Chưa xác nhận</Tag>;
        }
      },
      filters: [
        { text: 'Đã xác nhận', value: true },
        { text: 'Chưa xác nhận', value: false },
      ],
      onFilter: (value, record) => record.xacNhanNhapHoc === value,
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title="Xét tuyển">
            <Form 
              form={xetTuyenForm}
              layout="vertical"
              initialValues={{
                namTuyenSinh: 2025,
                dotXetTuyen: 1,
                ngayBatDau: moment(),
                ngayKetThuc: moment().add(30, 'days'),
                diemSanToiThieu: {
                  thpt: 18,
                  hsa: 7.5,
                  dgnl: 650
                }
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="namTuyenSinh"
                    label="Năm tuyển sinh"
                    rules={[{ required: true, message: 'Vui lòng chọn năm tuyển sinh' }]}
                  >
                    <Select onChange={value => setNamTuyenSinh(value)}>
                      <Option value={2025}>2025</Option>
                      <Option value={2024}>2024</Option>
                      <Option value={2023}>2023</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="dotXetTuyen"
                    label="Đợt xét tuyển"
                    rules={[{ required: true, message: 'Vui lòng chọn đợt xét tuyển' }]}
                  >
                    <Select onChange={value => setDotXetTuyen(value)}>
                      <Option value={1}>Đợt 1</Option>
                      <Option value={2}>Đợt 2</Option>
                      <Option value={3}>Đợt 3</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="ngayBatDau"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="ngayKetThuc"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">Điểm sàn tối thiểu</Divider>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name={['diemSanToiThieu', 'thpt']}
                    label="Điểm sàn THPT"
                  >
                    <InputNumber min={0} max={30} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={['diemSanToiThieu', 'hsa']}
                    label="Điểm sàn HSA"
                  >
                    <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={['diemSanToiThieu', 'dgnl']}
                    label="Điểm sàn ĐGNL"
                  >
                    <InputNumber min={0} max={1000} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <div style={{ textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => showConfirm('xet-tuyen')}
                  loading={loading}
                >
                  Bắt đầu xét tuyển
                </Button>
              </div>
            </Form>
          </Card>
        );
      
      case 1:
        return (
          <Card title="Kết quả xét tuyển">
            <Alert
              message="Xét tuyển đã hoàn tất"
              description="Hệ thống đã hoàn tất việc xét tuyển cho tất cả hồ sơ. Bạn có thể tiếp tục xét nguyện vọng."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Statistic 
                  title="Tổng số hồ sơ" 
                  value={thongKe.tongHoSo} 
                  prefix={<FileSearchOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đã xét tuyển" 
                  value={thongKe.daXetTuyen} 
                  prefix={<FileDoneOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đủ điều kiện" 
                  value={thongKe.trungTuyen} 
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CheckCircleOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Không đủ điều kiện" 
                  value={thongKe.khongTrungTuyen} 
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<CloseCircleOutlined />} 
                />
              </Col>
            </Row>
            
            <Tabs defaultActiveKey="1">
              <TabPane tab="Kết quả xét tuyển" key="1">
                <Table 
                  columns={columnsKetQuaXetTuyen} 
                  dataSource={ketQuaXetTuyen}
                  rowKey="_id"
                  loading={loading}
                />
              </TabPane>
              <TabPane tab="Thống kê" key="2">
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <Text>Chức năng thống kê đang được phát triển</Text>
                </div>
              </TabPane>
            </Tabs>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button 
                  icon={<ExportOutlined />}
                  onClick={() => message.info('Chức năng xuất kết quả đang được phát triển')}
                >
                  Xuất kết quả
                </Button>
                
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => showConfirm('xet-nguyen-vong')}
                  loading={loading}
                >
                  Tiếp tục xét nguyện vọng
                </Button>
              </Space>
            </div>
          </Card>
        );
      
      case 2:
        return (
          <Card title="Kết quả xét nguyện vọng">
            <Alert
              message="Xét nguyện vọng đã hoàn tất"
              description="Hệ thống đã hoàn tất việc xét nguyện vọng. Bạn có thể tiến hành công bố kết quả trúng tuyển."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Statistic 
                  title="Tổng hồ sơ đủ điều kiện" 
                  value={thongKe.trungTuyen} 
                  prefix={<FileSearchOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Trúng tuyển" 
                  value={ketQuaTrungTuyen.length} 
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CheckCircleOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đã công bố" 
                  value={ketQuaTrungTuyen.filter(item => item.congBo).length} 
                  valueStyle={{ color: '#faad14' }}
                  prefix={<CalculatorOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Tỷ lệ trúng tuyển" 
                  value={thongKe.trungTuyen ? Math.round(ketQuaTrungTuyen.length / thongKe.trungTuyen * 100) : 0} 
                  suffix="%" 
                />
              </Col>
            </Row>
            
            <Tabs defaultActiveKey="1">
              <TabPane tab="Kết quả trúng tuyển" key="1">
                <Table 
                  columns={columnsKetQuaTrungTuyen.filter(col => col.dataIndex !== 'xacNhanNhapHoc')} 
                  dataSource={ketQuaTrungTuyen}
                  rowKey="_id"
                  loading={loading}
                />
              </TabPane>
              <TabPane tab="Thống kê ngành" key="2">
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <Text>Chức năng thống kê ngành đang được phát triển</Text>
                </div>
              </TabPane>
            </Tabs>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button 
                  icon={<ExportOutlined />}
                  onClick={() => message.info('Chức năng xuất kết quả đang được phát triển')}
                >
                  Xuất kết quả
                </Button>
                
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => showConfirm('cong-bo')}
                  loading={loading}
                >
                  Công bố kết quả trúng tuyển
                </Button>
              </Space>
            </div>
          </Card>
        );

      case 3:
        return (
          <Card title="Công bố kết quả trúng tuyển">
            <Alert
              message="Đã công bố kết quả trúng tuyển"
              description="Hệ thống đã công bố kết quả trúng tuyển. Thí sinh có thể xem kết quả và xác nhận nhập học."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Statistic 
                  title="Tổng trúng tuyển" 
                  value={ketQuaTrungTuyen.filter(item => item.congBo).length} 
                  prefix={<CheckCircleOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Đã xác nhận nhập học" 
                  value={ketQuaTrungTuyen.filter(item => item.xacNhanNhapHoc).length} 
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<FileDoneOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Chưa xác nhận" 
                  value={ketQuaTrungTuyen.filter(item => item.congBo && !item.xacNhanNhapHoc).length} 
                  valueStyle={{ color: '#faad14' }}
                  prefix={<NotificationOutlined />} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Tỷ lệ xác nhận" 
                  value={
                    ketQuaTrungTuyen.filter(item => item.congBo).length > 0 
                      ? Math.round(ketQuaTrungTuyen.filter(item => item.xacNhanNhapHoc).length / ketQuaTrungTuyen.filter(item => item.congBo).length * 100) 
                      : 0
                  } 
                  suffix="%" 
                />
              </Col>
            </Row>
            
            <Tabs defaultActiveKey="1">
              <TabPane tab="Danh sách trúng tuyển" key="1">
                <Table 
                  columns={columnsKetQuaTrungTuyen} 
                  dataSource={ketQuaTrungTuyen}
                  rowKey="_id"
                  loading={loading}
                />
              </TabPane>
              <TabPane tab="Thống kê xác nhận" key="2">
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <Text>Chức năng thống kê xác nhận đang được phát triển</Text>
                </div>
              </TabPane>
            </Tabs>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button 
                  icon={<ExportOutlined />}
                  onClick={() => message.info('Chức năng xuất danh sách đang được phát triển')}
                >
                  Xuất danh sách
                </Button>
                
                <Button 
                  type="primary"
                  onClick={() => message.info('Chức năng gửi thông báo đang được phát triển')}
                >
                  Gửi thông báo nhắc nhở
                </Button>
              </Space>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Title level={2}>Quản lý Xét tuyển</Title>
      <Text type="secondary">Quản lý quy trình xét tuyển, xét nguyện vọng và công bố kết quả</Text>
      
      <Divider />
      
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Xét tuyển" icon={currentStep === 0 && loading ? <LoadingOutlined /> : null} />
        <Step title="Kết quả xét tuyển" icon={currentStep === 1 && loading ? <LoadingOutlined /> : null} />
        <Step title="Xét nguyện vọng" icon={currentStep === 2 && loading ? <LoadingOutlined /> : null} />
        <Step title="Công bố kết quả" icon={currentStep === 3 && loading ? <LoadingOutlined /> : null} />
      </Steps>
      
      {renderStepContent()}
      
      <Modal
        title="Xác nhận"
        visible={confirmModal}
        onOk={handleConfirm}
        onCancel={() => setConfirmModal(false)}
        confirmLoading={loading}
      >
        {modalAction === 'xet-tuyen' && (
          <p>Bạn có chắc chắn muốn bắt đầu quá trình xét tuyển cho đợt {dotXetTuyen} năm {namTuyenSinh}?</p>
        )}
        {modalAction === 'xet-nguyen-vong' && (
          <p>Bạn có chắc chắn muốn tiến hành xét nguyện vọng cho đợt {dotXetTuyen} năm {namTuyenSinh}?</p>
        )}
        {modalAction === 'cong-bo' && (
          <p>Bạn có chắc chắn muốn công bố kết quả trúng tuyển cho đợt {dotXetTuyen} năm {namTuyenSinh}?</p>
        )}
      </Modal>
    </div>
  );
};

export default XetTuyenManager;

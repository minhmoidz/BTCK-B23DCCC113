import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  Table,
  message,
  Space,
  Statistic,
  Row,
  Col,
  Modal,
  Typography,
  Spin,
  Tag,
  Divider,
  InputNumber,
  Tabs,
  Alert,
  notification
} from 'antd';
import {
  PlayCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  SaveOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface School {
  id: string;
  name: string;
}

interface Major {
  id: string;
  name: string;
}

interface AdmissionQuota {
  schoolId: string;
  majorId: string;
  academicYear: number;
  totalQuota: number;
  quotaByMethod: {
    thpt: number;
    hsa: number;
    tsa: number;
    dgnl: number;
    xthb: number;
  };
}

// Cập nhật interface cho kết quả xét tuyển
interface AdmissionResult {
  method: string;
  quota: number;
  totalProfiles: number;
  selectedProfiles: Array<{
    profileId: string;
    maHoSo: string;
    hoTen: string;
    score: number;
  }>;
  error?: string;
}

interface AdmissionSummary {
  totalProcessed: number;
  totalAccepted: number;
  notificationsSent: number;
}

const AdmissionManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [quotaForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [quotas, setQuotas] = useState<AdmissionQuota[]>([]);
  
  // Cập nhật state cho kết quả xét tuyển
  const [admissionResults, setAdmissionResults] = useState<AdmissionResult[]>([]);
  const [admissionSummary, setAdmissionSummary] = useState<AdmissionSummary | null>(null);
  
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [processLoading, setProcessLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Load danh sách trường
  useEffect(() => {
    fetchSchools();
  }, []);

  // Load danh sách ngành khi chọn trường
  useEffect(() => {
    if (selectedSchool) {
      fetchMajors(selectedSchool);
    }
  }, [selectedSchool]);

  const fetchSchools = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/truong', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      message.error('Không thể tải danh sách trường');
    }
  };

  const fetchMajors = async (schoolId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/nganh/${schoolId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setMajors(data);
    } catch (error) {
      message.error('Không thể tải danh sách ngành');
    }
  };

  const fetchQuotas = async (schoolId: string, majorId: string, academicYear: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/admin/admission-quotas?schoolId=${schoolId}&majorId=${majorId}&academicYear=${academicYear}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setQuotas([data]);
      } else {
        setQuotas([]);
        if (response.status !== 404) {
          message.error('Không thể tải thông tin chỉ tiêu');
        }
      }
    } catch (error) {
      message.error('Không thể tải thông tin chỉ tiêu');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật hàm xử lý xét tuyển
  const handleProcessAdmission = async () => {
    try {
      const values = await form.validateFields();
      
      // Kiểm tra có chỉ tiêu chưa
      if (quotas.length === 0) {
        message.warning('Vui lòng cấu hình chỉ tiêu trước khi xét tuyển!');
        setActiveTab('2');
        return;
      }

      confirm({
        title: 'Xác nhận chạy xét tuyển',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>Bạn có chắc chắn muốn chạy xét tuyển cho:</p>
            <ul>
              <li><strong>Trường:</strong> {schools.find(s => s.id === values.schoolId)?.name}</li>
              <li><strong>Ngành:</strong> {majors.find(m => m.id === values.majorId)?.name}</li>
              <li><strong>Năm học:</strong> {values.academicYear}</li>
            </ul>
            <Alert 
              message="Lưu ý: Quá trình này sẽ tự động lọc hồ sơ và gửi thông báo kết quả." 
              type="warning" 
              showIcon 
              style={{ marginTop: 16 }}
            />
          </div>
        ),
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: () => executeAdmissionProcess(values),
        width: 500,
      });
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const executeAdmissionProcess = async (values: any) => {
    try {
      setProcessLoading(true);

      notification.info({
        message: 'Bắt đầu xét tuyển',
        description: 'Hệ thống đang thực hiện xét tuyển và gửi thông báo...',
        duration: 3,
      });

      const response = await fetch('http://localhost:3000/api/admin/process-admission-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolId: values.schoolId,
          majorId: values.majorId,
          academicYear: values.academicYear
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Cập nhật kết quả xét tuyển
          setAdmissionResults(result.results || []);
          setAdmissionSummary(result.summary);
          
          notification.success({
            message: 'Xét tuyển hoàn thành!',
            description: `Đã xử lý ${result.summary.totalProcessed} hồ sơ, ${result.summary.totalAccepted} hồ sơ trúng tuyển`,
            duration: 5,
          });

          // Chuyển sang tab kết quả
          setActiveTab('3');
        } else {
          message.error(result.error || 'Có lỗi xảy ra khi thực hiện xét tuyển');
        }
        
        // Refresh quota data
        fetchQuotas(values.schoolId, values.majorId, values.academicYear);
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Có lỗi xảy ra khi thực hiện xét tuyển');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra khi thực hiện xét tuyển');
    } finally {
      setProcessLoading(false);
    }
  };

  const handleViewQuotas = async () => {
    try {
      const values = await form.validateFields();
      fetchQuotas(values.schoolId, values.majorId, values.academicYear);
      setActiveTab('2');
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleEditQuota = () => {
    if (quotas.length > 0) {
      const quota = quotas[0];
      quotaForm.setFieldsValue({
        totalQuota: quota.totalQuota,
        ...quota.quotaByMethod
      });
      setEditModalVisible(true);
    }
  };

  const handleSaveQuota = async () => {
    try {
      const values = await quotaForm.validateFields();
      const formValues = await form.validateFields();
      
      // Validation tổng chỉ tiêu
      const totalMethodQuota = (values.thpt || 0) + (values.hsa || 0) + (values.tsa || 0) + (values.dgnl || 0) + (values.xthb || 0);
      if (totalMethodQuota !== values.totalQuota) {
        message.error(`Tổng chỉ tiêu các phương thức (${totalMethodQuota}) phải bằng tổng chỉ tiêu (${values.totalQuota})`);
        return;
      }
      
      const quotaData = {
        schoolId: formValues.schoolId,
        majorId: formValues.majorId,
        academicYear: formValues.academicYear,
        totalQuota: values.totalQuota,
        quotaByMethod: {
          thpt: values.thpt || 0,
          hsa: values.hsa || 0,
          tsa: values.tsa || 0,
          dgnl: values.dgnl || 0,
          xthb: values.xthb || 0
        }
      };

      const response = await fetch('http://localhost:3000/api/admin/admission-quotas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotaData)
      });

      if (response.ok) {
        message.success('Cập nhật chỉ tiêu thành công!');
        setEditModalVisible(false);
        fetchQuotas(formValues.schoolId, formValues.majorId, formValues.academicYear);
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Có lỗi xảy ra khi cập nhật chỉ tiêu');
      }
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const quotaColumns = [
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const methodNames: { [key: string]: string } = {
          thpt: 'Điểm thi THPT',
          hsa: 'Học bạ',
          tsa: 'Xét tuyển thẳng',
          dgnl: 'Đánh giá năng lực',
          xthb: 'Xét tuyển kết hợp'
        };
        return <Tag color="blue">{methodNames[method] || method}</Tag>;
      }
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      render: (quota: number) => <Text strong>{quota}</Text>
    }
  ];

  // Cập nhật columns cho bảng kết quả
  const resultColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => <Text strong>{index + 1}</Text>
    },
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      key: 'maHoSo',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (name: string) => <Text strong>{name}</Text>
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => <Tag color="green">{score?.toFixed(2) || '0.00'}</Tag>
    }
  ];

  const getQuotaTableData = (quota: AdmissionQuota) => {
    if (!quota) return [];
    
    return Object.entries(quota.quotaByMethod).map(([method, value]) => ({
      key: method,
      method,
      quota: value
    }));
  };

  const methodNames = {
    thpt: 'Điểm thi THPT',
    hsa: 'Học bạ',
    tsa: 'Xét tuyển thẳng',
    dgnl: 'Đánh giá năng lực',
    xthb: 'Xét tuyển kết hợp'
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🎓 Quản lý Xét tuyển</Title>
      
      <Card title="Thông tin xét tuyển" extra={<ReloadOutlined onClick={() => window.location.reload()} />}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ academicYear: 2025 }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="schoolId"
                label="Trường"
                rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
              >
                <Select
                  placeholder="Chọn trường"
                  onChange={(value) => {
                    setSelectedSchool(value);
                    setSelectedMajor('');
                    form.setFieldsValue({ majorId: undefined });
                    setQuotas([]);
                    setAdmissionResults([]);
                    setAdmissionSummary(null);
                  }}
                >
                  {schools.map(school => (
                    <Option key={school.id} value={school.id}>
                      {school.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="majorId"
                label="Ngành"
                rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
              >
                <Select
                  placeholder="Chọn ngành"
                  disabled={!selectedSchool}
                  onChange={(value) => {
                    setSelectedMajor(value);
                    setQuotas([]);
                    setAdmissionResults([]);
                    setAdmissionSummary(null);
                  }}
                >
                  {majors.map(major => (
                    <Option key={major.id} value={major.id}>
                      {major.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="academicYear"
                label="Năm học"
                rules={[{ required: true, message: 'Vui lòng chọn năm học' }]}
              >
                <Select placeholder="Chọn năm học">
                  <Option value={2024}>2024</Option>
                  <Option value={2025}>2025</Option>
                  <Option value={2026}>2026</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Space size="middle">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleProcessAdmission}
              loading={processLoading}
              size="large"
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              🚀 Thực hiện xét tuyển
            </Button>
            
            <Button
              icon={<EyeOutlined />}
              onClick={handleViewQuotas}
              loading={loading}
              size="large"
            >
              Xem chỉ tiêu
            </Button>
          </Space>
        </Form>
      </Card>

      <div style={{ marginTop: 24 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin chung" key="1">
            <Card>
              <Text>Chọn trường và ngành để bắt đầu quy trình xét tuyển</Text>
            </Card>
          </TabPane>

          <TabPane tab={`Chỉ tiêu tuyển sinh ${quotas.length > 0 ? '✓' : ''}`} key="2">
            {quotas.length > 0 ? (
              <Card 
                title="Thông tin chỉ tiêu" 
                loading={loading}
                extra={
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={handleEditQuota}
                  >
                    Chỉnh sửa
                  </Button>
                }
              >
                {quotas.map((quota, index) => (
                  <div key={index}>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                      <Col span={6}>
                        <Statistic
                          title="Tổng chỉ tiêu"
                          value={quota.totalQuota}
                          valueStyle={{ color: '#3f8600' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Trường"
                          value={quota.schoolId}
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Ngành"
                          value={quota.majorId}
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Năm học"
                          value={quota.academicYear}
                          valueStyle={{ color: '#fa541c' }}
                        />
                      </Col>
                    </Row>

                    <Divider />

                    <Table
                      columns={quotaColumns}
                      dataSource={getQuotaTableData(quota)}
                      pagination={false}
                      size="small"
                      title={() => <Text strong>Chi tiết chỉ tiêu theo phương thức</Text>}
                    />
                  </div>
                ))}
              </Card>
            ) : (
              <Card>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">Chưa có chỉ tiêu. Vui lòng cấu hình chỉ tiêu trước.</Text>
                  <br />
                  <Button 
                    type="primary" 
                    style={{ marginTop: 16 }}
                    onClick={() => setEditModalVisible(true)}
                    disabled={!selectedSchool || !selectedMajor}
                  >
                    Tạo chỉ tiêu mới
                  </Button>
                </div>
              </Card>
            )}
          </TabPane>

          <TabPane 
            tab={
              <span>
                <UserOutlined />
                Kết quả xét tuyển {admissionSummary ? `(${admissionSummary.totalAccepted})` : ''}
              </span>
            } 
            key="3"
          >
            <Card title="📊 Kết quả xét tuyển">
              {admissionSummary ? (
                <>
                  <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                      <Statistic
                        title="Tổng hồ sơ xử lý"
                        value={admissionSummary.totalProcessed}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Hồ sơ trúng tuyển"
                        value={admissionSummary.totalAccepted}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Thông báo đã gửi"
                        value={admissionSummary.notificationsSent}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Tỷ lệ trúng tuyển"
                        value={admissionSummary.totalProcessed > 0 ? ((admissionSummary.totalAccepted / admissionSummary.totalProcessed) * 100).toFixed(1) : '0'}
                        suffix="%"
                        valueStyle={{ color: '#fa8c16' }}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  {admissionResults.map((result, index) => (
                    <div key={index} style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ color: '#1890ff' }}>
                        {methodNames[result.method as keyof typeof methodNames] || result.method}
                        <Tag color="blue" style={{ marginLeft: '12px', fontSize: '14px' }}>
                          {result.selectedProfiles?.length || 0}/{result.quota} chỉ tiêu
                        </Tag>
                        <Tag color={result.selectedProfiles?.length === result.quota ? 'green' : 'orange'}>
                          {result.selectedProfiles?.length === result.quota ? 'Đủ chỉ tiêu' : 'Thiếu chỉ tiêu'}
                        </Tag>
                        {result.error && (
                          <Tag color="red">Có lỗi</Tag>
                        )}
                      </Title>
                      
                      {result.error ? (
                        <Alert
                          message="Lỗi xét tuyển"
                          description={result.error}
                          type="error"
                          showIcon
                        />
                      ) : result.selectedProfiles && result.selectedProfiles.length > 0 ? (
                        <Table
                          columns={resultColumns}
                          dataSource={result.selectedProfiles}
                          rowKey="profileId"
                          pagination={{ 
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ trúng tuyển`
                          }}
                          size="small"
                          bordered
                        />
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px', background: '#fafafa' }}>
                          <Text type="secondary">Không có hồ sơ nào đủ điều kiện cho phương thức này</Text>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">Chưa có kết quả xét tuyển. Vui lòng thực hiện xét tuyển trước.</Text>
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* Modal chỉnh sửa chỉ tiêu */}
      <Modal
        title="Cấu hình chỉ tiêu tuyển sinh"
        visible={editModalVisible}
        onOk={handleSaveQuota}
        onCancel={() => setEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={quotaForm} layout="vertical">
          <Form.Item
            name="totalQuota"
            label="Tổng chỉ tiêu"
            rules={[{ required: true, message: 'Vui lòng nhập tổng chỉ tiêu' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="thpt"
                label="Điểm thi THPT"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hsa"
                label="Học bạ"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tsa"
                label="Xét tuyển thẳng"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dgnl"
                label="Đánh giá năng lực"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="xthb"
            label="Xét tuyển kết hợp"
            rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Alert
            message="Lưu ý"
            description="Tổng chỉ tiêu các phương thức phải bằng tổng chỉ tiêu"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default AdmissionManagement;

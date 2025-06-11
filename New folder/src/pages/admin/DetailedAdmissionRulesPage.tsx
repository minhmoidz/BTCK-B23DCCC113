import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  InputNumber,
  Row,
  Col,
  message,
  Tabs,
  Table,
  Tag,
  Space,
  Modal,
  Typography,
  Alert,
  Divider,
  Input,
  Spin,
  notification,
  List,
  Tooltip
} from 'antd';
import {
  SettingOutlined,
  EyeOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Interfaces
interface School {
  id: string;
  name: string;
}

interface Major {
  id: string;
  name: string;
}

interface SubjectWeight {
  [key: string]: number;
}

interface RequiredSubject {
  subject: string;
  minScore: number;
}

interface PrioritySubject {
  subject: string;
  weight: number;
  description: string;
}

interface GradeWeights {
  lop10: number;
  lop11: number;
  lop12: number;
}

interface THPTRules {
  minScore: number;
  formula: string;
  subjectWeights: SubjectWeight;
  requiredSubjects: RequiredSubject[];
}

interface HSARules {
  minScore: number;
  formula: string;
  prioritySubjects: PrioritySubject[];
  gradeWeights: GradeWeights;
}

interface AdmissionRules {
  thpt?: THPTRules;
  hsa?: HSARules;
  tsa?: any;
  dgnl?: any;
  xthb?: any;
}

interface PreviewResult {
  totalScore: number;
  details: {
    [key: string]: {
      originalScore: number;
      weight: number;
      weightedScore: number;
      description?: string;
    };
  };
  passedMinScore: boolean;
}

const DetailedAdmissionRulesPage: React.FC = () => {
  const [form] = Form.useForm();
  const [previewForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Data states
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [currentRules, setCurrentRules] = useState<AdmissionRules>({});
  const [previewResults, setPreviewResults] = useState<PreviewResult | null>(null);
  
  // UI states
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [activeMethod, setActiveMethod] = useState<string>('thpt');
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const methodNames = {
    thpt: 'Xét điểm thi THPT',
    hsa: 'Xét học bạ',
    tsa: 'Xét tài năng/năng khiếu',
    dgnl: 'Xét đánh giá năng lực',
    xthb: 'Xét tổng hợp'
  };

  const subjectNames = {
    toan: 'Toán',
    van: 'Văn',
    ly: 'Lý',
    hoa: 'Hóa',
    sinh: 'Sinh',
    su: 'Sử',
    dia: 'Địa',
    anhVan: 'Anh Văn'
  };

  // Load data on mount
  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      fetchMajors(selectedSchool);
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedSchool && selectedMajor && selectedYear) {
      loadCurrentRules();
    }
  }, [selectedSchool, selectedMajor, selectedYear]);

  // API calls
  const fetchSchools = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/truong');
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      message.error('Không thể tải danh sách trường');
    }
  };

  const fetchMajors = async (schoolId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/nganh/${schoolId}`);
      const data = await response.json();
      setMajors(data);
    } catch (error) {
      message.error('Không thể tải danh sách ngành');
    }
  };

  const loadCurrentRules = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/admin/admission-rules?schoolId=${selectedSchool}&majorId=${selectedMajor}&academicYear=${selectedYear}`
      );
      
      if (response.ok) {
        const rules = await response.json();
        if (rules && rules.length > 0) {
          setCurrentRules(rules[0].methods || {});
          // Set form values cho method hiện tại
          if (rules[0].methods[activeMethod]) {
            form.setFieldsValue(rules[0].methods[activeMethod]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRules = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const ruleData = {
        schoolId: selectedSchool,
        majorId: selectedMajor,
        academicYear: selectedYear,
        method: activeMethod,
        rules: values
      };

      const response = await fetch('http://localhost:3000/api/admin/admission-rules/detailed', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ruleData)
      });

      if (response.ok) {
        message.success(`Đã cập nhật quy tắc ${methodNames[activeMethod as keyof typeof methodNames]} thành công!`);
        await loadCurrentRules();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Có lỗi xảy ra khi cập nhật quy tắc');
      }
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewRules = async () => {
    try {
      const sampleData = await previewForm.validateFields();
      setPreviewLoading(true);

      const previewData = {
        schoolId: selectedSchool,
        majorId: selectedMajor,
        academicYear: selectedYear,
        sampleData: {
          [activeMethod]: sampleData
        }
      };

      const response = await fetch('http://localhost:3000/api/admin/admission-rules/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(previewData)
      });

      if (response.ok) {
        const results = await response.json();
        setPreviewResults(results.previewResults[activeMethod] || null);
      } else {
        message.error('Không thể xem trước quy tắc');
      }
    } catch (error) {
      message.error('Vui lòng điền đầy đủ dữ liệu mẫu');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleMethodChange = (method: string) => {
    setActiveMethod(method);
    setPreviewResults(null);
    previewForm.resetFields();
    
    // Load rules cho method mới
    if (currentRules[method]) {
      form.setFieldsValue(currentRules[method]);
    } else {
      form.resetFields();
    }
  };

  // Render forms
  const renderTHPTForm = () => (
    <div>
      <Title level={4}>⚙️ Cấu hình xét tuyển THPT</Title>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="minScore" 
            label="Điểm tối thiểu"
            tooltip="Điểm tối thiểu để đủ điều kiện xét tuyển"
          >
            <InputNumber 
              min={0} 
              max={30} 
              style={{ width: '100%' }} 
              placeholder="Nhập điểm tối thiểu"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="formula" 
            label="Công thức tính điểm"
            tooltip="Công thức để tính điểm xét tuyển"
          >
            <Select placeholder="Chọn công thức">
              <Option value="diemTongCong + diemUuTien">Điểm tổng cộng + Điểm ưu tiên</Option>
              <Option value="custom">Tùy chỉnh</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider>🎯 Hệ số môn học</Divider>
      <Alert 
        message="Hệ số càng cao thì môn đó càng quan trọng trong xét tuyển" 
        type="info" 
        showIcon 
        style={{ marginBottom: 16 }}
      />
      
      <Row gutter={16}>
        {Object.entries(subjectNames).map(([key, name]) => (
          <Col span={8} key={key}>
            <Form.Item 
              name={['subjectWeights', key]} 
              label={name}
              tooltip={`Hệ số cho môn ${name}`}
            >
              <InputNumber 
                min={0} 
                max={5} 
                step={0.1} 
                style={{ width: '100%' }}
                placeholder="0.0"
              />
            </Form.Item>
          </Col>
        ))}
      </Row>

      <Divider>📋 Môn bắt buộc</Divider>
      <Form.List name="requiredSubjects">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={16} align="middle">
                <Col span={10}>
                  <Form.Item
                    {...restField}
                    name={[name, 'subject']}
                    label="Môn học"
                  >
                    <Select placeholder="Chọn môn">
                      {Object.entries(subjectNames).map(([value, label]) => (
                        <Option key={value} value={value}>{label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    {...restField}
                    name={[name, 'minScore']}
                    label="Điểm tối thiểu"
                  >
                    <InputNumber 
                      min={0} 
                      max={10} 
                      step={0.1} 
                      style={{ width: '100%' }}
                      placeholder="0.0"
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => remove(name)}
                  />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
              >
                Thêm môn bắt buộc
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );

  const renderHSAForm = () => (
    <div>
      <Title level={4}>📚 Cấu hình xét học bạ</Title>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="minScore" 
            label="Điểm tối thiểu"
            tooltip="Điểm tối thiểu để đủ điều kiện xét tuyển"
          >
            <InputNumber 
              min={0} 
              max={10} 
              style={{ width: '100%' }} 
              placeholder="Nhập điểm tối thiểu"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="formula" 
            label="Công thức tính điểm"
            tooltip="Công thức để tính điểm xét tuyển"
          >
            <Select placeholder="Chọn công thức">
              <Option value="diemTBLop12 * 0.7 + diemTBMonHoc * 0.3">70% lớp 12 + 30% môn học</Option>
              <Option value="custom">Tùy chỉnh</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider>⚖️ Trọng số theo lớp</Divider>
      <Alert 
        message="Tổng trọng số các lớp nên bằng 1.0" 
        type="info" 
        showIcon 
        style={{ marginBottom: 16 }}
      />
      
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            name={['gradeWeights', 'lop10']} 
            label="Lớp 10"
            tooltip="Trọng số điểm lớp 10"
          >
            <InputNumber 
              min={0} 
              max={1} 
              step={0.1} 
              style={{ width: '100%' }}
              placeholder="0.0"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name={['gradeWeights', 'lop11']} 
            label="Lớp 11"
            tooltip="Trọng số điểm lớp 11"
          >
            <InputNumber 
              min={0} 
              max={1} 
              step={0.1} 
              style={{ width: '100%' }}
              placeholder="0.0"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name={['gradeWeights', 'lop12']} 
            label="Lớp 12"
            tooltip="Trọng số điểm lớp 12"
          >
            <InputNumber 
              min={0} 
              max={1} 
              step={0.1} 
              style={{ width: '100%' }}
              placeholder="0.0"
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider>🎯 Môn ưu tiên theo ngành</Divider>
      <Form.List name="prioritySubjects">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card key={key} size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'subject']}
                      label="Môn học"
                    >
                      <Select placeholder="Chọn môn">
                        {Object.entries(subjectNames).map(([value, label]) => (
                          <Option key={value} value={value}>{label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'weight']}
                      label="Hệ số"
                    >
                      <InputNumber 
                        min={0} 
                        max={5} 
                        step={0.1} 
                        style={{ width: '100%' }}
                        placeholder="1.0"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Mô tả"
                    >
                      <Input placeholder="Ví dụ: Môn cốt lõi ngành" />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => remove(name)}
                    />
                  </Col>
                </Row>
              </Card>
            ))}
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
              >
                Thêm môn ưu tiên
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );

  const renderPreviewForm = () => (
    <Form form={previewForm} layout="vertical">
      <Title level={4}>📊 Nhập dữ liệu mẫu để xem trước</Title>
      
      {activeMethod === 'thpt' && (
        <>
          <Alert 
            message="Nhập điểm các môn để xem cách tính điểm theo quy tắc hiện tại" 
            type="info" 
            style={{ marginBottom: 16 }}
          />
          <Row gutter={16}>
            {Object.entries(subjectNames).slice(0, 6).map(([key, name]) => (
              <Col span={8} key={key}>
                <Form.Item name={key} label={`Điểm ${name}`}>
                  <InputNumber 
                    min={0} 
                    max={10} 
                    step={0.1} 
                    style={{ width: '100%' }}
                    placeholder="0.0"
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </>
      )}
      
      {activeMethod === 'hsa' && (
        <>
          <Alert 
            message="Nhập điểm trung bình để xem cách tính điểm theo quy tắc hiện tại" 
            type="info" 
            style={{ marginBottom: 16 }}
          />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="diemTBLop12" label="Điểm TB Lớp 12">
                <InputNumber 
                  min={0} 
                  max={10} 
                  step={0.1} 
                  style={{ width: '100%' }}
                  placeholder="0.0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="diemTBMonHoc" label="Điểm TB Môn học">
                <InputNumber 
                  min={0} 
                  max={10} 
                  step={0.1} 
                  style={{ width: '100%' }}
                  placeholder="0.0"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>⚙️ Quản lý Quy tắc Xét tuyển Chi tiết</Title>
      
      {/* Form chọn trường, ngành, năm */}
      <Card title="🎯 Chọn thông tin xét tuyển" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Trường:</Text>
            </div>
            <Select
              placeholder="Chọn trường"
              style={{ width: '100%' }}
              value={selectedSchool}
              onChange={(value) => {
                setSelectedSchool(value);
                setSelectedMajor('');
                setCurrentRules({});
                form.resetFields();
              }}
            >
              {schools.map(school => (
                <Option key={school.id} value={school.id}>
                  {school.name}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Ngành:</Text>
            </div>
            <Select
              placeholder="Chọn ngành"
              style={{ width: '100%' }}
              disabled={!selectedSchool}
              value={selectedMajor}
              onChange={(value) => {
                setSelectedMajor(value);
                setCurrentRules({});
                form.resetFields();
              }}
            >
              {majors.map(major => (
                <Option key={major.id} value={major.id}>
                  {major.name}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Năm học:</Text>
            </div>
            <Select
              placeholder="Chọn năm học"
              style={{ width: '100%' }}
              value={selectedYear}
              onChange={(value) => {
                setSelectedYear(value);
                setCurrentRules({});
                form.resetFields();
              }}
            >
              <Option value={2024}>2024</Option>
              <Option value={2025}>2025</Option>
              <Option value={2026}>2026</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Main content */}
      {selectedSchool && selectedMajor ? (
        <Card 
          title="📋 Cấu hình quy tắc xét tuyển"
          extra={
            <Space>
              <Button 
                icon={<EyeOutlined />} 
                onClick={() => setPreviewModalVisible(true)}
                disabled={!currentRules[activeMethod]}
              >
                Xem trước
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadCurrentRules}
                loading={loading}
              >
                Tải lại
              </Button>
            </Space>
          }
          loading={loading}
        >
          <Tabs activeKey={activeMethod} onChange={handleMethodChange}>
            <TabPane tab="🎯 THPT" key="thpt">
              <Form form={form} layout="vertical" onFinish={handleSaveRules}>
                {renderTHPTForm()}
                <div style={{ textAlign: 'right', marginTop: 24 }}>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    loading={saving} 
                    htmlType="submit"
                    size="large"
                  >
                    Lưu quy tắc THPT
                  </Button>
                </div>
              </Form>
            </TabPane>
            
            <TabPane tab="📚 Học bạ" key="hsa">
              <Form form={form} layout="vertical" onFinish={handleSaveRules}>
                {renderHSAForm()}
                <div style={{ textAlign: 'right', marginTop: 24 }}>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    loading={saving} 
                    htmlType="submit"
                    size="large"
                  >
                    Lưu quy tắc học bạ
                  </Button>
                </div>
              </Form>
            </TabPane>

            <TabPane tab="🏆 Tài năng" key="tsa">
              <Alert 
                message="Chức năng đang phát triển" 
                description="Tính năng cấu hình xét tuyển tài năng/năng khiếu sẽ được cập nhật trong phiên bản tiếp theo."
                type="info" 
                showIcon 
              />
            </TabPane>

            <TabPane tab="🧠 Đánh giá NL" key="dgnl">
              <Alert 
                message="Chức năng đang phát triển" 
                description="Tính năng cấu hình xét đánh giá năng lực sẽ được cập nhật trong phiên bản tiếp theo."
                type="info" 
                showIcon 
              />
            </TabPane>

            <TabPane tab="🔄 Tổng hợp" key="xthb">
              <Alert 
                message="Chức năng đang phát triển" 
                description="Tính năng cấu hình xét tuyển tổng hợp sẽ được cập nhật trong phiên bản tiếp theo."
                type="info" 
                showIcon 
              />
            </TabPane>
          </Tabs>
        </Card>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <InfoCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={3} type="secondary">Chọn trường và ngành để bắt đầu</Title>
            <Text type="secondary">
              Vui lòng chọn trường và ngành học để cấu hình quy tắc xét tuyển chi tiết
            </Text>
          </div>
        </Card>
      )}

      {/* Modal xem trước */}
      <Modal
        title="👀 Xem trước kết quả áp dụng quy tắc"
        visible={previewModalVisible}
        onCancel={() => {
          setPreviewModalVisible(false);
          setPreviewResults(null);
          previewForm.resetFields();
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setPreviewModalVisible(false);
              setPreviewResults(null);
              previewForm.resetFields();
            }}
          >
            Đóng
          </Button>,
          <Button 
            key="preview" 
            type="primary" 
            loading={previewLoading} 
            onClick={handlePreviewRules}
            icon={<EyeOutlined />}
          >
            Xem trước
          </Button>
        ]}
        width={800}
      >
        {renderPreviewForm()}
        
        {previewResults && (
          <div style={{ marginTop: 24 }}>
            <Divider>📊 Kết quả xem trước</Divider>
            
            <Alert
              message={
                <div>
                  <Text strong>Điểm tổng: </Text>
                  <Tag color="blue" style={{ fontSize: '16px', padding: '4px 12px' }}>
                    {previewResults.totalScore}
                  </Tag>
                </div>
              }
              description={
                <div>
                  <Text>Đạt điểm tối thiểu: </Text>
                  <Tag color={previewResults.passedMinScore ? 'green' : 'red'}>
                    {previewResults.passedMinScore ? '✅ Đạt' : '❌ Không đạt'}
                  </Tag>
                </div>
              }
              type={previewResults.passedMinScore ? 'success' : 'warning'}
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Card title="Chi tiết tính điểm" size="small">
              <List
                dataSource={Object.entries(previewResults.details)}
                renderItem={([subject, detail]) => (
                  <List.Item>
                    <List.Item.Meta
                      title={subjectNames[subject as keyof typeof subjectNames] || subject}
                      description={
                        <div>
                          <Text>Điểm gốc: <Tag>{detail.originalScore}</Tag></Text>
                          <Text>Hệ số: <Tag color="blue">{detail.weight}</Tag></Text>
                          <Text>Điểm sau hệ số: <Tag color="green">{detail.weightedScore}</Tag></Text>
                          {detail.description && (
                            <div><Text type="secondary">{detail.description}</Text></div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DetailedAdmissionRulesPage;

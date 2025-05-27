import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tabs, 
  Card,
  Space,
  Typography,
  Tag,
  Tooltip,
  Row,
  Col,
  Statistic,
  Breadcrumb,
  Avatar,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  HomeOutlined,
  SettingOutlined,
  EyeOutlined,
  TeamOutlined,
  // Thêm các icon còn thiếu
  BankOutlined as SchoolOutlined,
  BookOutlined,
  ExperimentOutlined,
  DashboardOutlined
} from '@ant-design/icons';

import axios from 'axios';

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

// Định nghĩa các interface
interface School {
  id: string;
  name: string;
}

interface Major {
  id: string;
  name: string;
  schoolId: string;
}

interface SubjectGroup {
  id: string;
  name: string;
  schoolId: string;
  majorId: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

const Test: React.FC = () => {
  // Enhanced color palette
  const colors = {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8'
    }
  };

  // State cho Schools
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolModalVisible, setSchoolModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolForm] = Form.useForm();

  // State cho Majors
  const [majors, setMajors] = useState<Major[]>([]);
  const [majorModalVisible, setMajorModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [majorForm] = Form.useForm();

  // State cho Subject Groups
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [subjectGroupModalVisible, setSubjectGroupModalVisible] = useState(false);
  const [editingSubjectGroup, setEditingSubjectGroup] = useState<SubjectGroup | null>(null);
  const [selectedMajorId, setSelectedMajorId] = useState<string>('');
  const [subjectGroupForm] = Form.useForm();

  // State cho active tab
  const [activeTab, setActiveTab] = useState('1');

  // Fetch Schools
  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/schools`);
      setSchools(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách trường');
    }
  };

  // Fetch Majors
  const fetchMajors = async (schoolId: string) => {
    if (!schoolId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/majors?schoolId=${schoolId}`);
      setMajors(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách ngành');
    }
  };

  // Fetch Subject Groups
  const fetchSubjectGroups = async (schoolId: string, majorId: string) => {
    if (!schoolId || !majorId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/subject-groups?schoolId=${schoolId}&majorId=${majorId}`);
      setSubjectGroups(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách tổ hợp môn');
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchoolId) {
      fetchMajors(selectedSchoolId);
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedSchoolId && selectedMajorId) {
      fetchSubjectGroups(selectedSchoolId, selectedMajorId);
    }
  }, [selectedSchoolId, selectedMajorId]);

  // School CRUD operations
  const handleAddSchool = () => {
    setEditingSchool(null);
    schoolForm.resetFields();
    setSchoolModalVisible(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    schoolForm.setFieldsValue(school);
    setSchoolModalVisible(true);
  };

  const handleDeleteSchool = async (schoolId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa trường này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/admin/schools/${schoolId}`);
          message.success('Xóa trường thành công');
          fetchSchools();
        } catch (error) {
          message.error('Không thể xóa trường');
        }
      }
    });
  };

  const handleSchoolSubmit = async (values: School) => {
    try {
      if (editingSchool) {
        await axios.put(`${API_BASE_URL}/admin/schools/${editingSchool.id}`, values);
        message.success('Cập nhật trường thành công');
      } else {
        await axios.post(`${API_BASE_URL}/admin/schools`, values);
        message.success('Thêm trường thành công');
      }
      setSchoolModalVisible(false);
      fetchSchools();
    } catch (error) {
      message.error('Không thể lưu thông tin trường');
    }
  };

  // Major CRUD operations
  const handleAddMajor = () => {
    setEditingMajor(null);
    majorForm.resetFields();
    majorForm.setFieldsValue({ schoolId: selectedSchoolId });
    setMajorModalVisible(true);
  };

  const handleEditMajor = (major: Major) => {
    setEditingMajor(major);
    majorForm.setFieldsValue(major);
    setMajorModalVisible(true);
  };

  const handleDeleteMajor = async (majorId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ngành này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/admin/majors/${majorId}?schoolId=${selectedSchoolId}`);
          message.success('Xóa thành công');
          fetchMajors(selectedSchoolId);
        } catch (error) {
          message.error('Không thể xóa ngành');
        }
      }
    });
  };

  const handleMajorSubmit = async (values: Major) => {
    try {
      if (editingMajor) {
        await axios.put(`${API_BASE_URL}/admin/majors/${editingMajor.id}`, values);
        message.success('Cập nhật ngành thành công');
      } else {
        await axios.post(`${API_BASE_URL}/admin/majors`, values);
        message.success('Thêm ngành thành công');
      }
      setMajorModalVisible(false);
      fetchMajors(selectedSchoolId);
    } catch (error) {
      message.error('Không thể lưu thông tin ngành');
    }
  };

  // Subject Group CRUD operations
  const handleAddSubjectGroup = () => {
    setEditingSubjectGroup(null);
    subjectGroupForm.resetFields();
    subjectGroupForm.setFieldsValue({ 
      schoolId: selectedSchoolId,
      majorId: selectedMajorId 
    });
    setSubjectGroupModalVisible(true);
  };

  const handleEditSubjectGroup = (subjectGroup: SubjectGroup) => {
    setEditingSubjectGroup(subjectGroup);
    subjectGroupForm.setFieldsValue(subjectGroup);
    setSubjectGroupModalVisible(true);
  };

  const handleDeleteSubjectGroup = async (subjectGroupId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tổ hợp môn này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/admin/subject-groups/${subjectGroupId}?schoolId=${selectedSchoolId}&majorId=${selectedMajorId}`);
          message.success('Xóa tổ hợp môn thành công');
          fetchSubjectGroups(selectedSchoolId, selectedMajorId);
        } catch (error) {
          message.error('Không thể xóa tổ hợp môn');
        }
      }
    });
  };

  const handleSubjectGroupSubmit = async (values: SubjectGroup) => {
    try {
      if (editingSubjectGroup) {
        await axios.put(`${API_BASE_URL}/admin/subject-groups/${editingSubjectGroup.id}`, values);
        message.success('Cập nhật tổ hợp môn thành công');
      } else {
        await axios.post(`${API_BASE_URL}/admin/subject-groups`, values);
        message.success('Thêm tổ hợp môn thành công');
      }
      setSubjectGroupModalVisible(false);
      fetchSubjectGroups(selectedSchoolId, selectedMajorId);
    } catch (error) {
      message.error('Không thể lưu thông tin tổ hợp môn');
    }
  };

  // Enhanced table columns
  const schoolColumns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: 100,
      render: (text: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>{text}</Tag>
      )
    },
    { 
      title: 'Tên trường', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size="small" 
            icon={<SchoolOutlined />} 
            style={{ 
              backgroundColor: colors.primary,
              marginRight: '8px'
            }} 
          />
          <Text strong>{text}</Text>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (text: string, record: School) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text"
              icon={<EditOutlined />} 
              onClick={() => handleEditSchool(record)}
              style={{ color: colors.primary }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text"
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => handleDeleteSchool(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const majorColumns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: 100,
      render: (text: string) => (
        <Tag color="green" style={{ fontFamily: 'monospace' }}>{text}</Tag>
      )
    },
    { 
      title: 'Tên ngành', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size="small" 
            icon={<BookOutlined />} 
            style={{ 
              backgroundColor: colors.success,
              marginRight: '8px'
            }} 
          />
          <Text strong>{text}</Text>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (text: string, record: Major) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text"
              icon={<EditOutlined />} 
              onClick={() => handleEditMajor(record)}
              style={{ color: colors.primary }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text"
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => handleDeleteMajor(record.id)}
            />
          </Tooltip>
          <Tooltip title="Xem tổ hợp môn">
            <Button 
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedMajorId(record.id);
                setActiveTab('3');
              }}
              style={{ color: colors.warning }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const subjectGroupColumns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: 100,
      render: (text: string) => (
        <Tag color="orange" style={{ fontFamily: 'monospace' }}>{text}</Tag>
      )
    },
    { 
      title: 'Tên tổ hợp môn', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size="small" 
            icon={<ExperimentOutlined />} 
            style={{ 
              backgroundColor: colors.warning,
              marginRight: '8px'
            }} 
          />
          <Text strong>{text}</Text>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (text: string, record: SubjectGroup) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text"
              icon={<EditOutlined />} 
              onClick={() => handleEditSubjectGroup(record)}
              style={{ color: colors.primary }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text"
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => handleDeleteSubjectGroup(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Get selected school and major names
  const getSelectedSchoolName = () => {
    const school = schools.find(s => s.id === selectedSchoolId);
    return school ? school.name : '';
  };

  const getSelectedMajorName = () => {
    const major = majors.find(m => m.id === selectedMajorId);
    return major ? major.name : '';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: colors.surface }}>
      {/* Enhanced Header */}
      <Header style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
        padding: '0 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SettingOutlined style={{ color: '#fff', fontSize: '24px', marginRight: '12px' }} />
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              Quản lý Hệ thống Giáo dục
            </Title>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)' }}>
           
          </div>
        </div>
      </Header>

      <Layout>
        <Content style={{ margin: '24px 32px' }}>
          {/* Breadcrumb */}
       
          {/* Statistics Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={8}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <Statistic
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolOutlined style={{ color: colors.primary, marginRight: '8px' }} />
                      <span>Tổng số Trường</span>
                    </div>
                  }
                  value={schools.length}
                  valueStyle={{ color: colors.primary, fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${colors.success}15, ${colors.success}05)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <Statistic
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <BookOutlined style={{ color: colors.success, marginRight: '8px' }} />
                      <span>Tổng số Ngành</span>
                    </div>
                  }
                  value={majors.length}
                  valueStyle={{ color: colors.success, fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                style={{
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${colors.warning}15, ${colors.warning}05)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <Statistic
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ExperimentOutlined style={{ color: colors.warning, marginRight: '8px' }} />
                      <span>Tổng Tổ hợp môn</span>
                    </div>
                  }
                  value={subjectGroups.length}
                  valueStyle={{ color: colors.warning, fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Main Content */}
          <Card
            style={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Tabs 
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              tabBarStyle={{ marginBottom: '32px' }}
            >
              <TabPane 
                tab={
                  <span>
                    <SchoolOutlined />
                    Quản lý Trường
                  </span>
                } 
                key="1"
              >
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Title level={4} style={{ margin: 0, color: colors.text.primary }}>
                      🏫 Danh sách Trường học
                    </Title>
                    <Text style={{ color: colors.text.muted }}>
                      Quản lý thông tin các trường trong hệ thống
                    </Text>
                  </div>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAddSchool}
                    size="large"
                    style={{
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                      border: 'none'
                    }}
                  >
                    Thêm trường mới
                  </Button>
                </div>
                <Table 
                  dataSource={schools} 
                  columns={schoolColumns} 
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} của ${total} trường`
                  }}
                  style={{
                    '.ant-table-thead > tr > th': {
                      background: colors.surface,
                      borderBottom: `2px solid ${colors.border}`
                    }
                  }}
                  onRow={(record) => ({
                    onClick: () => {
                      setSelectedSchoolId(record.id);
                      setActiveTab('2');
                    },
                    style: { cursor: 'pointer' }
                  })}
                />
              </TabPane>

              <TabPane 
                tab={
                  <span>
                    <BookOutlined />
                    Quản lý Ngành
                  </span>
                } 
                key="2"
              >
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <Title level={4} style={{ margin: 0, color: colors.text.primary }}>
                        📚 Danh sách Ngành học
                      </Title>
                      <Text style={{ color: colors.text.muted }}>
                        Quản lý các ngành theo từng trường
                      </Text>
                    </div>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleAddMajor}
                      disabled={!selectedSchoolId}
                      size="large"
                      style={{
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colors.success}, #10b981)`,
                        border: 'none'
                      }}
                    >
                      Thêm ngành mới
                    </Button>
                  </div>
                  
                  <Card 
                    size="small" 
                    style={{ 
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px'
                    }}
                  >
                    <Space align="center">
                      <Text strong>Chọn trường:</Text>
                      <Select 
                        placeholder="Chọn trường để xem ngành" 
                        style={{ width: 300 }}
                        value={selectedSchoolId || undefined}
                        onChange={(value) => setSelectedSchoolId(value)}
                        size="large"
                      >
                        {schools.map(school => (
                          <Option key={school.id} value={school.id}>
                            <SchoolOutlined style={{ marginRight: '8px' }} />
                            {school.name}
                          </Option>
                        ))}
                      </Select>
                      {selectedSchoolId && (
                        <Tag color="blue" style={{ marginLeft: '8px' }}>
                          Đã chọn: {getSelectedSchoolName()}
                        </Tag>
                      )}
                    </Space>
                  </Card>
                </div>
                
                <Table 
                  dataSource={majors} 
                  columns={majorColumns} 
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} của ${total} ngành`
                  }}
                />
              </TabPane>

              <TabPane 
                tab={
                  <span>
                    <ExperimentOutlined />
                    Quản lý Tổ hợp môn
                  </span>
                } 
                key="3"
              >
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <Title level={4} style={{ margin: 0, color: colors.text.primary }}>
                        🧪 Danh sách Tổ hợp môn
                      </Title>
                      <Text style={{ color: colors.text.muted }}>
                        Quản lý tổ hợp môn theo ngành và trường
                      </Text>
                    </div>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleAddSubjectGroup}
                      disabled={!selectedSchoolId || !selectedMajorId}
                      size="large"
                      style={{
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colors.warning}, #f59e0b)`,
                        border: 'none'
                      }}
                    >
                      Thêm tổ hợp môn mới
                    </Button>
                  </div>
                  
                  <Card 
                    size="small" 
                    style={{ 
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px'
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Space align="center" style={{ width: '100%' }}>
                          <Text strong>Trường:</Text>
                          <Select 
                            placeholder="Chọn trường" 
                            style={{ flex: 1, minWidth: 200 }}
                            value={selectedSchoolId || undefined}
                            onChange={(value) => {
                              setSelectedSchoolId(value);
                              setSelectedMajorId('');
                            }}
                            size="large"
                          >
                            {schools.map(school => (
                              <Option key={school.id} value={school.id}>
                                <SchoolOutlined style={{ marginRight: '8px' }} />
                                {school.name}
                              </Option>
                            ))}
                          </Select>
                        </Space>
                      </Col>
                      <Col xs={24} md={12}>
                        <Space align="center" style={{ width: '100%' }}>
                          <Text strong>Ngành:</Text>
                          <Select 
                            placeholder="Chọn ngành" 
                            style={{ flex: 1, minWidth: 200 }}
                            value={selectedMajorId || undefined}
                            onChange={(value) => setSelectedMajorId(value)}
                            disabled={!selectedSchoolId}
                            size="large"
                          >
                            {majors.map(major => (
                              <Option key={major.id} value={major.id}>
                                <BookOutlined style={{ marginRight: '8px' }} />
                                {major.name}
                              </Option>
                            ))}
                          </Select>
                        </Space>
                      </Col>
                    </Row>
                    {selectedSchoolId && selectedMajorId && (
                      <div style={{ marginTop: '12px' }}>
                        <Tag color="blue">Trường: {getSelectedSchoolName()}</Tag>
                        <Tag color="green">Ngành: {getSelectedMajorName()}</Tag>
                      </div>
                    )}
                  </Card>
                </div>
                
                <Table 
                  dataSource={subjectGroups} 
                  columns={subjectGroupColumns} 
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} của ${total} tổ hợp môn`
                  }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>

      {/* Enhanced School Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SchoolOutlined style={{ color: colors.primary, marginRight: '8px' }} />
            {editingSchool ? "Cập nhật thông tin trường" : "Thêm trường mới"}
          </div>
        }
        visible={schoolModalVisible}
        onCancel={() => setSchoolModalVisible(false)}
        footer={null}
        width={600}
        style={{ top: 50 }}
      >
        <Divider />
        <Form
          form={schoolForm}
          layout="vertical"
          onFinish={handleSchoolSubmit}
          size="large"
        >
          <Form.Item
            name="id"
            label="Mã trường"
            rules={[{ required: true, message: 'Vui lòng nhập mã trường' }]}
          >
            <Input 
              disabled={!!editingSchool}
              placeholder="Nhập mã trường (VD: HUST, UET...)"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
          >
            <Input 
              placeholder="Nhập tên đầy đủ của trường"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => setSchoolModalVisible(false)}
                style={{ borderRadius: '8px' }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  border: 'none'
                }}
              >
                {editingSchool ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Enhanced Major Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BookOutlined style={{ color: colors.success, marginRight: '8px' }} />
            {editingMajor ? "Cập nhật thông tin ngành" : "Thêm ngành mới"}
          </div>
        }
        visible={majorModalVisible}
        onCancel={() => setMajorModalVisible(false)}
        footer={null}
        width={600}
        style={{ top: 50 }}
      >
        <Divider />
        <Form
          form={majorForm}
          layout="vertical"
          onFinish={handleMajorSubmit}
          size="large"
        >
          <Form.Item
            name="id"
            label="Mã ngành"
            rules={[{ required: true, message: 'Vui lòng nhập mã ngành' }]}
          >
            <Input 
              disabled={!!editingMajor}
              placeholder="Nhập mã ngành (VD: CNTT, KTMT...)"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên ngành"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngành' }]}
          >
            <Input 
              placeholder="Nhập tên đầy đủ của ngành"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item
            name="schoolId"
            label="Trường"
            rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
          >
            <Select 
              disabled={!!editingMajor}
              placeholder="Chọn trường"
              style={{ borderRadius: '8px' }}
            >
              {schools.map(school => (
                <Option key={school.id} value={school.id}>
                  <SchoolOutlined style={{ marginRight: '8px' }} />
                  {school.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => setMajorModalVisible(false)}
                style={{ borderRadius: '8px' }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${colors.success}, #10b981)`,
                  border: 'none'
                }}
              >
                {editingMajor ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Enhanced Subject Group Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExperimentOutlined style={{ color: colors.warning, marginRight: '8px' }} />
            {editingSubjectGroup ? "Cập nhật tổ hợp môn" : "Thêm tổ hợp môn mới"}
          </div>
        }
        visible={subjectGroupModalVisible}
        onCancel={() => setSubjectGroupModalVisible(false)}
        footer={null}
        width={600}
        style={{ top: 50 }}
      >
        <Divider />
        <Form
          form={subjectGroupForm}
          layout="vertical"
          onFinish={handleSubjectGroupSubmit}
          size="large"
        >
          <Form.Item
            name="id"
            label="Mã tổ hợp môn"
            rules={[{ required: true, message: 'Vui lòng nhập mã tổ hợp môn' }]}
          >
            <Input 
              disabled={!!editingSubjectGroup}
              placeholder="Nhập mã tổ hợp (VD: A00, A01, D01...)"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên tổ hợp môn"
            rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp môn' }]}
          >
            <Input 
              placeholder="Nhập tên tổ hợp môn (VD: Toán - Lý - Hóa)"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item
            name="schoolId"
            label="Trường"
            rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
          >
            <Select 
              disabled={!!editingSubjectGroup}
              placeholder="Chọn trường"
              style={{ borderRadius: '8px' }}
            >
              {schools.map(school => (
                <Option key={school.id} value={school.id}>
                  <SchoolOutlined style={{ marginRight: '8px' }} />
                  {school.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="majorId"
            label="Ngành"
            rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
          >
            <Select 
              disabled={!!editingSubjectGroup}
              placeholder="Chọn ngành"
              style={{ borderRadius: '8px' }}
            >
              {majors.map(major => (
                <Option key={major.id} value={major.id}>
                  <BookOutlined style={{ marginRight: '8px' }} />
                  {major.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => setSubjectGroupModalVisible(false)}
                style={{ borderRadius: '8px' }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${colors.warning}, #f59e0b)`,
                  border: 'none'
                }}
              >
                {editingSubjectGroup ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Custom CSS */}
      <style jsx>{`
        .ant-table-tbody > tr:hover > td {
          background: ${colors.surface} !important;
        }
        .ant-tabs-tab {
          font-weight: 500 !important;
        }
        .ant-tabs-tab-active {
          font-weight: 600 !important;
        }
        .ant-card {
          transition: all 0.3s ease;
        }
        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </Layout>
  );
};

export default Test;

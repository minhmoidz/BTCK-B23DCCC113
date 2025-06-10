import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Layout, Button, Modal, Form, Row, Col, Card, Statistic, Tabs, Typography, message } from 'antd';
import {
  PlusOutlined, SettingOutlined, BookOutlined, BankOutlined as SchoolOutlined
} from '@ant-design/icons';
import axios from 'axios';
=======
import { 
  Layout, 
  Button, 
  Modal, 
  Form, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Tabs, 
  Typography, 
  message, 
  Divider,
  Select 
} from 'antd';
import {
  PlusOutlined, 
  SettingOutlined, 
  BookOutlined, 
  BankOutlined as SchoolOutlined
} from '@ant-design/icons';
import axios from 'axios';

// Component imports
>>>>>>> temp-remote/main
import SchoolTable from '../../component/admin/EducationManagement/SchoolTable';
import SchoolModal from '../../component/admin/EducationManagement/SchoolModal';
import MajorTable from '../../component/admin/EducationManagement/MajorTable';
import MajorModal from '../../component/admin/EducationManagement/MajorModal';
import SubjectGroupTable from '../../component/admin/EducationManagement/SubjectGroupTable';
import SubjectGroupModal from '../../component/admin/EducationManagement/SubjectGroupModal';
<<<<<<< HEAD
import { School, Major, SubjectGroup } from '../../types/admin/EducationManagement/types';
import { Select } from 'antd';
=======

// Type imports
import { School, Major, SubjectGroup } from '../../types/admin/EducationManagement/types';
>>>>>>> temp-remote/main

const { Header, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const API_BASE_URL = 'http://localhost:3000/api';

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
};

<<<<<<< HEAD
const EducationManagement: React.FC = () => {
  // State
=======
interface SchoolWithAdmin extends School {
  adminEmail?: string;
  adminPassword?: string;
  adminName?: string;
  adminPhone?: string;
}

const EducationManagement: React.FC = () => {
  // State management
>>>>>>> temp-remote/main
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolModalVisible, setSchoolModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolForm] = Form.useForm();

  const [majors, setMajors] = useState<Major[]>([]);
  const [majorModalVisible, setMajorModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [majorForm] = Form.useForm();

  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [subjectGroupModalVisible, setSubjectGroupModalVisible] = useState(false);
  const [editingSubjectGroup, setEditingSubjectGroup] = useState<SubjectGroup | null>(null);
  const [selectedMajorId, setSelectedMajorId] = useState<string>('');
  const [subjectGroupForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState('1');
<<<<<<< HEAD

  // Fetch
  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/schools`);
      setSchools(response.data);
    } catch {
      message.error('Không thể tải danh sách trường');
    }
  };
  const fetchMajors = async (schoolId: string) => {
    if (!schoolId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/majors?schoolId=${schoolId}`);
      setMajors(response.data);
    } catch {
      message.error('Không thể tải danh sách ngành');
    }
  };
  const fetchSubjectGroups = async (schoolId: string, majorId: string) => {
    if (!schoolId || !majorId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/subject-groups?schoolId=${schoolId}&majorId=${majorId}`);
      setSubjectGroups(response.data);
    } catch {
      message.error('Không thể tải danh sách tổ hợp môn');
    }
  };

  useEffect(() => { fetchSchools(); }, []);
  useEffect(() => { if (selectedSchoolId) fetchMajors(selectedSchoolId); }, [selectedSchoolId]);
  useEffect(() => { if (selectedSchoolId && selectedMajorId) fetchSubjectGroups(selectedSchoolId, selectedMajorId); }, [selectedSchoolId, selectedMajorId]);

  // School CRUD
  const handleAddSchool = () => { setEditingSchool(null); schoolForm.resetFields(); setSchoolModalVisible(true); };
  const handleEditSchool = (school: School) => { setEditingSchool(school); schoolForm.setFieldsValue(school); setSchoolModalVisible(true); };
  const handleDeleteSchool = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa trường này?',
      okText: 'Xóa', cancelText: 'Hủy', okType: 'danger',
      onOk: async () => {
        try { await axios.delete(`${API_BASE_URL}/admin/schools/${id}`); message.success('Xóa trường thành công'); fetchSchools(); }
        catch { message.error('Không thể xóa trường'); }
      }
    });
  };
  const handleSchoolSubmit = async (values: School) => {
    try {
      if (editingSchool) await axios.put(`${API_BASE_URL}/admin/schools/${editingSchool.id}`, values);
      else await axios.post(`${API_BASE_URL}/admin/schools`, values);
      setSchoolModalVisible(false); fetchSchools();
      message.success(editingSchool ? 'Cập nhật trường thành công' : 'Thêm trường thành công');
    } catch { message.error('Không thể lưu thông tin trường'); }
  };

  // Major CRUD
  const handleAddMajor = () => { setEditingMajor(null); majorForm.resetFields(); majorForm.setFieldsValue({ schoolId: selectedSchoolId }); setMajorModalVisible(true); };
  const handleEditMajor = (major: Major) => { setEditingMajor(major); majorForm.setFieldsValue(major); setMajorModalVisible(true); };
  const handleDeleteMajor = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ngành này?',
      okText: 'Xóa', cancelText: 'Hủy', okType: 'danger',
      onOk: async () => {
        try { await axios.delete(`${API_BASE_URL}/admin/majors/${id}?schoolId=${selectedSchoolId}`); message.success('Xóa thành công'); fetchMajors(selectedSchoolId); }
        catch { message.error('Không thể xóa ngành'); }
      }
    });
  };
  const handleMajorSubmit = async (values: Major) => {
    try {
      if (editingMajor) await axios.put(`${API_BASE_URL}/admin/majors/${editingMajor.id}`, values);
      else await axios.post(`${API_BASE_URL}/admin/majors`, values);
      setMajorModalVisible(false); fetchMajors(selectedSchoolId);
      message.success(editingMajor ? 'Cập nhật ngành thành công' : 'Thêm ngành thành công');
    } catch { message.error('Không thể lưu thông tin ngành'); }
  };

  // Subject Group CRUD
  const handleAddSubjectGroup = () => { setEditingSubjectGroup(null); subjectGroupForm.resetFields(); subjectGroupForm.setFieldsValue({ schoolId: selectedSchoolId, majorId: selectedMajorId }); setSubjectGroupModalVisible(true); };
  const handleEditSubjectGroup = (sg: SubjectGroup) => { setEditingSubjectGroup(sg); subjectGroupForm.setFieldsValue(sg); setSubjectGroupModalVisible(true); };
=======
  const [loading, setLoading] = useState(false);

  // Fetch functions
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/schools`);
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
      message.error('Không thể tải danh sách trường');
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async (schoolId: string) => {
    if (!schoolId) {
      setMajors([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/majors?schoolId=${schoolId}`);
      setMajors(response.data);
    } catch (error) {
      console.error('Error fetching majors:', error);
      message.error('Không thể tải danh sách ngành');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectGroups = async (schoolId: string, majorId: string) => {
    if (!schoolId || !majorId) {
      setSubjectGroups([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/subject-groups?schoolId=${schoolId}&majorId=${majorId}`
      );
      setSubjectGroups(response.data);
    } catch (error) {
      console.error('Error fetching subject groups:', error);
      message.error('Không thể tải danh sách tổ hợp môn');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchoolId) {
      fetchMajors(selectedSchoolId);
      setSelectedMajorId(''); // Reset major selection when school changes
      setSubjectGroups([]); // Clear subject groups
    } else {
      setMajors([]);
      setSelectedMajorId('');
      setSubjectGroups([]);
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedSchoolId && selectedMajorId) {
      fetchSubjectGroups(selectedSchoolId, selectedMajorId);
    } else {
      setSubjectGroups([]);
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

  const handleDeleteSchool = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa trường này? Tất cả ngành học và tổ hợp môn liên quan cũng sẽ bị xóa.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/admin/schools/${id}`);
          message.success('Xóa trường thành công');
          fetchSchools();
          // Reset selections if deleted school was selected
          if (selectedSchoolId === id) {
            setSelectedSchoolId('');
            setSelectedMajorId('');
          }
        } catch (error) {
          console.error('Error deleting school:', error);
          message.error('Không thể xóa trường');
        }
      }
    });
  };

  const handleSchoolSubmit = async (values: SchoolWithAdmin) => {
    try {
      setLoading(true);
      
      if (editingSchool) {
        // Update existing school
        await axios.put(`${API_BASE_URL}/admin/schools/${editingSchool.id}`, {
          name: values.name
        });
        message.success('Cập nhật trường thành công');
      } else {
        // Create new school with admin account
        const payload = {
          id: values.id,
          name: values.name,
          adminEmail: values.adminEmail,
          adminPassword: values.adminPassword,
          adminName: values.adminName,
          adminPhone: values.adminPhone
        };
        
        await axios.post(`${API_BASE_URL}/admin/schools`, payload);
        message.success('Thêm trường và tạo tài khoản admin thành công');
      }
      
      setSchoolModalVisible(false);
      schoolForm.resetFields();
      fetchSchools();
    } catch (error: any) {
      console.error('Error saving school:', error);
      const errorMessage = error.response?.data?.message || 'Không thể lưu thông tin trường';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Major CRUD operations
  const handleAddMajor = () => {
    if (!selectedSchoolId) {
      message.warning('Vui lòng chọn trường trước');
      return;
    }
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

  const handleDeleteMajor = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa ngành này? Tất cả tổ hợp môn liên quan cũng sẽ bị xóa.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/admin/majors/${id}?schoolId=${selectedSchoolId}`);
          message.success('Xóa ngành thành công');
          fetchMajors(selectedSchoolId);
          // Reset major selection if deleted major was selected
          if (selectedMajorId === id) {
            setSelectedMajorId('');
          }
        } catch (error) {
          console.error('Error deleting major:', error);
          message.error('Không thể xóa ngành');
        }
      }
    });
  };

  // ✅ SỬA LỖI: handleMajorSubmit - Đảm bảo gửi đầy đủ thông tin
  const handleMajorSubmit = async (values: Major) => {
    try {
      setLoading(true);
      
      console.log('Major form values:', values);
      console.log('Selected school ID:', selectedSchoolId);
      
      // Đảm bảo có schoolId trong payload
      const payload = {
        ...values,
        schoolId: selectedSchoolId
      };
      
      console.log('Sending payload:', payload);
      
      if (editingMajor) {
        await axios.put(`${API_BASE_URL}/admin/majors/${editingMajor.id}`, payload);
        message.success('Cập nhật ngành thành công');
      } else {
        await axios.post(`${API_BASE_URL}/admin/majors`, payload);
        message.success('Thêm ngành thành công');
      }
      
      setMajorModalVisible(false);
      majorForm.resetFields();
      fetchMajors(selectedSchoolId);
    } catch (error: any) {
      console.error('Error saving major:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Không thể lưu thông tin ngành';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Subject Group CRUD operations
  const handleAddSubjectGroup = () => {
    if (!selectedSchoolId || !selectedMajorId) {
      message.warning('Vui lòng chọn trường và ngành trước');
      return;
    }
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

>>>>>>> temp-remote/main
  const handleDeleteSubjectGroup = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tổ hợp môn này?',
<<<<<<< HEAD
      okText: 'Xóa', cancelText: 'Hủy', okType: 'danger',
      onOk: async () => {
        try { await axios.delete(`${API_BASE_URL}/admin/subject-groups/${id}?schoolId=${selectedSchoolId}&majorId=${selectedMajorId}`); message.success('Xóa tổ hợp môn thành công'); fetchSubjectGroups(selectedSchoolId, selectedMajorId); }
        catch { message.error('Không thể xóa tổ hợp môn'); }
      }
    });
  };
  const handleSubjectGroupSubmit = async (values: SubjectGroup) => {
    try {
      if (editingSubjectGroup) await axios.put(`${API_BASE_URL}/admin/subject-groups/${editingSubjectGroup.id}`, values);
      else await axios.post(`${API_BASE_URL}/admin/subject-groups`, values);
      setSubjectGroupModalVisible(false); fetchSubjectGroups(selectedSchoolId, selectedMajorId);
      message.success(editingSubjectGroup ? 'Cập nhật tổ hợp môn thành công' : 'Thêm tổ hợp môn thành công');
    } catch { message.error('Không thể lưu thông tin tổ hợp môn'); }
  };

  // UI
  return (
    <Layout style={{ minHeight: '100vh', background: colors.surface }}>
      <Header style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`, padding: '0 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <SettingOutlined style={{ color: '#fff', fontSize: 24, marginRight: 12 }} />
          <Title level={3} style={{ color: '#fff', margin: 0 }}>Quản lý Hệ thống Giáo dục</Title>
        </div>
      </Header>
      <Content style={{ margin: '24px 32px' }}>
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Statistic title={<div style={{ display: 'flex', alignItems: 'center' }}><SchoolOutlined style={{ color: colors.primary, marginRight: 8 }} /><span>Tổng số Trường</span></div>} value={schools.length} valueStyle={{ color: colors.primary, fontWeight: 'bold' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${colors.success}15, ${colors.success}05)`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Statistic title={<div style={{ display: 'flex', alignItems: 'center' }}><BookOutlined style={{ color: colors.success, marginRight: 8 }} /><span>Tổng số Ngành</span></div>} value={majors.length} valueStyle={{ color: colors.success, fontWeight: 'bold' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${colors.warning}15, ${colors.warning}05)`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Statistic title={<div style={{ display: 'flex', alignItems: 'center' }}><SchoolOutlined style={{ color: colors.warning, marginRight: 8 }} /><span>Tổng số Tổ hợp môn</span></div>} value={subjectGroups.length} valueStyle={{ color: colors.warning, fontWeight: 'bold' }} />
            </Card>
          </Col>
        </Row>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Trường" key="1">
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={handleAddSchool}>Thêm trường</Button>
            <SchoolTable schools={schools} onEdit={handleEditSchool} onDelete={handleDeleteSchool} colors={colors} />
            <SchoolModal visible={schoolModalVisible} onCancel={() => setSchoolModalVisible(false)} onOk={handleSchoolSubmit} form={schoolForm} editingSchool={editingSchool} />
          </TabPane>
          <TabPane tab="Ngành" key="2">
            <Select placeholder="Chọn trường" style={{ width: 240, marginBottom: 16 }} value={selectedSchoolId} onChange={setSelectedSchoolId}>
              {schools.map((s) => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 16, marginBottom: 16 }} disabled={!selectedSchoolId} onClick={handleAddMajor}>Thêm ngành</Button>
            <MajorTable majors={majors} onEdit={handleEditMajor} onDelete={handleDeleteMajor} onViewSubjectGroups={(majorId) => { setSelectedMajorId(majorId); setActiveTab('3'); }} colors={colors} />
            <MajorModal visible={majorModalVisible} onCancel={() => setMajorModalVisible(false)} onOk={handleMajorSubmit} form={majorForm} editingMajor={editingMajor} schools={schools} selectedSchoolId={selectedSchoolId} />
          </TabPane>
          <TabPane tab="Tổ hợp môn" key="3">
            <Select placeholder="Chọn trường" style={{ width: 180, marginBottom: 16, marginRight: 8 }} value={selectedSchoolId} onChange={setSelectedSchoolId}>
              {schools.map((s) => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
            </Select>
            <Select placeholder="Chọn ngành" style={{ width: 180, marginBottom: 16, marginRight: 8 }} value={selectedMajorId} onChange={setSelectedMajorId}>
              {majors.map((m) => <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>)}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} disabled={!selectedSchoolId || !selectedMajorId} onClick={handleAddSubjectGroup}>Thêm tổ hợp môn</Button>
            <SubjectGroupTable subjectGroups={subjectGroups} onEdit={handleEditSubjectGroup} onDelete={handleDeleteSubjectGroup} colors={colors} />
            <SubjectGroupModal visible={subjectGroupModalVisible} onCancel={() => setSubjectGroupModalVisible(false)} onOk={handleSubjectGroupSubmit} form={subjectGroupForm} editingSubjectGroup={editingSubjectGroup} schools={schools} majors={majors} selectedSchoolId={selectedSchoolId} selectedMajorId={selectedMajorId} />
=======
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(
            `${API_BASE_URL}/admin/subject-groups/${id}?schoolId=${selectedSchoolId}&majorId=${selectedMajorId}`
          );
          message.success('Xóa tổ hợp môn thành công');
          fetchSubjectGroups(selectedSchoolId, selectedMajorId);
        } catch (error) {
          console.error('Error deleting subject group:', error);
          message.error('Không thể xóa tổ hợp môn');
        }
      }
    });
  };

  // ✅ SỬA LỖI: handleSubjectGroupSubmit - Đảm bảo gửi đầy đủ thông tin
  const handleSubjectGroupSubmit = async (values: SubjectGroup) => {
    try {
      setLoading(true);
      
      console.log('Subject group form values:', values);
      console.log('Selected school ID:', selectedSchoolId);
      console.log('Selected major ID:', selectedMajorId);
      
      // Đảm bảo có đầy đủ schoolId và majorId trong payload
      const payload = {
        ...values,
        schoolId: selectedSchoolId,
        majorId: selectedMajorId
      };
      
      console.log('Sending payload:', payload);
      
      if (editingSubjectGroup) {
        await axios.put(`${API_BASE_URL}/admin/subject-groups/${editingSubjectGroup.id}`, payload);
        message.success('Cập nhật tổ hợp môn thành công');
      } else {
        await axios.post(`${API_BASE_URL}/admin/subject-groups`, payload);
        message.success('Thêm tổ hợp môn thành công');
      }
      
      setSubjectGroupModalVisible(false);
      subjectGroupForm.resetFields();
      fetchSubjectGroups(selectedSchoolId, selectedMajorId);
    } catch (error: any) {
      console.error('Error saving subject group:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Không thể lưu thông tin tổ hợp môn';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Reset selections when changing tabs
    if (key === '2') {
      setSelectedMajorId('');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: colors.surface }}>
      <Header 
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`, 
          padding: '0 32px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <SettingOutlined style={{ color: '#fff', fontSize: 24, marginRight: 12 }} />
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            Quản lý Hệ thống Giáo dục
          </Title>
        </div>
      </Header>

      <Content style={{ margin: '24px 32px' }}>
        {/* Statistics Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={8}>
            <Card 
              style={{ 
                borderRadius: 12, 
                border: 'none', 
                background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
              }}
            >
              <Statistic 
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolOutlined style={{ color: colors.primary, marginRight: 8 }} />
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
                borderRadius: 12, 
                border: 'none', 
                background: `linear-gradient(135deg, ${colors.success}15, ${colors.success}05)`, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
              }}
            >
              <Statistic 
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BookOutlined style={{ color: colors.success, marginRight: 8 }} />
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
                borderRadius: 12, 
                border: 'none', 
                background: `linear-gradient(135deg, ${colors.warning}15, ${colors.warning}05)`, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
              }}
            >
              <Statistic 
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolOutlined style={{ color: colors.warning, marginRight: 8 }} />
                    <span>Tổng số Tổ hợp môn</span>
                  </div>
                } 
                value={subjectGroups.length} 
                valueStyle={{ color: colors.warning, fontWeight: 'bold' }} 
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {/* Schools Tab */}
          <TabPane tab="Trường" key="1">
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddSchool}
                loading={loading}
              >
                Thêm trường
              </Button>
            </div>
            <SchoolTable 
              schools={schools} 
              onEdit={handleEditSchool} 
              onDelete={handleDeleteSchool} 
              colors={colors}
              loading={loading}
            />
            <SchoolModal 
              visible={schoolModalVisible} 
              onCancel={() => {
                setSchoolModalVisible(false);
                schoolForm.resetFields();
              }} 
              onOk={handleSchoolSubmit} 
              form={schoolForm} 
              editingSchool={editingSchool}
              loading={loading}
            />
          </TabPane>

          {/* Majors Tab */}
          <TabPane tab="Ngành" key="2">
            <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <Select 
                placeholder="Chọn trường" 
                style={{ width: 240 }} 
                value={selectedSchoolId || undefined}
                onChange={setSelectedSchoolId}
                allowClear
              >
                {schools.map((school) => (
                  <Select.Option key={school.id} value={school.id}>
                    {school.name}
                  </Select.Option>
                ))}
              </Select>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                disabled={!selectedSchoolId || loading}
                onClick={handleAddMajor}
                loading={loading}
              >
                Thêm ngành
              </Button>
            </div>
            <MajorTable 
              majors={majors} 
              onEdit={handleEditMajor} 
              onDelete={handleDeleteMajor} 
              onViewSubjectGroups={(majorId) => { 
                setSelectedMajorId(majorId); 
                setActiveTab('3'); 
              }} 
              colors={colors}
              loading={loading}
            />
            <MajorModal 
              visible={majorModalVisible} 
              onCancel={() => {
                setMajorModalVisible(false);
                majorForm.resetFields();
              }} 
              onOk={handleMajorSubmit} 
              form={majorForm} 
              editingMajor={editingMajor} 
              schools={schools} 
              selectedSchoolId={selectedSchoolId}
              loading={loading}
            />
          </TabPane>

          {/* Subject Groups Tab */}
          <TabPane tab="Tổ hợp môn" key="3">
            <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <Select 
                placeholder="Chọn trường" 
                style={{ width: 180 }} 
                value={selectedSchoolId || undefined}
                onChange={setSelectedSchoolId}
                allowClear
              >
                {schools.map((school) => (
                  <Select.Option key={school.id} value={school.id}>
                    {school.name}
                  </Select.Option>
                ))}
              </Select>
              <Select 
                placeholder="Chọn ngành" 
                style={{ width: 180 }} 
                value={selectedMajorId || undefined}
                onChange={setSelectedMajorId}
                disabled={!selectedSchoolId}
                allowClear
              >
                {majors.map((major) => (
                  <Select.Option key={major.id} value={major.id}>
                    {major.name}
                  </Select.Option>
                ))}
              </Select>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                disabled={!selectedSchoolId || !selectedMajorId || loading}
                onClick={handleAddSubjectGroup}
                loading={loading}
              >
                Thêm tổ hợp môn
              </Button>
            </div>
            <SubjectGroupTable 
              subjectGroups={subjectGroups} 
              onEdit={handleEditSubjectGroup} 
              onDelete={handleDeleteSubjectGroup} 
              colors={colors}
              loading={loading}
            />
            <SubjectGroupModal 
              visible={subjectGroupModalVisible} 
              onCancel={() => {
                setSubjectGroupModalVisible(false);
                subjectGroupForm.resetFields();
              }} 
              onOk={handleSubjectGroupSubmit} 
              form={subjectGroupForm} 
              editingSubjectGroup={editingSubjectGroup} 
              schools={schools} 
              majors={majors} 
              selectedSchoolId={selectedSchoolId} 
              selectedMajorId={selectedMajorId}
              loading={loading}
            />
>>>>>>> temp-remote/main
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default EducationManagement;

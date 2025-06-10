import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Row, Col, Card, Statistic, Tabs, Typography, message } from 'antd';
import {
  PlusOutlined, SettingOutlined, BookOutlined, BankOutlined as SchoolOutlined
} from '@ant-design/icons';
import axios from 'axios';
import SchoolTable from '../../component/admin/EducationManagement/SchoolTable';
import SchoolModal from '../../component/admin/EducationManagement/SchoolModal';
import MajorTable from '../../component/admin/EducationManagement/MajorTable';
import MajorModal from '../../component/admin/EducationManagement/MajorModal';
import SubjectGroupTable from '../../component/admin/EducationManagement/SubjectGroupTable';
import SubjectGroupModal from '../../component/admin/EducationManagement/SubjectGroupModal';
import { School, Major, SubjectGroup } from '../../types/admin/EducationManagement/types';
import { Select } from 'antd';

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

const EducationManagement: React.FC = () => {
  // State
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
  const handleDeleteSubjectGroup = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tổ hợp môn này?',
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
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default EducationManagement;

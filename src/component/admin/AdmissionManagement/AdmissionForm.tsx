// src/pages/Admin/AdmissionManagement/components/AdmissionForm.tsx

import React from 'react';
import { Form, Select, Button, Row, Col, Space } from 'antd';
import { PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { School, Major } from '../../../types/admin/AdmissionManagement/types';

const { Option } = Select;

interface Props {
  form: any;
  schools: School[];
  majors: Major[];
  loading: boolean;
  processLoading: boolean;
  selectedSchool: string;
  setSelectedSchool: (val: string) => void;
  selectedMajor: string;
  setSelectedMajor: (val: string) => void;
  onProcess: () => void;
  onViewQuotas: () => void;
}

const AdmissionForm: React.FC<Props> = ({
  form,
  schools,
  majors,
  loading,
  processLoading,
  selectedSchool,
  setSelectedSchool,
  selectedMajor,
  setSelectedMajor,
  onProcess,
  onViewQuotas,
}) => (
  <Form form={form} layout="vertical" initialValues={{ academicYear: 2025 }}>
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
            }}
          >
            {schools.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
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
            onChange={setSelectedMajor}
          >
            {majors.map((m) => (
              <Option key={m.id} value={m.id}>
                {m.name}
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
        onClick={onProcess}
        loading={processLoading}
        size="large"
        style={{ background: '#52c41a', borderColor: '#52c41a' }}
      >
        🚀 Thực hiện xét tuyển
      </Button>
      <Button icon={<EyeOutlined />} onClick={onViewQuotas} loading={loading} size="large">
        Xem chỉ tiêu
      </Button>
    </Space>
  </Form>
);

export default AdmissionForm;

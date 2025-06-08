import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { SubjectGroup, School, Major } from '../../../types/admin/EducationManagement/types';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: SubjectGroup) => void;
  form: any;
  editingSubjectGroup: SubjectGroup | null;
  schools: School[];
  majors: Major[];
  selectedSchoolId: string;
  selectedMajorId: string;
}

const SubjectGroupModal: React.FC<Props> = ({
  visible, onCancel, onOk, form, editingSubjectGroup, schools, majors, selectedSchoolId, selectedMajorId
}) => (
  <Modal
    title={editingSubjectGroup ? 'Chỉnh sửa tổ hợp môn' : 'Thêm tổ hợp môn'}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText={editingSubjectGroup ? 'Cập nhật' : 'Thêm'}
    cancelText="Hủy"
    destroyOnClose
  >
    <Form form={form} layout="vertical" onFinish={onOk}>
      <Form.Item
        name="schoolId"
        label="Trường"
        rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
        initialValue={selectedSchoolId}
      >
        <Select disabled>
          {schools.map((s) => (
            <Option key={s.id} value={s.id}>{s.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="majorId"
        label="Ngành"
        rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
        initialValue={selectedMajorId}
      >
        <Select disabled>
          {majors.map((m) => (
            <Option key={m.id} value={m.id}>{m.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="name"
        label="Tên tổ hợp môn"
        rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp môn' }]}
      >
        <Input placeholder="Nhập tên tổ hợp môn" />
      </Form.Item>
    </Form>
  </Modal>
);

export default SubjectGroupModal;

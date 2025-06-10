<<<<<<< HEAD
=======
// SubjectGroupModal.tsx
>>>>>>> temp-remote/main
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
<<<<<<< HEAD
}

const SubjectGroupModal: React.FC<Props> = ({
  visible, onCancel, onOk, form, editingSubjectGroup, schools, majors, selectedSchoolId, selectedMajorId
=======
  loading?: boolean;
}

const SubjectGroupModal: React.FC<Props> = ({ 
  visible, 
  onCancel, 
  onOk, 
  form, 
  editingSubjectGroup, 
  schools, 
  majors, 
  selectedSchoolId, 
  selectedMajorId,
  loading = false
>>>>>>> temp-remote/main
}) => (
  <Modal
    title={editingSubjectGroup ? 'Chỉnh sửa tổ hợp môn' : 'Thêm tổ hợp môn'}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText={editingSubjectGroup ? 'Cập nhật' : 'Thêm'}
    cancelText="Hủy"
<<<<<<< HEAD
    destroyOnClose
  >
    <Form form={form} layout="vertical" onFinish={onOk}>
=======
    confirmLoading={loading}
    destroyOnClose
  >
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onOk}
      initialValues={editingSubjectGroup || { 
        schoolId: selectedSchoolId, 
        majorId: selectedMajorId 
      }}
    >
      {/* ✅ THÊM TRƯỜNG ID - Đây là trường bắt buộc */}
      <Form.Item
        name="id"
        label="Mã tổ hợp môn"
        rules={[
          { required: true, message: 'Vui lòng nhập mã tổ hợp môn' },
          { pattern: /^[A-Z0-9]+$/, message: 'Mã tổ hợp môn chỉ được chứa chữ hoa và số' }
        ]}
      >
        <Input 
          placeholder="Ví dụ: A00, A01, B00, C00, D01" 
          disabled={!!editingSubjectGroup} // Không cho sửa mã khi edit
          style={{ textTransform: 'uppercase' }}
        />
      </Form.Item>

>>>>>>> temp-remote/main
      <Form.Item
        name="schoolId"
        label="Trường"
        rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
<<<<<<< HEAD
        initialValue={selectedSchoolId}
      >
        <Select disabled>
          {schools.map((s) => (
            <Option key={s.id} value={s.id}>{s.name}</Option>
          ))}
        </Select>
      </Form.Item>
=======
      >
        <Select disabled placeholder="Chọn trường">
          {schools.map((school) => (
            <Option key={school.id} value={school.id}>
              {school.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

>>>>>>> temp-remote/main
      <Form.Item
        name="majorId"
        label="Ngành"
        rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
<<<<<<< HEAD
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
=======
      >
        <Select disabled placeholder="Chọn ngành">
          {majors.map((major) => (
            <Option key={major.id} value={major.id}>
              {major.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên tổ hợp môn"
        rules={[
          { required: true, message: 'Vui lòng nhập tên tổ hợp môn' },
          { min: 3, message: 'Tên tổ hợp môn phải có ít nhất 3 ký tự' }
        ]}
      >
        <Input placeholder="Ví dụ: Toán - Lý - Hóa" />
>>>>>>> temp-remote/main
      </Form.Item>
    </Form>
  </Modal>
);

export default SubjectGroupModal;

import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { Major, School } from '../../../types/admin/EducationManagement/types';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: Major) => void;
  form: any;
  editingMajor: Major | null;
  schools: School[];
  selectedSchoolId: string;
  loading?: boolean;
}

const MajorModal: React.FC<Props> = ({ 
  visible, 
  onCancel, 
  onOk, 
  form, 
  editingMajor, 
  schools, 
  selectedSchoolId,
  loading = false
}) => (
  <Modal
    title={editingMajor ? 'Chỉnh sửa ngành' : 'Thêm ngành'}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText={editingMajor ? 'Cập nhật' : 'Thêm'}
    cancelText="Hủy"
    confirmLoading={loading}
    destroyOnClose
  >
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onOk}
      initialValues={editingMajor || { schoolId: selectedSchoolId }}
    >
      {/* ✅ THÊM TRƯỜNG ID - Đây là trường bắt buộc */}
      <Form.Item
        name="id"
        label="Mã ngành"
        rules={[
          { required: true, message: 'Vui lòng nhập mã ngành' },
          { pattern: /^[A-Z0-9_]+$/, message: 'Mã ngành chỉ được chứa chữ hoa, số và dấu gạch dưới' }
        ]}
      >
        <Input 
          placeholder="Ví dụ: CNTT, KTXD, QTKD" 
          disabled={!!editingMajor} // Không cho sửa mã khi edit
          style={{ textTransform: 'uppercase' }}
        />
      </Form.Item>

      <Form.Item
        name="schoolId"
        label="Trường"
        rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
      >
        <Select disabled placeholder="Chọn trường">
          {schools.map((school) => (
            <Option key={school.id} value={school.id}>
              {school.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên ngành"
        rules={[
          { required: true, message: 'Vui lòng nhập tên ngành' },
          { min: 3, message: 'Tên ngành phải có ít nhất 3 ký tự' }
        ]}
      >
        <Input placeholder="Ví dụ: Công nghệ thông tin" />
      </Form.Item>
    </Form>
  </Modal>
);

export default MajorModal;

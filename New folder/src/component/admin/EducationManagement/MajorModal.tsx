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
}

const MajorModal: React.FC<Props> = ({ visible, onCancel, onOk, form, editingMajor, schools, selectedSchoolId }) => (
  <Modal
    title={editingMajor ? 'Chỉnh sửa ngành' : 'Thêm ngành'}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText={editingMajor ? 'Cập nhật' : 'Thêm'}
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
        name="name"
        label="Tên ngành"
        rules={[{ required: true, message: 'Vui lòng nhập tên ngành' }]}
      >
        <Input placeholder="Nhập tên ngành" />
      </Form.Item>
    </Form>
  </Modal>
);

export default MajorModal;

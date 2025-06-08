import React from 'react';
import { Modal, Form, Input } from 'antd';
import { School } from '../../../types/admin/EducationManagement/types';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: School) => void;
  form: any;
  editingSchool: School | null;
}

const SchoolModal: React.FC<Props> = ({ visible, onCancel, onOk, form, editingSchool }) => (
  <Modal
    title={editingSchool ? 'Chỉnh sửa trường' : 'Thêm trường'}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText={editingSchool ? 'Cập nhật' : 'Thêm'}
    cancelText="Hủy"
    destroyOnClose
  >
    <Form form={form} layout="vertical" onFinish={onOk}>
      <Form.Item
        name="name"
        label="Tên trường"
        rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
      >
        <Input placeholder="Nhập tên trường" />
      </Form.Item>
    </Form>
  </Modal>
);

export default SchoolModal;

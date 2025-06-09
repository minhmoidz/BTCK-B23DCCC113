import React from 'react';
import { Modal, Form, Input, Divider, Typography } from 'antd';
import { School } from '../../../types/admin/EducationManagement/types';

const { Title } = Typography;

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
    width={600}
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

      {!editingSchool && (
        <>
          <Divider>
            <Title level={5} style={{ margin: 0 }}>Thông tin tài khoản quản trị viên</Title>
          </Divider>

          <Form.Item
            name="adminName"
            label="Họ và tên quản trị viên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên quản trị viên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="adminEmail"
            label="Email quản trị viên"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="adminPassword"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="adminPhone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </>
      )}
    </Form>
  </Modal>
);

export default SchoolModal;

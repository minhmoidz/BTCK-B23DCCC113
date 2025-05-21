import React from 'react';
import { Form, Input, Button } from 'antd';

interface RegisterFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showNotification: (type: 'success' | 'error', message: string, description: string) => void;
  onRegister: (ten: string, sdt: string, email: string, password: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  goToAdminLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  loading,
  onRegister,
  setIsLogin,
  goToAdminLogin,
}) => {
  const [form] = Form.useForm();

  const onFinish = (values: { ten: string; sdt: string; email: string; password: string }) => {
    onRegister(values.ten, values.sdt, values.email, values.password);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Họ và tên"
        name="ten"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
      >
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="sdt"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        hasFeedback
      >
        <Input.Password placeholder="Nhập mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Đăng ký
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="link" onClick={() => setIsLogin(true)} block>
          Đã có tài khoản? Đăng nhập
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="default" onClick={goToAdminLogin} block>
          Đăng nhập Admin
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
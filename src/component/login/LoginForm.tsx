import React from 'react';
import { Form, Input, Button } from 'antd';

interface LoginFormProps {
  loading: boolean;
  onLogin: (sdt: string, password: string) => void;
  onRegister: () => void;
  goToAdminLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  onLogin,
  onRegister,
  goToAdminLogin,
}) => {
  const [form] = Form.useForm();

  const onFinish = (values: { sdt: string; password: string }) => {
    onLogin(values.sdt, values.password);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Số điện thoại"
        name="sdt"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
      >
        <Input placeholder="Nhập số điện thoại" autoComplete="tel" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password placeholder="Nhập mật khẩu" autoComplete="current-password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Đăng nhập
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="link" onClick={onRegister} block>
          Chưa có tài khoản? Đăng ký
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

export default LoginForm;
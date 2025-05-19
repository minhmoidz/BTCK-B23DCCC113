import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Link } = Typography;

interface LoginFormProps {
  onLogin: (username: string) => void;
  switchToRegister: () => void;
  showNotification: (type: 'success' | 'error', message: string, description: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, switchToRegister, showNotification }) => {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: { canCuoc: string; matKhau: string }) => {
    setLoading(true);
    try {
      // Gọi API đăng nhập với API endpoint của bạn
      const response = await axios.post('http://localhost:3000/api/login', {
        canCuoc: values.canCuoc,
        matKhau: values.matKhau
      });

      const { token, user } = response.data;
      
      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      // Gọi hàm callback để thông báo đăng nhập thành công
      onLogin(user.ten || user.canCuoc);
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      
      // Hiển thị thông báo lỗi
      let errorMessage = 'Không thể kết nối đến máy chủ';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || 'Đăng nhập thất bại';
      }
      
      showNotification('error', 'Đăng nhập thất bại', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={handleFinish}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="canCuoc"
        rules={[{ required: true, message: 'Vui lòng nhập căn cước công dân!' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Căn cước công dân" 
        />
      </Form.Item>

      <Form.Item
        name="matKhau"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '40px', backgroundColor: 'red', borderColor: 'red' }}>
          Đăng nhập
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <Text>
          Chưa có tài khoản? <Link onClick={switchToRegister} style={{ color: 'red' }}>Đăng ký ngay</Link>
        </Text>
      </div>
    </Form>
  );
};

export default LoginForm;
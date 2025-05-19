import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface AdminLoginFormProps {
  onLogin: (username: string) => void;
  showNotification: (type: 'success' | 'error', message: string, description: string) => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLogin, showNotification }) => {
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    
    // Kiểm tra thông tin đăng nhập admin (hard code)
    // Trong thực tế, bạn nên gọi API để xác thực
    if (values.username === 'admin' && values.password === 'admin123') {
      // Lưu token quản trị
      localStorage.setItem('adminToken', 'admin-token');
      localStorage.setItem('adminData', JSON.stringify({ username: 'admin', role: 'admin' }));
      
      // Thông báo thành công
      showNotification('success', 'Đăng nhập thành công', 'Chào mừng quản trị viên!');
      
      // Gọi hàm callback
      onLogin('Quản trị viên');
    } else {
      // Thông báo lỗi
      showNotification('error', 'Đăng nhập thất bại', 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
    
    setLoading(false);
  };

  return (
    <Form
      name="admin_login"
      initialValues={{ remember: true }}
      onFinish={handleFinish}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Tên đăng nhập" 
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '40px', backgroundColor: 'red', borderColor: 'red' }}>
          Đăng nhập quản trị
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">Chỉ dành cho quản trị viên hệ thống</Text>
      </div>
    </Form>
  );
};

export default AdminLoginForm;
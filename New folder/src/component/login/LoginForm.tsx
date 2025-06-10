<<<<<<< HEAD
import React from 'react';
import { Form, Input, Button } from 'antd';
=======
import React, { useState } from 'react';
import { Form, Input, Button, Segmented } from 'antd';
import { UserOutlined, KeyOutlined, PhoneOutlined } from '@ant-design/icons';

type LoginRole = 'user' | 'admin';
>>>>>>> temp-remote/main

interface LoginFormProps {
  loading: boolean;
  onLogin: (sdt: string, password: string) => void;
  onRegister: () => void;
<<<<<<< HEAD
  goToAdminLogin: () => void;
=======
  onAdminLogin?: (username: string, password: string) => void;
  goToAdminLogin?: () => void;
>>>>>>> temp-remote/main
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  onLogin,
  onRegister,
<<<<<<< HEAD
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
=======
  onAdminLogin,
  goToAdminLogin,
}) => {
  const [form] = Form.useForm();
  const [role, setRole] = useState<LoginRole>('user');

  const handleFormSubmit = (values: { identifier: string; password: string }) => {
    console.log('Form submitted:', { role, values });
    
    const identifier = values.identifier?.trim();
    const password = values.password?.trim();
    
    if (!identifier || !password) {
      console.error('Missing identifier or password');
      return;
    }
    
    if (role === 'user') {
      // Đăng nhập thường qua API
      console.log('Calling user login');
      onLogin(identifier, password);
    } else if (role === 'admin') {
      // Đăng nhập admin fix cứng
      console.log('Calling admin login');
      
      if (typeof onAdminLogin === 'function') {
        // Gọi hàm đăng nhập admin với tài khoản fix cứng
        onAdminLogin(identifier, password);
      } else if (typeof goToAdminLogin === 'function') {
        console.log('Using goToAdminLogin fallback');
        goToAdminLogin();
      } else {
        console.error('No admin login handler available');
      }
    }
  };

  const handleRoleChange = (value: LoginRole) => {
    console.log('Role changed to:', value);
    setRole(value);
    form.resetFields(['identifier']);
  };

  const isAdminLoginSupported = typeof onAdminLogin === 'function' || typeof goToAdminLogin === 'function';

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      name="unified_login_form"
      autoComplete="off"
    >
      {/* Segmented control để chọn loại đăng nhập */}
      {isAdminLoginSupported && (
        <Form.Item style={{ textAlign: 'center' }}>
          <Segmented<LoginRole>
            options={[
              { label: 'Thí sinh', value: 'user', icon: <UserOutlined /> },
              { label: 'Quản trị viên', value: 'admin', icon: <UserOutlined /> },
            ]}
            value={role}
            onChange={handleRoleChange}
            block
          />
        </Form.Item>
      )}

      {/* Input cho số điện thoại (user) hoặc email (admin) */}
      <Form.Item
        name="identifier"
        rules={[
          {
            required: true,
            message: role === 'user' 
              ? 'Vui lòng nhập số điện thoại!' 
              : 'Vui lòng nhập email Admin!',
          },
          ...(role === 'user' ? [{
            pattern: /^[0-9]{10,11}$/,
            message: 'Số điện thoại không hợp lệ!'
          }] : [{
            type: 'email' as const,
            message: 'Email không hợp lệ!'
          }])
        ]}
      >
        <Input
          prefix={role === 'user' ? <PhoneOutlined /> : <UserOutlined />}
          placeholder={role === 'user' ? 'Số điện thoại' : 'Email Admin'}
          size="large"
          autoComplete="off"
        />
      </Form.Item>

      {/* Input mật khẩu */}
      <Form.Item
        name="password"
        rules={[
          { 
            required: true, 
            message: 'Vui lòng nhập mật khẩu!' 
          },
          {
            min: 1,
            message: 'Mật khẩu không được để trống!'
          }
        ]}
      >
        <Input.Password
          prefix={<KeyOutlined />}
          placeholder="Mật khẩu"
          size="large"
          autoComplete="off"
        />
      </Form.Item>

      {/* Nút đăng nhập */}
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading} 
          block 
          size="large"
        >
          Đăng nhập{role === 'admin' ? ' Admin' : ''}
        </Button>
      </Form.Item>

      {/* Nút đăng ký chỉ hiện với user */}
      {role === 'user' && (
        <Form.Item>
          <Button type="link" onClick={onRegister} block>
            Chưa có tài khoản? Đăng ký ngay
          </Button>
        </Form.Item>
      )}

      {/* Hiển thị thông tin admin fix cứng khi chọn admin */}
      {role === 'admin' && (
        <Form.Item>
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            textAlign: 'center',
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            <strong>Tài khoản Admin Tổng:</strong><br />
            Email: admin@gmail.com<br />
            Mật khẩu: admin123
          </div>
        </Form.Item>
      )}
>>>>>>> temp-remote/main
    </Form>
  );
};

<<<<<<< HEAD
export default LoginForm;
=======
export default LoginForm;
>>>>>>> temp-remote/main

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface AdminLoginFormValues {
  username: string;
  password: string;
}

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      // Nếu chưa đăng nhập, hiển thị form đăng nhập
      setIsLoggedIn(false);
    } else {
      // Nếu đã đăng nhập, hiển thị nội dung trang admin
      setIsLoggedIn(true);
    }
  }, []);

  const showNotification = (type: 'success' | 'error', message: string, description: string) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
      duration: 3,
    });
  };

  // Xử lý đăng nhập admin
  const onFinishAdminLogin = (values: AdminLoginFormValues) => {
    setLoading(true);
    
    // Fix cứng tài khoản admin với username và password là "1"
    if (values.username === '1' && values.password === '1') {
      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem('adminToken', 'admin-token-123');
      localStorage.setItem('adminData', JSON.stringify({ username: values.username, role: 'admin' }));
      
      // Hiển thị thông báo thành công
      showNotification('success', 'Đăng nhập thành công', 'Chào mừng Admin!');
      
      // Đổi trạng thái đăng nhập
      setIsLoggedIn(true);
    } else {
      // Hiển thị thông báo lỗi nếu thông tin đăng nhập không đúng
      showNotification('error', 'Đăng nhập thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng!');
    }
    
    setLoading(false);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsLoggedIn(false);
    showNotification('success', 'Đăng xuất thành công', 'Tạm biệt!');
  };

  // Quay lại trang chủ
  const backToHome = () => {
    navigate('/');
  };

  // Form đăng nhập admin
  const renderLoginForm = () => {
    return (
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>
          Đăng nhập Quản trị
        </Title>

        <Form<AdminLoginFormValues> layout="vertical" onFinish={onFinishAdminLogin}>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng nhập
            </Button>
          </Form.Item>
          <Button type="link" onClick={backToHome} style={{ padding: 0 }}>
            Quay lại trang đăng nhập người dùng
          </Button>
        </Form>
      </Card>
    );
  };

  // Nội dung trang admin
  const renderAdminContent = () => {
    return (
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>
          Quản trị Hệ thống
        </Title>
        
        <div style={{ marginBottom: 20 }}>
          <p>Chào mừng bạn đến với trang quản trị. Tại đây bạn có thể quản lý:</p>
          <ul>
            <li>Quản lý người dùng</li>
            <li>Quản lý nội dung</li>
            <li>Cấu hình hệ thống</li>
            <li>Xem báo cáo</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="primary" onClick={() => alert('Tính năng đang phát triển!')}>
            Bảng điều khiển
          </Button>
          <Button danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: '50px auto' }}>
      {isLoggedIn ? renderAdminContent() : renderLoginForm()}
    </div>
  );
};

export default AdminPage;
import React, { useState, useEffect } from 'react';
import { Layout, Typography, notification, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import NewsSlider from './NewsSlider';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AdminLoginForm from './AdminLoginForm';
import { type User, usersDB } from './usersDB';

const { Content } = Layout;
const { Title, Text } = Typography;

interface LoginRegisterProps {
  onLogin: (username: string) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ onLogin }) => {
  const [users, setUsers] = useState<User[]>(usersDB);
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập chưa khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Nếu đã đăng nhập, chuyển hướng đến trang chính
        onLogin(user.ten || user.canCuoc);
        navigate('/xet-tuyen');
      } catch (error) {
        console.error('Lỗi khi phân tích thông tin người dùng:', error);
      }
    }
  }, [navigate, onLogin]);

  const showNotification = (type: 'success' | 'error', message: string, description: string) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: 3,
    });
  };

  const handleLogin = (username: string) => {
    showNotification('success', 'Đăng nhập thành công', `Chào mừng ${username} quay trở lại!`);
    onLogin(username);
    navigate('/xet-tuyen');
  };

  const handleRegister = (username: string, password: string): boolean => {
    const userExists = users.find(u => u.username === username);
    
    if (userExists) {
      showNotification('error', 'Đăng ký thất bại', 'Tên đăng nhập đã tồn tại!');
      return false;
    }
    
    setUsers(prev => [...prev, { username, password }]);
    setIsLogin(true);
    showNotification('success', 'Đăng ký thành công', 'Vui lòng đăng nhập với tài khoản mới của bạn!');
    return true;
  };

  return (
    <>
      {contextHolder}
      <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
        {/* Phần tin tức - bên trái */}
        <Content
          style={{
            display: 'flex',
            padding: 0,
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url("https://xdcs.cdnchinhphu.vn/446259493575335936/2024/8/19/bc1-1724044987903794541151.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flex: 6,
            position: 'relative',
            color: 'white',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexDirection: 'column',
            borderRight: '5px solid red',
          }}
        >
          <div style={{ 
            position: 'relative', 
            zIndex: 2, 
            width: '100%', 
            maxWidth: '950px',
            padding: '35px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            marginBottom: '50px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <Title level={2} style={{ color: 'white', textAlign: 'center', margin: '0 0 10px' }}>
                <span style={{ color: 'red' }}></span> NEWS
              </Title>
              <Divider style={{ backgroundColor: 'rgba(255,255,255,0.3)', margin: '15px 0' }}/>
            </div>
            <NewsSlider />
          </div>
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.2)',
              zIndex: 1
            }}
          />
        </Content>

        {/* Phần form đăng nhập/đăng ký - bên phải */}
        <Content
          style={{
            flex: 4,
            backgroundColor: '#f0f2f5',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
          }}
        >
          <div style={{
            width: '100%',
            maxWidth: '450px',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: '1px solid #e8e8e8'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Title level={1} style={{ color: 'red', margin: '0 0 12px', fontSize: '32px' }}>
                Hệ thống xét tuyển trực tuyến
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>Hệ thống xét tuyển</Text>
            </div>

            {/* Toggle chọn loại đăng nhập */}
            <Space style={{ marginBottom: 20, justifyContent: 'center', width: '100%' }}>
              <Text 
                strong={!isAdminLogin} 
                style={{ cursor: 'pointer', color: !isAdminLogin ? 'red' : undefined }} 
                onClick={() => setIsAdminLogin(false)}
              >
                Đăng nhập Người dùng
              </Text>
              <Text 
                strong={isAdminLogin} 
                style={{ cursor: 'pointer', color: isAdminLogin ? 'red' : undefined }} 
                onClick={() => setIsAdminLogin(true)}
              >
                Đăng nhập Quản trị viên
              </Text>
            </Space>

            {/* Hiển thị form tương ứng */}
            {isAdminLogin ? (
              <AdminLoginForm onLogin={handleLogin} showNotification={showNotification} />
            ) : (
              isLogin ? (
                <LoginForm 
                  users={users} 
                  onLogin={handleLogin} 
                  switchToRegister={() => setIsLogin(false)} 
                />
              ) : (
                <RegisterForm 
                  onRegister={handleRegister} 
                  switchToLogin={() => setIsLogin(true)} 
                />
              )
            )}
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default LoginRegister;
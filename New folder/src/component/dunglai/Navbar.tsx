import React from 'react';
import { Layout, Typography, Button, Space, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // import useNavigate

const { Header } = Layout;
const { Text } = Typography;

interface NavbarProps {
  username: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard'); // Đường dẫn dashboard, bạn thay đổi nếu khác
  };

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to right, #ffffff, #f0f2f5)',
        padding: '0 32px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        borderRadius: '0 0 8px 8px',
        height: 64,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo + Tên hệ thống có thể click */}
      <Space
        align="center"
        style={{ cursor: 'pointer' }}
        onClick={goToDashboard}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            goToDashboard();
          }
        }}
      >
        <AppstoreOutlined style={{ fontSize: 28, color: '#1890ff' }} />
        <Text style={{ fontSize: 20, fontWeight: 700, color: '#1890ff' }}>
          Hệ thống xét tuyển trực tuyến
        </Text>
      </Space>

      {/* Thông tin người dùng + nút đăng xuất */}
      <Space size="large" align="center">
        <Space align="center">
          <Avatar icon={<UserOutlined />} />
          <Text>
            Xin chào, <strong>{username}</strong>
          </Text>
        </Space>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={onLogout}
          style={{ fontWeight: 600 }}
        >
          Đăng xuất
        </Button>
      </Space>
    </Header>
  );
};

export default Navbar;

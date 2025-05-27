import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space, Badge, Button, Modal, message } from 'antd';
import { 
  DashboardOutlined, 
  FileOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Xử lý click menu user
  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      Modal.confirm({
        title: 'Xác nhận đăng xuất',
        content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
        okText: 'Đăng xuất',
        cancelText: 'Hủy',
        okType: 'danger',
        onOk() {
          // Xóa dữ liệu đăng nhập
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.clear();
          
          // Hiển thị thông báo
          message.success('Đăng xuất thành công');
          
          // Chuyển hướng về trang login
          navigate('/login');
          
          // Hoặc reload toàn bộ trang để đảm bảo clear hết state
          // window.location.href = '/login';
        },
      });
    } else if (key === 'profile') {
      // Xử lý mở profile
      message.info('Chức năng đang phát triển');
    } else if (key === 'settings') {
      // Xử lý mở settings
      message.info('Chức năng đang phát triển');
    }
  };

  // Xử lý click notification
  const handleNotificationClick = ({ key }) => {
    if (key === 'allNotifications') {
      message.info('Chuyển đến trang thông báo');
    } else {
      message.info(`Đã click vào thông báo: ${key}`);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const notificationItems = [
    {
      key: 'notification1',
      label: (
        <div style={{ maxWidth: 250 }}>
          <Text strong>Cập nhật hệ thống</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hệ thống vừa được cập nhật phiên bản mới
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            2 phút trước
          </Text>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'notification2',
      label: (
        <div style={{ maxWidth: 250 }}>
          <Text strong>Hồ sơ mới</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Có 5 hồ sơ mới cần duyệt
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            10 phút trước
          </Text>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'allNotifications',
      label: <Text type="link">Xem tất cả thông báo</Text>,
    },
  ];

  const menuItems = [
    {
      key: 'index',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'chi-tieu',
      icon: <FileOutlined />,
      label: 'Quản lý Xét tuyển',
    },
    {
      key: 'xet-tuyen',
      icon: <BankOutlined />,
      label: 'Quản lý Ngành, Trường',
    },
    {
      key: 'ho-so',
      icon: <UserOutlined />,
      label: 'Quản lý Hồ sơ',
    },
    {
      key: 'cau-hinh',
      icon: <SettingOutlined />,
      label: 'Cấu hình hệ thống',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'index') {
      navigate('/admin');
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={250} 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo Section */}
        <div 
          style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            background: 'rgba(255, 255, 255, 0.1)',
            margin: 16,
            borderRadius: 8,
          }}
        >
          {!collapsed ? (
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              🎓 Quản lý Tuyển sinh
            </Title>
          ) : (
            <Avatar style={{ backgroundColor: '#1890ff' }}>🎓</Avatar>
          )}
        </div>
        
        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.replace('/admin/', '') || 'index']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header 
          style={{ 
            background: '#fff', 
            padding: '0 24px', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          
          <Space size="large">
            {/* Notifications */}
            <Dropdown
              menu={{ 
                items: notificationItems,
                onClick: handleNotificationClick
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Badge count={2} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  size="large"
                />
              </Badge>
            </Dropdown>
            
            {/* User Menu */}
            <Dropdown
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }} 
                  icon={<UserOutlined />} 
                />
                <Text>Admin</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        {/* Content */}
        <Content 
          style={{ 
            margin: 24, 
            padding: 24, 
            background: '#fff', 
            minHeight: 280,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

<<<<<<< HEAD
import React from 'react';
import { Layout, Menu, Typography, Avatar } from 'antd';
import { DashboardOutlined, FileOutlined, UserOutlined, SettingOutlined, BankOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: 'index', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: 'chi-tieu', icon: <FileOutlined />, label: 'Quản lý Xét tuyển' },
  { key: 'xet-tuyen', icon: <BankOutlined />, label: 'Quản lý Ngành, Trường' },
  { key: 'ho-so', icon: <UserOutlined />, label: 'Quản lý Hồ sơ' },
  { key: 'thong-bao', icon: <BellOutlined />, label: 'Quản lý Thông báo' },
  { key: 'chat', icon: <SettingOutlined />, label: 'Cấu hình hệ thống' },
  { key: 'cau-hinh', icon: <SettingOutlined />, label: 'Cấu hình hệ thống' },
=======
import React, { useState, useMemo } from 'react';
import { Layout, Menu, Typography, Avatar, Flex, Dropdown } from 'antd';
import {
  DashboardOutlined,
  FileDoneOutlined,
  UserOutlined,
  SettingOutlined,
  BankOutlined,
  BellOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CommentOutlined,
  AuditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title, Text } = Typography;

// Định nghĩa cấu trúc menu với SubMenu
const getMenuItems = () => [
  { 
    key: 'index', 
    icon: <DashboardOutlined />, 
    label: 'Tổng quan' 
  },
  {
    key: 'management',
    icon: <AppstoreOutlined />,
    label: 'Quản lý chính',
    children: [
      { key: 'xet-tuyen', icon: <FileDoneOutlined />, label: 'Quản lý Xét tuyển' },
      { key: 'nganh-truong', icon: <BankOutlined />, label: 'Quản lý Ngành, Trường' },
      { key: 'ho-so', icon: <TeamOutlined />, label: 'Quản lý Thí sinh' },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: 'Hệ thống',
    children: [
      { key: 'qly-thong-bao', icon: <BellOutlined />, label: 'Quản lý Thông báo' },
      { key: 'chat', icon: <CommentOutlined />, label: 'Phòng hỗ trợ' },
      { key: 'cau-hinh', icon: <AuditOutlined />, label: 'Quy tắc hệ thống' },
    ],
  },
>>>>>>> temp-remote/main
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
  const handleMenuClick = ({ key }) => {
    if (key === 'index') navigate('/admin');
    else navigate(`/admin/${key}`);
  };

  return (
    <Sider
      width={250}
=======
  const menuItems = getMenuItems();

  // Logic để xác định menu nào đang active và submenu nào đang mở
  const { selectedKey, defaultOpenKey } = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentKey = pathParts[1] || 'index';

    // Tìm SubMenu cha của key hiện tại
    const parent = menuItems.find(item => 
      item.children?.some(child => child.key === currentKey)
    );

    return {
      selectedKey: currentKey,
      defaultOpenKey: parent ? parent.key : null,
    };
  }, [location.pathname, menuItems]);

  const [openKeys, setOpenKeys] = useState(defaultOpenKey ? [defaultOpenKey] : []);
  
  const handleMenuClick = ({ key }) => {
    if (key === 'index') {
      navigate('/admin');
    } else {
      navigate(`/admin/${key}`);
    }
  };
  
  const handleLogout = () => {
    // Thêm logic đăng xuất ở đây (ví dụ: xóa token, gọi API logout)
    console.log('User logged out');
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };
  
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Hồ sơ của tôi
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Sider
      width={260} // Tăng chiều rộng một chút để có không gian
>>>>>>> temp-remote/main
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
<<<<<<< HEAD
      }}
    >
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
=======
        borderRight: '1px solid #2a2a2a' // Thêm đường viền mờ
      }}
    >
      <Flex 
        align="center" 
        justify={collapsed ? 'center' : 'flex-start'}
        style={{
          height: 64,
          padding: '16px',
          margin: '16px 8px',
          cursor: 'pointer',
          transition: 'padding 0.2s',
        }}
        onClick={() => navigate('/admin')}
      >
        <Avatar 
          size={collapsed ? 'large' : 40}
          icon={<BankOutlined />}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            color: '#fff',
            minWidth: '40px'
          }}
        />
        {!collapsed && (
          <div style={{ marginLeft: 16 }}>
            <Title level={5} style={{ color: 'white', margin: 0, lineHeight: '1.2' }}>
              Tuyển Sinh
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 12 }}>
              Admin Panel
            </Text>
          </div>
        )}
      </Flex>
>>>>>>> temp-remote/main

      <Menu
        theme="dark"
        mode="inline"
<<<<<<< HEAD
        selectedKeys={[location.pathname.replace('/admin/', '') || 'index']}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
=======
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, padding: '0 8px' }}
      />
      
      {/* User Profile Section at the bottom */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '16px',
          borderTop: '1px solid #2a2a2a',
          background: '#001529'
        }}
      >
        <Dropdown overlay={userMenu} placement="topRight" arrow>
          <Flex align="center" style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            {!collapsed && (
              <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column' }}>
                <Text style={{ color: 'white', fontWeight: 500 }}>Admin Name</Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 12 }}>
                  Quản trị viên
                </Text>
              </div>
            )}
          </Flex>
        </Dropdown>
      </div>
>>>>>>> temp-remote/main
    </Sider>
  );
};

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> temp-remote/main

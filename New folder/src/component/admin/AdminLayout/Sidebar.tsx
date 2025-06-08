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
  { key: 'chat', icon: <SettingOutlined />, label: 'Cấu hình hệ thống' },
  { key: 'cau-hinh', icon: <SettingOutlined />, label: 'Cấu hình hệ thống' },
  { key: 'qly-thong-bao', icon: <BellOutlined />, label: 'Quản lý Thông báo' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    if (key === 'index') navigate('/admin');
    else navigate(`/admin/${key}`);
  };

  return (
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

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname.replace('/admin/', '') || 'index']}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;

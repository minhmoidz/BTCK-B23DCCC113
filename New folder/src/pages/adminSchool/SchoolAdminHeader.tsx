import React from 'react';
import { Layout, Avatar, Dropdown, Menu } from 'antd';

const { Header } = Layout;

const SchoolAdminHeader = ({ user, onLogout }) => {
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={onLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ fontWeight: 700, fontSize: 20 }}>
        <img src="/logo192.png" alt="logo" style={{ height: 32, marginRight: 12, verticalAlign: 'middle' }} />
        Quản lý hồ sơ trường {user.school?.name || user.schoolId}
      </div>
      <Dropdown overlay={menu}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Avatar style={{ background: '#1890ff', marginRight: 8 }}>
            {user.ten?.[0]?.toUpperCase() || user.school?.name?.[0]?.toUpperCase() || 'A'}
          </Avatar>
          <span>{user.ten || user.email}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default SchoolAdminHeader;

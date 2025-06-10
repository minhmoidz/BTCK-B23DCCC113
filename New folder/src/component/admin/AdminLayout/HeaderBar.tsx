import React from 'react';
import { Layout, Button, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';

const { Header } = Layout;

const HeaderBar = ({ collapsed, setCollapsed }) => (
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
      style={{ fontSize: 16 }}
    />
    <Space size="large">
      <NotificationMenu />
      <UserMenu />
    </Space>
  </Header>
);

export default HeaderBar;

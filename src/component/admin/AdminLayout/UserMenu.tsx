import React from 'react';
import { Dropdown, Avatar, Space, Typography, Modal, message, Menu } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const userMenuItems = [
  { key: 'profile', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
  { type: 'divider' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
];

const UserMenu = () => {
  const navigate = useNavigate();

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      Modal.confirm({
        title: 'Xác nhận đăng xuất',
        content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
        okText: 'Đăng xuất',
        cancelText: 'Hủy',
        okType: 'danger',
        onOk() {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.clear();
          message.success('Đăng xuất thành công');
          navigate('/login');
        },
      });
    } else if (key === 'profile' || key === 'settings') {
      message.info('Chức năng đang phát triển');
    }
  };

  return (
    <Dropdown
      menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Space style={{ cursor: 'pointer' }}>
        <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
        <Text>Admin</Text>
      </Space>
    </Dropdown>
  );
};

export default UserMenu;

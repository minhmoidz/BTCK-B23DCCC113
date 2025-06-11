import React from 'react';
import { Dropdown, Badge, Button, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Text } = Typography;

const notificationItems = [
  {
    key: 'notification1',
    label: (
      <div style={{ maxWidth: 250 }}>
        <Text strong>Cập nhật hệ thống</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Hệ thống vừa được cập nhật phiên bản mới
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 11 }}>
          2 phút trước
        </Text>
      </div>
    ),
  },
  { type: 'divider' },
  {
    key: 'notification2',
    label: (
      <div style={{ maxWidth: 250 }}>
        <Text strong>Hồ sơ mới</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Có 5 hồ sơ mới cần duyệt
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 11 }}>
          10 phút trước
        </Text>
      </div>
    ),
  },
  { type: 'divider' },
  { key: 'allNotifications', label: <Text type="link">Xem tất cả thông báo</Text> },
];

const NotificationMenu = () => {
  const handleNotificationClick = ({ key }) => {
    if (key === 'allNotifications') {
      // Ví dụ: chuyển trang thông báo
      alert('Chuyển đến trang thông báo');
    } else {
      alert(`Đã click vào thông báo: ${key}`);
    }
  };

  return (
    <Dropdown
      menu={{ items: notificationItems, onClick: handleNotificationClick }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={2} size="small">
        <Button type="text" icon={<BellOutlined />} size="large" />
      </Badge>
    </Dropdown>
  );
};

export default NotificationMenu;

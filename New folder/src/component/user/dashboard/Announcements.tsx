import React from 'react';
import { Card, Typography, Divider, Button, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

const announcements = [
  { id: 1, title: 'Thông báo tuyển sinh năm 2024', date: '15/05/2024' },
  { id: 2, title: 'Lịch xét tuyển học kỳ mới', date: '10/05/2024' },
];

const Announcements: React.FC = () => (
  <Card
    title={
      <Space>
        <BellOutlined style={{ color: '#1890ff' }} />
        <span>Thông báo mới</span>
      </Space>
    }
    style={{
      borderRadius: 12,
      height: '100%',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}
    headStyle={{
      borderBottom: '1px solid #f0f0f0',
      fontSize: 16,
      fontWeight: 500
    }}
  >
    {announcements.map(announcement => (
      <div key={announcement.id} style={{ marginBottom: 16 }}>
        <Paragraph
          ellipsis={{ rows: 1 }}
          style={{
            fontWeight: 500,
            marginBottom: 4,
            cursor: 'pointer',
            fontSize: 15
          }}
        >
          {announcement.title}
        </Paragraph>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {announcement.date}
        </Text>
        <Divider style={{ margin: '12px 0' }} />
      </div>
    ))}
    <div style={{ textAlign: 'center', marginTop: 24 }}>
      <Button type="link">Xem tất cả thông báo</Button>
    </div>
  </Card>
);

export default Announcements;

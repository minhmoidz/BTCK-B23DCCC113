import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const deadlines = [
  { name: 'Đăng ký dự thi ĐGNL', time: '01/02/2025 - 10/03/2025' },
  { name: 'Nộp lệ phí ĐGNL', time: '01/02/2025 - 12/03/2025' },
  { name: 'Đăng ký dự thi ĐGTD', time: '15/02/2025 - 20/03/2025' },
  { name: 'Nộp lệ phí ĐGTD', time: '15/02/2025 - 22/03/2025' },
];

const ThoiHan: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Thời hạn đăng ký & nộp lệ phí</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>Thí sinh cần lưu ý các mốc thời gian quan trọng dưới đây để không bỏ lỡ cơ hội dự thi và xét tuyển:</Paragraph>
        <List
          dataSource={deadlines}
          renderItem={item => (
            <List.Item>
              <b>{item.name}:</b> {item.time}
            </List.Item>
          )}
        />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default ThoiHan; 
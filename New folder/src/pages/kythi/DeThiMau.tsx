import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const deThi = [
  { name: 'Đề thi mẫu ĐGNL 2024', link: '#' },
  { name: 'Đề thi mẫu ĐGTD 2024', link: '#' },
  { name: 'Đáp án tham khảo ĐGNL', link: '#' },
  { name: 'Đáp án tham khảo ĐGTD', link: '#' },
];

const DeThiMau: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Đề thi mẫu & Đáp án tham khảo</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>
          Dưới đây là một số đề thi mẫu và đáp án tham khảo giúp thí sinh làm quen với cấu trúc đề và chuẩn bị tốt cho kỳ thi.
        </Paragraph>
        <List
          dataSource={deThi}
          renderItem={item => (
            <List.Item>
              <a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>
            </List.Item>
          )}
        />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DeThiMau; 
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
          Dưới đây là một số đề thi mẫu và đáp án tham khảo giúp thí sinh làm quen với cấu trúc đề, rèn luyện kỹ năng làm bài và chuẩn bị tốt cho kỳ thi thực tế. Nên luyện đề trong điều kiện giống thi thật để kiểm tra khả năng quản lý thời gian.
        </Paragraph>
        <Paragraph>
          <b>Hướng dẫn sử dụng:</b> Làm đề mẫu, tự chấm điểm theo đáp án, phân tích lỗi sai để rút kinh nghiệm. Tham khảo thêm các đề thi các năm trước và tài liệu ôn tập chính thống.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Không nên chỉ học thuộc đáp án, hãy tập trung rèn luyện tư duy, kỹ năng giải quyết vấn đề và đọc hiểu.
        </Paragraph>
        <List
          dataSource={deThi}
          renderItem={item => (
            <List.Item>
              <a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>
              {item.name.includes('ĐGNL') && <span style={{ color: '#888', marginLeft: 8 }}>(Dành cho kỳ thi Đánh giá năng lực)</span>}
              {item.name.includes('ĐGTD') && <span style={{ color: '#888', marginLeft: 8 }}>(Dành cho kỳ thi Đánh giá tư duy)</span>}
            </List.Item>
          )}
        />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DeThiMau; 
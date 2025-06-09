import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const news = [
  {
    img: '/news1.png',
    title: 'Cập nhật lịch thi ĐGNL & ĐGTD năm 2025',
    desc: 'Lịch thi mới nhất cho các đợt Đánh giá năng lực và Đánh giá tư duy đã được công bố. Thí sinh lưu ý các mốc đăng ký và dự thi quan trọng.',
    date: '10/06/2025',
  },
  {
    img: '/news2.png',
    title: 'Thay đổi quy chế xét tuyển đại học',
    desc: 'Bộ GD&ĐT vừa ban hành một số điều chỉnh về quy chế xét tuyển đại học năm 2025. Xem chi tiết để không bỏ lỡ thông tin quan trọng.',
    date: '05/06/2025',
  },
  {
    img: '/news3.png',
    title: 'Câu hỏi nổi bật: Nộp lệ phí trực tuyến thế nào?',
    desc: 'Nhiều thí sinh thắc mắc về quy trình nộp lệ phí dự thi và xét tuyển. Hệ thống đã cập nhật hướng dẫn chi tiết và giải đáp trên mục Hướng dẫn.',
    date: '01/06/2025',
  },
];

const NewsList: React.FC = () => (
  <div>
    {news.map((item, idx) => (
      <Card
        key={idx}
        style={{
          marginBottom: 20,
          borderRadius: 12,
          background: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
        bodyStyle={{ display: 'flex', gap: 16, padding: 16 }}
      >
        <img src={item.img} alt={item.title} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ color: '#1f1f1f', marginBottom: 4 }}>{item.title}</Title>
          <Paragraph style={{ color: '#595959', marginBottom: 8, fontSize: 14 }}>{item.desc}</Paragraph>
          <Text type="secondary" style={{ fontSize: 13 }}><CalendarOutlined /> {item.date}</Text>
        </div>
      </Card>
    ))}
    <div style={{ textAlign: 'right', marginTop: 8 }}>
      <a href="/thong-bao" style={{ color: '#1677ff', fontWeight: 600 }}>Xem thêm thông báo &rarr;</a>
    </div>
  </div>
);

export default NewsList; 
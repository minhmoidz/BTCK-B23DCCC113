import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const news = [
  {
    img: '/news1.png',
    title: 'Phát hành PHIẾU BÁO DỰ THI - PHIẾU BÁO ĐIỂM',
    desc: 'Hội đồng thi phát hành PHIẾU BÁO DỰ THI và PHIẾU BÁO ĐIỂM các đợt thi năm 2025',
    date: '07/03/2025',
  },
  {
    img: '/news2.png',
    title: 'Sửa hồ sơ thí sinh sau khi chọn ca thi',
    desc: 'Viện Đào tạo số và Khảo thí hướng dẫn thí sinh sửa hồ sơ đăng ký thi HSA sau khi chọn ca thi thành công như sau: KHÔNG HỖ TRỢ thay ảnh chân dung, không thay ảnh CCCD, không sửa toàn bộ họ tên, không sửa toàn bộ 12 số CCCD do thí sinh đã không làm đúng Hướng dẫn lập hồ và cố tình bỏ qua các cảnh báo để chọn ca thi.',
    date: '25/02/2025',
  },
  {
    img: '/news3.png',
    title: 'Nộp lệ phí ca thi đã đăng ký',
    desc: 'Thí sinh đã đăng ký thành công ca thi nộp lệ phí trước 96 giờ 00 kể từ khi chọn ca thi. Sau khoảng thời gian trên, ca thi sẽ bị huỷ tự động nếu không hoàn thành việc nộp lệ phí.',
    date: '24/02/2025',
  },
];

const NewsList: React.FC = () => (
  <div>
    {news.map((item, idx) => (
      <Card key={idx} style={{ marginBottom: 20, borderRadius: 12, background: '#18191a', color: '#fff' }} bodyStyle={{ display: 'flex', gap: 16, padding: 16 }}>
        <img src={item.img} alt={item.title} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ color: '#fff', marginBottom: 4 }}>{item.title}</Title>
          <Paragraph style={{ color: '#ccc', marginBottom: 8, fontSize: 14 }}>{item.desc}</Paragraph>
          <Text type="secondary" style={{ fontSize: 13, color: '#4da3ff' }}><CalendarOutlined /> {item.date}</Text>
        </div>
      </Card>
    ))}
    <div style={{ textAlign: 'right', marginTop: 8 }}>
      <a href="#" style={{ color: '#4da3ff', fontWeight: 600 }}>Xem thêm bài đăng &rarr;</a>
    </div>
  </div>
);

export default NewsList; 
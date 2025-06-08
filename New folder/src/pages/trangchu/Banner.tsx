import React from 'react';
import { Carousel, Typography } from 'antd';

const { Title } = Typography;

const banners = [
  {
    img: '/banner1.png',
    text: 'HSA.EDU.VN - ĐỒNG CÁC ĐỢT THI ĐÃ ĐỦ CHỖ ĐĂNG KÝ',
  },
  {
    img: '/banner2.png',
    text: 'Phát hành Phiếu báo Dự thi HSA',
  },
];

const Banner: React.FC = () => (
  <div
    style={{
      background: '#222',
      padding: '56px 0',
      minHeight: 340,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div style={{ width: '100%', maxWidth: 600 }}>
      <Carousel autoplay dots>
        {banners.map((b, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={b.img} alt={b.text} style={{ width: '100%', maxWidth: 520, height: 'auto', objectFit: 'cover', borderRadius: 16, marginBottom: 16 }} />
            <Title level={3} style={{ color: '#fff', textAlign: 'center', margin: 0 }}>{b.text}</Title>
          </div>
        ))}
      </Carousel>
    </div>
  </div>
);

export default Banner; 
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
  <Carousel
    autoplay
    arrows
    infinite
    style={{
      width: '100%',
      height: '550px',
      overflow: 'hidden',
    }}
  >
    {banners.map((b, idx) => (
      <div key={idx} style={{ position: 'relative', width: '100%', height: '550px' }}>
        <img
          src={b.img}
          alt={b.text}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
          textAlign: 'center',
          padding: '0 20px',
        }}>
          <Title level={2} style={{
            color: '#fff',
            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)',
            margin: 0,
          }}>{b.text}</Title>
        </div>
      </div>
    ))}
  </Carousel>
);

export default Banner; 
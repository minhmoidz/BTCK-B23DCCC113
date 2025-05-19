import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

const newsItems = [
  'Tin tức 1: Học sinh đạt giải cao trong kỳ thi quốc gia',
  'Tin tức 2: Lịch thi học kỳ sẽ diễn ra vào tháng 6',
  'Tin tức 3: Trường tổ chức ngày hội thể thao',
  'Tin tức 4: Khai giảng năm học mới 2025',
];

const NewsSlider: React.FC = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Typography.Text
      style={{
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'rgba(255,0,0,0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 8,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
      }}
      title={newsItems[currentNewsIndex]}
    >
      {newsItems[currentNewsIndex]}
    </Typography.Text>
  );
};

export default NewsSlider;

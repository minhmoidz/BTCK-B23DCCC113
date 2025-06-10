<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Empty, message, List } from 'antd';
import { CalendarOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { format } from 'date-fns';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const StyledListItem = styled(List.Item)`
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

interface Notification {
  _id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  image?: string;
  isPinned?: boolean;
  isImportant?: boolean;
}

const MAX_NEWS = 5;

const NewsList: React.FC = () => {
  const [news, setNews] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/notifications');
        if (response.data && response.data.data) {
          const sortedNews = response.data.data
            .sort((a: Notification, b: Notification) => {
              // Ưu tiên tin quan trọng trước
              if (a.isImportant && !b.isImportant) return -1;
              if (!a.isImportant && b.isImportant) return 1;
              
              // Sau đó đến tin ghim
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              
              // Cuối cùng sắp xếp theo thời gian
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .slice(0, MAX_NEWS);
          setNews(sortedNews);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        message.error('Không thể tải tin tức');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (id: string) => {
    navigate(`/thong-bao/${id}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (news.length === 0) {
    return <Empty description="Chưa có tin tức nào" />;
  }

  return (
    <Card
      title={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '8px 0'
        }}>
          <Title level={4} style={{ margin: 0 }}>Tin tức & Thông báo</Title>
          <a 
            onClick={() => navigate('/thong-bao')}
            style={{ 
              color: '#1677ff', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            Xem tất cả
            <RightOutlined />
          </a>
        </div>
      }
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
      bodyStyle={{ padding: '0 24px' }}
    >
      <List
        itemLayout="horizontal"
        dataSource={news}
        renderItem={(item) => (
          <StyledListItem onClick={() => handleNewsClick(item._id)}>
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              width: '100%',
              alignItems: 'flex-start',
              padding: '0 16px'
            }}>
              <img 
                src={item.image ? `http://localhost:3000/${item.image}` : '/default-news.png'} 
                alt={item.title} 
                style={{ 
                  width: '120px', 
                  height: '80px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  marginTop: '20px',
                  flexShrink: 0
                }} 
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Title 
                  level={5} 
                  ellipsis={{ rows: 2 }}
                  style={{ 
                    marginBottom: '8px',
                    lineHeight: '1.4',
                    color: '#262626'
                  }}
                >
                  {item.title}
                </Title>
                <Paragraph 
                  ellipsis={{ rows: 2 }}
                  style={{ 
                    fontSize: '14px',
                    color: '#595959',
                    marginBottom: '8px',
                    lineHeight: '1.6'
                  }}
                >
                  {item.description}
                </Paragraph>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CalendarOutlined /> 
                  {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                </Text>
              </div>
            </div>
          </StyledListItem>
        )}
      />
    </Card>
  );
};

export default NewsList;
=======
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
>>>>>>> temp-remote/main

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
        const response = await axios.get('https://btck-123.onrender.com/api/notifications');
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

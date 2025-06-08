import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Space,
  Spin,
  message,
  Row,
  Col,
  Breadcrumb,
} from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { API_URL } from '../../config/constants';
import { Notification, PaginatedResponse } from '../../types/notification';
import Navbar from '../../component/dunglai/Navbar';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ data: PaginatedResponse<Notification> }>(`${API_URL}/notifications`, {
        params: {
          page: 1,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { data } = response.data;
      setNotifications(data.docs);
    } catch (error) {
      message.error('Không thể tải thông báo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar username={''} onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } />
      
      <div style={{ flex: 1, padding: '24px 48px', backgroundColor: '#f5f5f5' }}>
        <Card style={{ marginBottom: 24 }}>
          <Breadcrumb
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: 'Thông tin' },
            ]}
          />
        </Card>

        <Card>
          <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: 32 }}>
            TRANG THÔNG TIN
          </Title>

          <Spin spinning={loading}>
            <Row gutter={[24, 24]}>
              {notifications.map((notification) => (
                <Col span={24} key={notification._id}>
                  <Link to={`/thong-tin/${notification._id}`}>
                    <Card
                      hoverable
                      style={{ height: '100%' }}
                      bodyStyle={{ padding: 20 }}
                    >
                      <Space direction="vertical" size={12} style={{ width: '100%' }}>
                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                          {notification.title}
                        </Title>
                        
                        <Space>
                          <CalendarOutlined style={{ color: '#8c8c8c' }} />
                          <Text type="secondary">
                            {dayjs(notification.createdAt).format('DD/MM/YYYY')}
                          </Text>
                        </Space>

                        <Text
                          style={{
                            color: '#595959',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {notification.content}
                        </Text>
                      </Space>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Spin>
        </Card>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#001529', 
        padding: '24px 48px',
        color: 'white',
        textAlign: 'center'
      }}>
        <Text style={{ color: 'white' }}>
          © 2024 Hệ thống Đăng ký thi Đánh giá năng lực. All rights reserved.
        </Text>
      </div>
    </div>
  );
};

export default NotificationPage;
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Space,
  Spin,
  message,
  Breadcrumb,
} from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { API_URL } from '../../config/constants';
import { Notification } from '../../types/notification';
import Navbar from '../trangchu/Navbar';
import { Link, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const NotificationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNotification = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ data: Notification }>(`${API_URL}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNotification(response.data.data);
    } catch (error) {
      message.error('Không thể tải thông tin chi tiết');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNotification();
    }
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: '24px 48px', backgroundColor: '#f5f5f5' }}>
        <Card style={{ marginBottom: 24 }}>
          <Breadcrumb
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/thong-tin">Thông tin</Link> },
              { title: notification?.title || 'Chi tiết thông báo' },
            ]}
          />
        </Card>

        <Card>
          <Spin spinning={loading}>
            {notification && (
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <Title level={2} style={{ margin: 0, color: '#1890ff', textAlign: 'center' }}>
                  {notification.title}
                </Title>

                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <CalendarOutlined style={{ color: '#8c8c8c' }} />
                    <Text type="secondary">
                      {dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </Space>
                </div>

                <div
                  style={{
                    color: '#262626',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {notification.content}
                </div>
              </Space>
            )}
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

export default NotificationDetail; 
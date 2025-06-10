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
import { Notification } from '../../types/notification';
import Navbar from '../trangchu/Navbar';
import NavbarAuth from '../../component/dunglai/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';
import FooterAuth from '../../component/dunglai/FooterPTIT';
import ChatWidget from '../../component/user/chat/ChatWidget';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/constants';

const { Title, Text } = Typography;

const NotificationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    initializePage();
  }, [id]);

  const initializePage = async () => {
    await checkAuthStatus();
    await fetchNotification();
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setUsername('');
        setAuthChecked(true);
        return;
      }

      // Sử dụng endpoint /auth/me để validate token
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.user) {
        setIsAuthenticated(true);
        setUsername(response.data.user.ten); // Lấy tên người dùng từ response
        localStorage.setItem('username', response.data.user.ten); // Cập nhật username trong localStorage
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      handleLogout();
    } finally {
      setAuthChecked(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    setAuthChecked(true);
    message.success('Đăng xuất thành công');
    navigate('/');
  };

  const fetchNotification = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get<{ data: Notification }>(`${API_URL}/notifications/${id}`, { headers });

      if (response.data && response.data.data) {
        setNotification(response.data.data);
      } else {
        message.error('Không tìm thấy thông báo');
        navigate('/thong-bao');
      }
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
      message.error('Không thể tải thông tin chi tiết');
      navigate('/thong-bao');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5' 
      }}>
        <Spin size="large" tip="Đang kiểm tra đăng nhập..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isAuthenticated ? (
        <NavbarAuth username={username} onLogout={handleLogout} />
      ) : (
        <Navbar />
      )}
      
      <div style={{ flex: 1, padding: '24px 48px', backgroundColor: '#f5f5f5' }}>
        

        <Card>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" tip="Đang tải thông báo..." />
            </div>
          ) : notification ? (
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
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">Không tìm thấy thông báo</Text>
            </div>
          )}
        </Card>
      </div>

      {isAuthenticated ? <FooterAuth /> : <FooterPTIT />}
      {isAuthenticated && <ChatWidget />}
    </div>
  );
};

export default NotificationDetail; 
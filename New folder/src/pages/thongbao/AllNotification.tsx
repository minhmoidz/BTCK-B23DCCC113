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
  Button,
  Avatar,
  Dropdown,
  Menu
} from 'antd';
import { CalendarOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../config/constants';
import { Notification } from '../../types/notification';
import Navbar from '../trangchu/Navbar';
import NavbarAuth from '../../component/dunglai/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';
import FooterAuth from '../../component/dunglai/FooterPTIT';
import ChatWidget from '../../component/user/chat/ChatWidget';

const { Title, Text, Paragraph } = Typography;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    await checkAuthStatus();
    await fetchNotifications();
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
      console.error('Auth check failed:', error);
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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_URL}/notifications`, { headers });

      if (response.data && response.data.data) {
        const sortedNotifications = response.data.data.sort((a: Notification, b: Notification) => {
          if (a.isImportant && !b.isImportant) return -1;
          if (!a.isImportant && b.isImportant) return 1;
          
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      message.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

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
          <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: 32 }}>
            TRANG THÔNG TIN
          </Title>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" tip="Đang tải thông báo..." />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Col span={24} key={notification._id}>
                    <Link to={`/thong-bao/${notification._id}`}>
                      <Card
                        hoverable
                        style={{ height: '100%', backgroundColor: '#fff' }}
                        bodyStyle={{ padding: 24 }}
                      >
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                          <img 
                            src={notification.image ? `${API_URL}/${notification.image}` : '/default-news.png'} 
                            alt={notification.title} 
                            style={{ 
                              width: '120px', 
                              height: '80px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              marginTop: '20px',
                              flexShrink: 0
                            }} 
                          />
                          <Space direction="vertical" size={16} style={{ flex: 1 }}>
                            <Title level={4} style={{ margin: 0, color: '#1890ff', fontSize: '18px' }}>
                              {notification.title}
                            </Title>
                            
                            <Space>
                              <CalendarOutlined style={{ color: '#8c8c8c' }} />
                              <Text type="secondary">
                                {dayjs(notification.createdAt).format('DD/MM/YYYY')}
                              </Text>
                            </Space>

                            <Paragraph
                              style={{
                                color: '#595959',
                                margin: 0,
                                fontSize: '14px',
                                lineHeight: '1.8'
                              }}
                              ellipsis={{ rows: 3 }}
                            >
                              {notification.description}
                            </Paragraph>
                          </Space>
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <Text type="secondary">Chưa có thông báo nào</Text>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </Card>
      </div>

      {isAuthenticated ? <FooterAuth /> : <FooterPTIT />}
      {isAuthenticated && <ChatWidget />}
    </div>
  );
};

export default NotificationPage;
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Space,
  Spin,
  message,
  Breadcrumb,
<<<<<<< HEAD
  Divider,
  Row,
  Col,
} from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
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

const { Title, Text, Paragraph } = Typography;

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

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.user) {
        setIsAuthenticated(true);
        setUsername(response.data.user.ten);
        localStorage.setItem('username', response.data.user.ten);
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
=======
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
>>>>>>> temp-remote/main

  const fetchNotification = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
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
=======
      const response = await axios.get<{ data: Notification }>(`${API_URL}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNotification(response.data.data);
    } catch (error) {
      message.error('Không thể tải thông tin chi tiết');
      console.error(error);
>>>>>>> temp-remote/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const renderFormattedContent = (content: string) => {
    const lines = content.split(/\r?\n/);
    
    return lines.map((line, index) => {
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} style={{ 
            marginLeft: '20px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'flex-start' 
          }}>
            <span style={{ marginRight: '8px', color: '#1890ff' }}>•</span>
            <Text style={{ flex: 1 }}>{line.substring(1).trim()}</Text>
          </div>
        );
      }
      
      else if (/^[0-9]+\./.test(line) || /^[A-Z\s]{5,}/.test(line)) {
        return (
          <Title level={4} key={index} style={{ 
            marginTop: '16px',
            marginBottom: '8px',
            fontSize: '16px',
            fontWeight: 600
          }}>
            {line}
          </Title>
        );
      }
      
      else if (line.includes('Lưu ý:') || line.includes('Chú ý:')) {
        return (
          <Paragraph key={index} style={{
            marginBottom: '8px',
            fontStyle: 'italic',
            color: '#ff4d4f',
            fontWeight: 500
          }}>
            {line}
          </Paragraph>
        );
      }
      
      else if (line.trim()) {
        return (
          <Paragraph key={index} style={{ marginBottom: '8px' }}>
            {line}
          </Paragraph>
        );
      }
      
      return <div key={index} style={{ height: '8px' }} />;
    });
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
        <Card 
          bordered={false}
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderRadius: '8px'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" tip="Đang tải thông báo..." />
            </div>
          ) : notification ? (
            <Space direction="vertical" size={32} style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Title level={2} style={{ 
                  margin: 0, 
                  color: '#1890ff',
                  fontSize: '28px',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  {notification.title}
                </Title>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Space split={<Divider type="vertical" />}>
                  <Space>
                    <CalendarOutlined style={{ color: '#8c8c8c' }} />
                    <Text type="secondary" style={{ fontSize: '15px' }}>
                      {dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </Space>
                  <Space>
                    <UserOutlined style={{ color: '#8c8c8c' }} />
                    <Text type="secondary" style={{ fontSize: '15px' }}>
                      Admin
                    </Text>
                  </Space>
                </Space>
              </div>

              <Divider style={{ margin: '24px 0' }} />

              <div
                style={{
                  padding: '0 40px',
                  background: '#fff',
                  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial',
                }}
              >
                {renderFormattedContent(notification.content)}
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
=======
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
>>>>>>> temp-remote/main
    </div>
  );
};

export default NotificationDetail; 
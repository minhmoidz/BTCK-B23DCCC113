// src/pages/Dashboard.tsx (Tệp đã được sửa đổi)

import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Select, Button, Space, Divider, Tooltip, Spin, message } from 'antd';
import { InfoCircleOutlined, RobotOutlined, RiseOutlined } from '@ant-design/icons';
import RootLayout from '../../component/dunglai/RootLayout';
import { useNavigate } from 'react-router-dom';
import ServiceCards from '../../component/user/dashboard/ServiceCards';
import Announcements from '../../component/user/dashboard/Announcements';

// 1. Import API từ service và component mới
import { dashboardApi } from '../../services/dashboardApi';
import TrendingSchools from './TrendingMajors';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface DashboardProps {
  userId: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onLogout }) => {
  const navigate = useNavigate();
  const [programType, setProgramType] = useState('Chính quy');
  const [year, setYear] = useState('2024');
  const [username, setUsername] = useState<string>('User');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // 2. Thêm state để lưu dữ liệu trường học và trạng thái loading
  const [trendingSchools, setTrendingSchools] = useState<SchoolData[]>([]);
  const [loadingSchools, setLoadingSchools] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUserData() {
      setLoadingUser(true);
      try {
        const res = await fetch(`http://localhost:3000/api/user/${userId}`);
        if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
        const data = await res.json();
        if (data.ten) setUsername(data.ten);
        else setUsername('User');
      } catch (error) {
        setUsername('User');
      } finally {
        setLoadingUser(false);
      }
    }

    if (userId) {
      fetchUserData();
    } else {
      setUsername('User');
      setLoadingUser(false);
    }
  }, [userId]);

  // 3. Thêm useEffect để gọi API thật
  useEffect(() => {
    const loadTrendingSchools = async () => {
      setLoadingSchools(true);
      try {
        // Gọi API thật từ dashboardApi
        const data = await dashboardApi.getTruongPhooBien();
        setTrendingSchools(data);
      } catch (error) {
        console.error("Failed to fetch trending schools:", error);
        message.error("Không thể tải danh sách các trường nổi bật.");
      } finally {
        setLoadingSchools(false);
      }
    };

    loadTrendingSchools();
  }, []); // [] đảm bảo chỉ gọi 1 lần

  return (
    <RootLayout username={username} onLogout={onLogout}>
      {/* Header (không thay đổi) */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: '40px 48px',
          marginBottom: 40,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          color: '#222',
          textAlign: 'center',
        }}
      >
        {loadingUser ? (
          <Spin size="large" />
        ) : (
          <Title level={1} style={{ fontWeight: 700, marginBottom: 12 }}>
            Xin chào, {username.toUpperCase()} <span role="img" aria-label="wave">👋</span>
          </Title>
        )}
        <Paragraph style={{ fontSize: 18, color: '#555', maxWidth: 720, margin: '0 auto 32px' }}>
          Chào mừng bạn đến với hệ thống xét tuyển trực tuyến. Khám phá các dịch vụ và thông tin tuyển sinh hữu ích dưới đây.
        </Paragraph>
        <Space size="large" wrap style={{ justifyContent: 'center' }}>
           <Select value={programType} onChange={setProgramType} style={{ width: 200 }} size="large">
             <Option value="Chính quy">Chính quy</Option>
             <Option value="Liên thông">Liên thông</Option>
           </Select>
           <Select value={year} onChange={setYear} style={{ width: 160 }} size="large">
             <Option value="2024">2024</Option>
             <Option value="2023">2023</Option>
           </Select>
           <Button type="primary" size="large" style={{ borderRadius: 10, fontWeight: 600 }}>
             Áp dụng
           </Button>
        </Space>
      </div>

      {/* Main content (không thay đổi) */}
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Title level={4} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', color: '#1890ff' }}>
            <InfoCircleOutlined style={{ marginRight: 10, fontSize: 24 }} />
            Dịch vụ trực tuyến
          </Title>
          <ServiceCards />
        </Col>

        <Col xs={24} lg={8}>
          <Announcements />
        </Col>
      </Row>

      {/* 4. Cập nhật phần hiển thị */}
      <div style={{ marginTop: 56 }}>
        <Divider>
          <Title level={3} style={{ margin: 0, paddingBottom: 6, color: '#003a8c', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RiseOutlined />
            Các trường nổi bật
          </Title>
        </Divider>
        <Paragraph style={{ textAlign: 'center', color: '#555', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Khám phá các trường đại học đang thu hút nhiều sự quan tâm và đăng ký nhất trong kỳ tuyển sinh năm nay.
        </Paragraph>
        {/* Sử dụng component TrendingSchools với dữ liệu thật */}
        <TrendingSchools schools={trendingSchools} loading={loadingSchools} />
      </div>

      {/* Chatbot và Footer (không thay đổi) */}
      <Tooltip title="Trò chuyện với trợ lý ảo">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<RobotOutlined />}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 64,
            height: 64,
            fontSize: 28,
            boxShadow: '0 6px 20px rgba(24, 144, 255, 0.4)',
            zIndex: 1100,
          }}
          onClick={() => navigate('/chat')}
        />
      </Tooltip>

      <footer
        style={{
          textAlign: 'center',
          marginTop: 80,
          padding: '24px 0',
          borderTop: '1px solid #e8e8e8',
          color: '#888',
        }}
      >
        <Text>© 2024 Hệ thống xét tuyển trực tuyến (PTIT). Tất cả quyền được bảo lưu.</Text>
      </footer>
    </RootLayout>
  );
};

export default Dashboard;
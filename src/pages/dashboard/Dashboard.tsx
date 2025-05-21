import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Select, Button, Space, Divider, Tooltip, Spin, message } from 'antd';
import { InfoCircleOutlined, RobotOutlined } from '@ant-design/icons';
import RootLayout from '../../component/dunglai/RootLayout';
import { useNavigate } from 'react-router-dom';
import TopMajorsBanner from '../../component/dunglai/TopMajorsBanner';
import ServiceCards from '../../component/dashboard/ServiceCards';
import Announcements from '../../component/dashboard/Announcements';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface DashboardProps {
  userId: string;        // Nhận userId thay vì username
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onLogout }) => {
  const navigate = useNavigate();
  const [programType, setProgramType] = useState('Chính quy');
  const [year, setYear] = useState('2024');
  const [username, setUsername] = useState<string>('User');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUserName() {
      setLoadingUser(true);
      try {
        const res = await fetch(`http://localhost:3000/api/user/${userId}`);
        if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
        const data = await res.json();
        if (data.ten) setUsername(data.ten);
        else setUsername('User');
      } catch (error) {
        message.error('Lấy tên người dùng thất bại');
        setUsername('User');
      } finally {
        setLoadingUser(false);
      }
    }
    if (userId) {
      fetchUserName();
    } else {
      setUsername('User');
      setLoadingUser(false);
    }
  }, [userId]);

  return (
    <RootLayout username={username} onLogout={onLogout}>
      {/* Header */}
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
          Chào mừng bạn đến với hệ thống xét tuyển trực tuyến. Vui lòng chọn loại hình đào tạo và năm học để tiếp tục.
        </Paragraph>
        <Space size="large" wrap style={{ justifyContent: 'center' }}>
          <Select
            value={programType}
            onChange={setProgramType}
            style={{ width: 200, borderRadius: 8 }}
            size="large"
            dropdownStyle={{ borderRadius: 12 }}
          >
            <Option value="Chính quy">Chính quy</Option>
            <Option value="Liên thông">Liên thông</Option>
          </Select>
          <Select
            value={year}
            onChange={setYear}
            style={{ width: 160, borderRadius: 8 }}
            size="large"
            dropdownStyle={{ borderRadius: 12 }}
          >
            <Option value="2024">2024</Option>
            <Option value="2023">2023</Option>
          </Select>
          <Button
            type="primary"
            size="large"
            style={{
              borderRadius: 10,
              padding: '0 36px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
            }}
          >
            Áp dụng
          </Button>
        </Space>
      </div>

      {/* Main content */}
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

      {/* Banner ngành học nổi bật */}
      <div style={{ marginTop: 56 }}>
        <Divider>
          <Title level={4} style={{ margin: 0, paddingBottom: 6, borderBottom: '3px solid #1890ff', display: 'inline-block' }}>
            Ngành học nổi bật
          </Title>
        </Divider>
        <TopMajorsBanner />
      </div>

      {/* Chatbot button */}
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
            backgroundColor: '#1890ff',
            border: 'none',
            zIndex: 1100,
          }}
          onClick={() => navigate('/chat')}
        />
      </Tooltip>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          marginTop: 80,
          padding: '24px 0',
          borderTop: '1px solid #e8e8e8',
          color: '#888',
          fontSize: 14,
          userSelect: 'none',
        }}
      >
        <Text>© 2024 Hệ thống xét tuyển trực tuyến (PTIT). Tất cả quyền được bảo lưu.</Text>
      </footer>
    </RootLayout>
  );
};

export default Dashboard;

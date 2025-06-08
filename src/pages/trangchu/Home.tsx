import React from 'react';
import { Button, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import ChatWidget from '../../component/user/chat/ChatWidget'; // <-- IMPORT COMPONENT CHAT

const { Title, Paragraph } = Typography;

const Home: React.FC = () => (
  <> {/* Sử dụng Fragment để bọc cả trang và widget */}
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6b8ce3, #b3c7f9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
        hoverable
      >
        <Title style={{ color: '#1d39c4', fontWeight: 'bold', fontFamily: "'Poppins', sans-serif" }}>
          TRANG NÀY XÂY NHƯ KIỂU TRANG GIỚI THIỆU VỀ TRƯỜNG, THÔNG TIN CÁC NGÀNH, CÁCH THỨC ĐĂNG KÍ DỰ THI NHÉ
        </Title>
        <Paragraph style={{ fontSize: 18, marginBottom: 40 }}>
          Vui lòng đăng nhập để truy cập hệ thống.
        </Paragraph>
        <Link to="/login">
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
              borderRadius: 12,
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ff7875';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff7875';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ff4d4f';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff4d4f';
            }}
          >
            Đăng Nhập / Đăng Ký
          </Button>
        </Link>
      </Card>
    </div>

    {/* THÊM WIDGET CHAT VÀO ĐÂY */}
    <ChatWidget />
  </>
);

export default Home;
import React from 'react';
import { Row, Col, Card, Badge, Button, Typography, Space, Divider } from 'antd';
import { BookOutlined, UserAddOutlined, CreditCardOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const cardData = [
  {
    title: 'Xét tuyển trực tuyến',
    icon: <BookOutlined style={{ fontSize: 40, color: '#1890ff' }} />,
    desc: 'Tham gia hệ thống xét tuyển trực tuyến đại học ',
    img: '/xettuyen.png',
    link: '/xettuyen',
    highlight: true,
  },
  {
    title: 'Dự đoán kết quả xét tuyển',
    icon: <UserAddOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
    desc: 'Tra cứu kết quả trực tuyến đại học nhanh nhất ',
    img: '/nhaphoc.png',
    link: '/tra-cuu',
    highlight: true,
  },
  {
    title: 'Thanh toán trực tuyến',
    icon: <CreditCardOutlined style={{ fontSize: 40, color: '#722ed1' }} />,
    desc: 'Tham gia hệ thống thanh toán trực tuyến đại học ',
    img: '/thanhtoan.png',
    link: '/thanh-toan',
    highlight: true,
  },
];

const ServiceCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Row gutter={[32, 32]}>
      {cardData.map(card => (
        <Col xs={24} sm={12} md={8} key={card.title}>
          <Badge.Ribbon
            text="Phổ biến"
            color="#1890ff"
            style={{ display: card.highlight ? 'block' : 'none' }}
          >
            <Card
              hoverable
              onClick={() => navigate(card.link)}
              style={{
                borderRadius: 16,
                height: '100%',
                boxShadow: card.highlight
                  ? '0 8px 24px rgba(24, 144, 255, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: card.highlight ? '1px solid #1890ff' : '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
              bodyStyle={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: card.highlight ? 'rgba(24, 144, 255, 0.1)' : '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: 40,
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <Title level={4} style={{ textAlign: 'center', marginBottom: 12 }}>
                {card.title}
              </Title>
              <Paragraph
                style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: 15,
                  flexGrow: 1,
                  marginBottom: 24,
                  minHeight: 48,
                }}
              >
                {card.desc}
              </Paragraph>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img
                  src={card.img}
                  alt={card.title}
                  style={{
                    maxHeight: 140,
                    objectFit: 'contain',
                    maxWidth: '100%',
                    userSelect: 'none',
                  }}
                  draggable={false}
                />
              </div>
              <Divider style={{ margin: '0 0 16px 0' }} />
              <Space style={{ justifyContent: 'center', width: '100%' }}>
                <Button
                  type={card.highlight ? 'primary' : 'default'}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(card.link);
                  }}
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                    padding: '6px 20px',
                    fontSize: 16,
                    minWidth: 140,
                  }}
                >
                  Xem chi tiết <ArrowRightOutlined />
                </Button>
              </Space>
            </Card>
          </Badge.Ribbon>
        </Col>
      ))}
    </Row>
  );
};

export default ServiceCards;

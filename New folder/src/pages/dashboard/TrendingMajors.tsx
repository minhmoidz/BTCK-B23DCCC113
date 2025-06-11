// src/component/user/dashboard/TrendingSchools.tsx

import React from 'react';
import { Card, Row, Col, Typography, Statistic, Button, Skeleton, Badge, Empty } from 'antd';
import { TrophyOutlined, ArrowRightOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

// Sử dụng lại kiểu dữ liệu TruongPhooBien từ file types/index.ts nếu có
// Hoặc định nghĩa lại ở đây cho rõ ràng
export interface SchoolData {
  maTruong: string;
  tenTruong: string;
  soLuongDangKy: number;
}

interface TrendingSchoolsProps {
  schools: SchoolData[];
  loading: boolean;
}

const TrendingSchools: React.FC<TrendingSchoolsProps> = ({ schools, loading }) => {
  const navigate = useNavigate();

  const handleViewDetails = (schoolId: string) => {
    // Điều hướng đến trang chi tiết các trường (ví dụ)
    navigate(`/schools/${schoolId}`);
  };

  // Giao diện khi đang tải dữ liệu
  if (loading) {
    return (
      <Row gutter={[24, 24]}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Col xs={24} md={12} lg={8} key={index}>
            <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  // Giao diện khi không có dữ liệu
  if (!schools || schools.length === 0) {
    return (
      <div style={{ padding: '40px 0' }}>
        <Empty description="Chưa có dữ liệu về các trường nổi bật." />
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {schools.slice(0, 3).map((school, index) => ( // Chỉ hiển thị top 3 cho gọn
        <Col xs={24} md={12} lg={8} key={school.maTruong}>
          <Badge.Ribbon
            text={
              index === 0 ? (
                <>
                  <TrophyOutlined /> TOP 1
                </>
              ) : `TOP ${index + 1}`
            }
            color={index === 0 ? 'gold' : index === 1 ? 'cyan' : 'purple'}
          >
            <Card
              hoverable
              style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', height: '100%' }}
              actions={[
                <Button 
                  type="link" 
                  key="details" 
                  onClick={() => handleViewDetails(school.maTruong)}
                  style={{ fontWeight: 'bold' }}
                >
                  Xem thông tin tuyển sinh <ArrowRightOutlined />
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <Title level={5} style={{ marginBottom: 0 }}>
                    {school.tenTruong}
                  </Title>
                }
                description={`Mã trường: ${school.maTruong}`}
              />
              <Paragraph style={{ marginTop: 16, color: '#555' }}>
                Một trong những lựa chọn hàng đầu của thí sinh trong mùa tuyển sinh năm nay.
              </Paragraph>
              <Statistic
                title="Tổng lượt đăng ký"
                value={school.soLuongDangKy}
                prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#2f54eb', fontWeight: 600 }}
              />
            </Card>
          </Badge.Ribbon>
        </Col>
      ))}
    </Row>
  );
};

export default TrendingSchools;
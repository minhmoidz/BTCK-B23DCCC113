import React from 'react';
import { Card, Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const industries = [
  { name: 'Công nghệ thông tin', desc: 'Đào tạo kỹ sư phần mềm, hệ thống thông tin, AI, IoT, an ninh mạng...' },
  { name: 'Kinh tế', desc: 'Quản trị kinh doanh, Marketing, Kế toán, Tài chính ngân hàng...' },
  { name: 'Ngôn ngữ Anh', desc: 'Đào tạo chuyên sâu về tiếng Anh, biên phiên dịch, tiếng Anh thương mại...' },
  { name: 'Kỹ thuật điện tử', desc: 'Điện tử viễn thông, tự động hóa, robot, thiết bị thông minh...' },
];

const IndustryInfo: React.FC = () => (
  <Card style={{ borderRadius: 16, marginBottom: 32 }} bodyStyle={{ padding: 32 }}>
    <Title level={3} style={{ color: '#4da3ff', marginBottom: 24 }}>Thông tin các ngành đào tạo</Title>
    <Row gutter={[24, 24]}>
      {industries.map((ind, idx) => (
        <Col xs={24} sm={12} key={idx}>
          <Card hoverable style={{ borderRadius: 12, minHeight: 120 }}>
            <Title level={5} style={{ color: '#1d39c4', marginBottom: 8 }}>{ind.name}</Title>
            <Paragraph style={{ color: '#333', fontSize: 15 }}>{ind.desc}</Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  </Card>
);

export default IndustryInfo; 
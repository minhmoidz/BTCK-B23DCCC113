import React from 'react';
import { Card, Typography, Row, Col, Tag } from 'antd';

const { Title, Paragraph, Text } = Typography;

const industries = [
  {
    name: 'Công nghệ thông tin',
    desc: 'Đào tạo kỹ sư phần mềm, hệ thống thông tin, AI, IoT, an ninh mạng... Cơ hội nghề nghiệp rộng mở trong lĩnh vực công nghệ, lập trình, dữ liệu.',
    schools: ['ĐH Bách Khoa Hà Nội', 'ĐH Công nghệ - ĐHQGHN', 'Học viện Công nghệ Bưu chính Viễn thông']
  },
  {
    name: 'Kinh tế',
    desc: 'Quản trị kinh doanh, Marketing, Kế toán, Tài chính ngân hàng... Cơ hội làm việc tại doanh nghiệp, ngân hàng, tập đoàn lớn.',
    schools: ['ĐH Kinh tế Quốc dân', 'ĐH Ngoại thương', 'Học viện Tài chính']
  },
  {
    name: 'Kỹ thuật điện tử',
    desc: 'Điện tử viễn thông, tự động hóa, robot, thiết bị thông minh... Nhu cầu lớn trong các tập đoàn công nghệ, sản xuất.',
    schools: ['ĐH Bách Khoa Hà Nội', 'Học viện Kỹ thuật Quân sự', 'ĐH Công nghiệp Hà Nội']
  },
  {
    name: 'Ngôn ngữ Anh',
    desc: 'Đào tạo chuyên sâu về tiếng Anh, biên phiên dịch, tiếng Anh thương mại... Cơ hội làm việc tại doanh nghiệp quốc tế, tổ chức nước ngoài.',
    schools: ['ĐH Ngoại ngữ - ĐHQGHN', 'ĐH Hà Nội', 'ĐH Sư phạm TP.HCM']
  },
  {
    name: 'Y dược',
    desc: 'Bác sĩ, dược sĩ, điều dưỡng... Cơ hội làm việc tại bệnh viện, trung tâm y tế, công ty dược phẩm.',
    schools: ['ĐH Y Hà Nội', 'ĐH Dược Hà Nội', 'ĐH Y Dược TP.HCM']
  },
  {
    name: 'Khoa học xã hội',
    desc: 'Tâm lý học, xã hội học, báo chí, truyền thông... Cơ hội làm việc tại các tổ chức xã hội, truyền thông, báo chí.',
    schools: ['ĐH Khoa học Xã hội & Nhân văn - ĐHQGHN', 'Học viện Báo chí & Tuyên truyền', 'ĐH Văn hóa Hà Nội']
  },
];

const IndustryInfo: React.FC = () => (
  <div style={{ marginBottom: 32 }}>
    <Title level={3} style={{ color: '#4da3ff', marginBottom: 24 }}>Thông tin các ngành đào tạo</Title>
    <Row gutter={[24, 24]}>
      {industries.map((ind, idx) => (
        <Col xs={24} sm={12} md={8} key={idx}>
          <Card hoverable style={{ borderRadius: 12, minHeight: 180 }}>
            <Title level={5} style={{ color: '#1677ff', marginBottom: 8 }}>{ind.name}</Title>
            <Paragraph style={{ marginBottom: 8 }}>{ind.desc}</Paragraph>
            <Text strong>Trường tiêu biểu: </Text>
            {ind.schools.map((school, i) => (
              <Tag color="blue" key={i} style={{ marginBottom: 4 }}>{school}</Tag>
            ))}
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default IndustryInfo; 
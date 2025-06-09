import React from 'react';
import { Layout, Typography, Breadcrumb, Row, Col, Card } from 'antd';
import { FileTextOutlined, TeamOutlined, ProfileOutlined } from '@ant-design/icons';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const QuyCheThi: React.FC = () => {
  return (
    <Layout>
      <Navbar />
      <Content style={{ padding: '0 48px', marginTop: 32 }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Hướng dẫn</Breadcrumb.Item>
          <Breadcrumb.Item>Quy chế thi</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 280, borderRadius: 12 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            Quy chế và Hướng dẫn thi Đánh giá năng lực (HSA)
          </Title>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                cover={<FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', paddingTop: 24, textAlign: 'center' }} />}
              >
                <Card.Meta
                  title={<Title level={4}>Đối tượng dự thi</Title>}
                  description="Thí sinh là học sinh lớp 12 hoặc đã tốt nghiệp THPT, có đủ sức khỏe và không trong thời gian bị kỷ luật."
                />
              </Card>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                cover={<TeamOutlined style={{ fontSize: '48px', color: '#1890ff', paddingTop: 24, textAlign: 'center' }} />}
              >
                <Card.Meta
                  title={<Title level={4}>Lịch thi và Ca thi</Title>}
                  description="Kỳ thi được tổ chức thành nhiều đợt trong năm. Thí sinh đăng ký ca thi phù hợp và có mặt tại địa điểm thi đúng giờ."
                />
              </Card>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Card
                hoverable
                cover={<ProfileOutlined style={{ fontSize: '48px', color: '#1890ff', paddingTop: 24, textAlign: 'center' }} />}
              >
                <Card.Meta
                  title={<Title level={4}>Giấy tờ cần thiết</Title>}
                  description="Thí sinh phải mang theo CMND/CCCD và Phiếu báo dự thi khi vào phòng thi. Không mang các thiết bị điện tử."
                />
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 48 }}>
            <Title level={3}>Nội dung quy chế chi tiết</Title>
            <Paragraph>
              Đây là nội dung chi tiết về quy chế thi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.
            </Paragraph>
            <Paragraph>
              Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.
            </Paragraph>
            <Paragraph>
              Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Sorbi in harmonig, neque voluptatem, a sequi, a sequi, a sequi, a sequi, a sequi.
            </Paragraph>
          </div>
        </div>
      </Content>
      <FooterPTIT />
    </Layout>
  );
};

export default QuyCheThi; 
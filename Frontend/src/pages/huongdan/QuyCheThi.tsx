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
              <b>1. Đối tượng dự thi:</b> Thí sinh là học sinh lớp 12 hoặc đã tốt nghiệp THPT, có đủ sức khỏe, không trong thời gian bị kỷ luật hoặc truy cứu trách nhiệm hình sự. Mỗi thí sinh chỉ được đăng ký 1 tài khoản duy nhất trên hệ thống.
            </Paragraph>
            <Paragraph>
              <b>2. Quy trình thi:</b> Thí sinh đăng ký dự thi, nhận phiếu báo dự thi, có mặt tại địa điểm thi đúng giờ, mang theo đầy đủ giấy tờ tùy thân (CMND/CCCD, phiếu báo dự thi). Thí sinh phải tuân thủ hướng dẫn của cán bộ coi thi trong suốt quá trình thi.
            </Paragraph>
            <Paragraph>
              <b>3. Quy định phòng thi:</b> Không được mang vào phòng thi các vật dụng bị cấm như điện thoại, thiết bị thu phát sóng, tài liệu, giấy tờ không liên quan. Thí sinh vi phạm sẽ bị lập biên bản và xử lý theo quy định.
            </Paragraph>
            <Paragraph>
              <b>4. Xử lý vi phạm:</b> Các hành vi gian lận, trao đổi bài, sử dụng tài liệu, thi hộ, gây rối trật tự sẽ bị đình chỉ thi và hủy kết quả. Trường hợp nghiêm trọng có thể bị truy cứu trách nhiệm hình sự.
            </Paragraph>
            <Paragraph>
              <b>5. Quyền lợi thí sinh:</b> Được đảm bảo quyền lợi về bảo mật thông tin, quyền khiếu nại/phản ánh về kết quả thi, được hỗ trợ giải đáp thắc mắc trong quá trình dự thi và xét tuyển.
            </Paragraph>
            <Paragraph>
              <b>Lưu ý:</b> Thí sinh nên đọc kỹ quy chế thi, chuẩn bị đầy đủ giấy tờ và tuân thủ mọi quy định để tránh các sự cố không mong muốn.
            </Paragraph>
          </div>
        </div>
      </Content>
      <FooterPTIT />
    </Layout>
  );
};

export default QuyCheThi; 
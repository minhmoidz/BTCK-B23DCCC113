import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import {
  FacebookFilled,
  YoutubeFilled,
  ArrowUpOutlined,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const FooterPTIT: React.FC = () => {
  return (
    <div style={{ background: '#f0f2f5', padding: '50px 0 30px 0', borderTop: '1px solid #ccc' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[48, 32]}>
          {/* Cột 1 */}
          <Col xs={24} md={10}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <img
                src="/logo.png" // Logo chung của hệ thống, bạn thay đường dẫn phù hợp
                alt="Logo Hệ thống xét tuyển trực tuyến"
                style={{ width: 70, height: 70, objectFit: 'contain', marginTop: 4 }}
              />
              <div>
                <Title level={4} style={{ margin: 0, color: '#111', fontWeight: 700 }}>
                  Hệ thống xét tuyển trực tuyến
                </Title>
                <Text style={{ color: '#333', display: 'block', margin: '12px 0 20px 0', lineHeight: 1.8 }}>
                  Nền tảng hỗ trợ đăng ký, xét tuyển và nhập học trực tuyến dành cho các trường đại học và cao đẳng trên toàn quốc.
                </Text>
                <Space size="large">
                  <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" aria-label="Zalo">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                      alt="Zalo"
                      width={36}
                      height={36}
                    />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FacebookFilled style={{ fontSize: 36, color: '#1877f3' }} />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <YoutubeFilled style={{ fontSize: 36, color: '#ff0000' }} />
                  </a>
                </Space>
              </div>
            </div>
          </Col>

          {/* Cột 2 */}
          <Col xs={24} md={7}>
            <Title level={5} style={{ color: '#111', marginBottom: 16 }}>THÔNG TIN LIÊN HỆ</Title>
            <div style={{ color: '#333', fontSize: 16, lineHeight: 2.2 }}>
              <div>Email hỗ trợ: <Link href="mailto:support@xettuyen.vn">support@xettuyen.vn</Link></div>
              <div>Website chính thức: <Link href="https://xettuyen.vn" target="_blank" rel="noopener noreferrer">https://xettuyen.vn</Link></div>
              <div>Hỗ trợ tuyển sinh: <Link href="https://tuyensinh.xettuyen.vn" target="_blank" rel="noopener noreferrer">https://tuyensinh.xettuyen.vn</Link></div>
              <div>Điện thoại hỗ trợ: <Text strong>1900 1234</Text></div>
            </div>
          </Col>

          {/* Cột 3 */}
          <Col xs={24} md={7}>
            <Title level={5} style={{ color: '#111', marginBottom: 16 }}>ĐỊA CHỈ LIÊN HỆ</Title>
            <div style={{ color: '#333', fontSize: 16, lineHeight: 2.2 }}>
              <div><Text strong>Trụ sở chính:</Text> 123 Đường ABC, Quận 1, Thành phố Hồ Chí Minh</div>
              <div><Text strong>Văn phòng miền Bắc:</Text> 456 Đường XYZ, Quận Cầu Giấy, Hà Nội</div>
              <div><Text strong>Văn phòng miền Trung:</Text> 789 Đường DEF, Quận Hải Châu, Đà Nẵng</div>
            </div>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <a href="#top" title="Lên đầu trang" aria-label="Lên đầu trang">
                <ArrowUpOutlined
                  style={{
                    fontSize: 30,
                    color: 'red',
                    background: '#fff',
                    borderRadius: '50%',
                    border: '1px solid #ccc',
                    padding: 6,
                    cursor: 'pointer',
                  }}
                />
              </a>
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', color: '#666', marginTop: 40, fontSize: 14 }}>
          © 2025 Hệ thống xét tuyển trực tuyến. Bản quyền thuộc về đơn vị phát triển.
        </div>
      </div>
    </div>
  );
};

export default FooterPTIT;

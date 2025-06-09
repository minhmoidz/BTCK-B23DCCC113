import React from 'react';
import { Typography, Card } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const DangKy: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Đăng ký dự thi & Xét tuyển</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>
          Thí sinh cần tạo tài khoản, khai báo hồ sơ cá nhân, chọn ngành/nguyện vọng và xác nhận đăng ký dự thi hoặc xét tuyển trên hệ thống. Sau khi đăng ký thành công, thí sinh sẽ nhận được mã hồ sơ và hướng dẫn tiếp theo qua email hoặc tài khoản cá nhân.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Thông tin đăng ký phải chính xác, trùng khớp với giấy tờ tùy thân. Nếu phát hiện sai sót, liên hệ bộ phận hỗ trợ để được điều chỉnh kịp thời.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DangKy; 
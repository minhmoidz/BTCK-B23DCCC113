import React from 'react';
import { Typography, Card } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const LePhi: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Hướng dẫn nộp lệ phí</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>
          Thí sinh có thể nộp lệ phí dự thi/xét tuyển qua các hình thức: chuyển khoản ngân hàng, ví điện tử hoặc thanh toán trực tiếp tại các điểm thu nhận hồ sơ. Sau khi nộp lệ phí, hệ thống sẽ cập nhật trạng thái và gửi xác nhận về tài khoản cá nhân.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Giữ lại biên lai hoặc xác nhận giao dịch để đối chiếu khi cần thiết. Nếu gặp sự cố khi nộp lệ phí, liên hệ ngay bộ phận hỗ trợ.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default LePhi; 
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
          <b>1. Chuyển khoản ngân hàng:</b> Sử dụng thông tin tài khoản ngân hàng do hệ thống cung cấp. Ghi rõ họ tên, mã hồ sơ khi chuyển khoản. Sau khi chuyển, lưu lại biên lai và tải lên hệ thống để xác nhận.
        </Paragraph>
        <Paragraph>
          <b>2. Ví điện tử:</b> Thanh toán qua các ví điện tử liên kết (Momo, ZaloPay, ViettelPay...). Chọn đúng dịch vụ, nhập mã hồ sơ, xác nhận giao dịch và lưu lại biên nhận.
        </Paragraph>
        <Paragraph>
          <b>3. Nộp trực tiếp:</b> Đến các điểm thu nhận hồ sơ được công bố trên website, nộp lệ phí và nhận biên lai xác nhận.
        </Paragraph>
        <Paragraph>
          Sau khi nộp lệ phí, hệ thống sẽ cập nhật trạng thái và gửi xác nhận về tài khoản cá nhân. Nếu sau 24h chưa thấy cập nhật, liên hệ bộ phận hỗ trợ.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Giữ lại biên lai hoặc xác nhận giao dịch để đối chiếu khi cần thiết. Nếu gặp sự cố khi nộp lệ phí, liên hệ ngay bộ phận hỗ trợ qua hotline/email.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default LePhi; 
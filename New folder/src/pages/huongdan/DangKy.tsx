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
          <b>Bước 1:</b> Truy cập hệ thống, chọn mục "Đăng ký" và tạo tài khoản bằng số điện thoại/email cá nhân. Xác thực tài khoản qua mã OTP gửi về điện thoại/email.
        </Paragraph>
        <Paragraph>
          <b>Bước 2:</b> Đăng nhập, khai báo đầy đủ thông tin cá nhân, thông tin liên hệ, tải lên ảnh chân dung và giấy tờ tùy thân (CMND/CCCD).
        </Paragraph>
        <Paragraph>
          <b>Bước 3:</b> Chọn ngành/nguyện vọng, phương thức xét tuyển (ĐGNL, ĐGTD, THPT...), nhập thông tin học tập, thành tích (nếu có).
        </Paragraph>
        <Paragraph>
          <b>Bước 4:</b> Xác nhận đăng ký, kiểm tra lại toàn bộ thông tin. Sau khi đăng ký thành công, hệ thống sẽ gửi mã hồ sơ và hướng dẫn tiếp theo qua email hoặc tài khoản cá nhân.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Thông tin đăng ký phải chính xác, trùng khớp với giấy tờ tùy thân. Nếu phát hiện sai sót, liên hệ bộ phận hỗ trợ để được điều chỉnh kịp thời. Không chia sẻ tài khoản/mã hồ sơ cho người khác.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DangKy; 
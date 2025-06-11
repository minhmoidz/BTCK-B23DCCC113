import React from 'react';
import { Typography, Card } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const TraCuu: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Hướng dẫn tra cứu kết quả</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>
          <b>Bước 1:</b> Đăng nhập vào hệ thống bằng tài khoản cá nhân đã đăng ký.
        </Paragraph>
        <Paragraph>
          <b>Bước 2:</b> Chọn mục "Tra cứu" trên menu, chọn loại kết quả muốn tra cứu (điểm thi, trạng thái hồ sơ, thông báo cá nhân...).
        </Paragraph>
        <Paragraph>
          <b>Bước 3:</b> Nhập mã hồ sơ hoặc thông tin cá nhân theo yêu cầu, nhấn "Tìm kiếm" để xem kết quả.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Nếu không tra cứu được kết quả hoặc có thắc mắc về điểm số, vui lòng liên hệ bộ phận hỗ trợ để được giải đáp. Đảm bảo nhập đúng mã hồ sơ/thông tin cá nhân.
        </Paragraph>
        <Paragraph>
          <b>Trường hợp thường gặp:</b> Quên mã hồ sơ, nhập sai thông tin, hệ thống bảo trì... Hãy kiểm tra kỹ và liên hệ hỗ trợ nếu cần.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default TraCuu; 
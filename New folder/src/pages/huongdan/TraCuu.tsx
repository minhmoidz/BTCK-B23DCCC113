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
          Sau khi hoàn thành kỳ thi hoặc nộp hồ sơ xét tuyển, thí sinh có thể tra cứu kết quả, điểm thi, trạng thái hồ sơ và các thông báo liên quan trên hệ thống. Sử dụng chức năng "Tra cứu" trên menu và nhập mã hồ sơ hoặc thông tin cá nhân để xem kết quả.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Nếu không tra cứu được kết quả hoặc có thắc mắc về điểm số, vui lòng liên hệ bộ phận hỗ trợ để được giải đáp.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default TraCuu; 
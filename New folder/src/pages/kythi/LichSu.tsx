import React from 'react';
import { Typography, Card } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const LichSu: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Lịch sử & Ý nghĩa các kỳ thi</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>
          Các kỳ thi Đánh giá năng lực, Đánh giá tư duy được tổ chức nhằm đa dạng hóa phương thức tuyển sinh, đánh giá toàn diện năng lực, tư duy, kỹ năng của thí sinh thay vì chỉ dựa vào điểm thi truyền thống. Đây là xu hướng hiện đại, giúp các trường đại học tuyển chọn được những thí sinh phù hợp nhất.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default LichSu; 
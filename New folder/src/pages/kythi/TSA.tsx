import React from 'react';
import { Typography, Card } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const TSA: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Kỳ thi Đánh giá tư duy (TSA)</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>
          Kỳ thi Đánh giá tư duy (TSA) tập trung kiểm tra khả năng tư duy logic, giải quyết vấn đề, vận dụng kiến thức liên môn của thí sinh. Đây là một trong những tiêu chí quan trọng để xét tuyển vào các trường đại học kỹ thuật, công nghệ.
        </Paragraph>
        <Paragraph>
          <b>Cấu trúc đề thi:</b> Gồm các phần: Toán, Khoa học tự nhiên, Đọc hiểu, Giải quyết vấn đề... Thời gian và hình thức thi do từng trường quy định.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default TSA; 
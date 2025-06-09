import React from 'react';
import { Typography, Card } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const HSA: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Kỳ thi Đánh giá năng lực (HSA)</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Paragraph>
          Kỳ thi Đánh giá năng lực (HSA) là kỳ thi do các trường đại học tổ chức nhằm đánh giá toàn diện kiến thức, kỹ năng và tư duy của thí sinh. Kết quả kỳ thi được sử dụng để xét tuyển vào nhiều trường đại học lớn trên toàn quốc.
        </Paragraph>
        <Paragraph>
          <b>Cấu trúc đề thi:</b> Gồm các phần: Toán, Ngữ văn, Khoa học tự nhiên, Khoa học xã hội, Tiếng Anh... Thời gian làm bài và hình thức thi tùy theo từng trường tổ chức.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default HSA; 
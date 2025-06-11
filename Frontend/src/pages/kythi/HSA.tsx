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
          <b>Mục đích:</b> Kỳ thi Đánh giá năng lực (HSA) nhằm đánh giá toàn diện kiến thức, kỹ năng, tư duy logic, khả năng vận dụng thực tiễn của thí sinh. Kết quả được nhiều trường đại học lớn sử dụng để xét tuyển.
        </Paragraph>
        <Paragraph>
          <b>Đối tượng:</b> Học sinh lớp 12 hoặc đã tốt nghiệp THPT trên toàn quốc, có đủ sức khỏe và không trong thời gian bị kỷ luật.
        </Paragraph>
        <Paragraph>
          <b>Cấu trúc đề thi:</b> Gồm các phần: Toán, Ngữ văn, Khoa học tự nhiên, Khoa học xã hội, Tiếng Anh... Thời gian làm bài và hình thức thi tùy theo từng trường tổ chức. Đề thi chú trọng đánh giá khả năng tư duy, phân tích, tổng hợp và giải quyết vấn đề.
        </Paragraph>
        <Paragraph>
          <b>Quy trình thi:</b> Thí sinh đăng ký dự thi, nhận phiếu báo dự thi, có mặt tại địa điểm thi đúng giờ, mang theo CMND/CCCD và phiếu báo dự thi. Tuân thủ hướng dẫn của cán bộ coi thi, không mang vật dụng cấm vào phòng thi.
        </Paragraph>
        <Paragraph>
          <b>Kinh nghiệm ôn luyện:</b> Luyện đề thi mẫu, rèn luyện kỹ năng giải quyết vấn đề, đọc hiểu, quản lý thời gian làm bài. Tham khảo các đề thi các năm trước và tài liệu ôn tập chính thống.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Đọc kỹ quy chế thi, chuẩn bị đầy đủ giấy tờ, giữ bình tĩnh khi làm bài, không trao đổi/gian lận trong phòng thi.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default HSA; 
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
          <b>Mục đích:</b> Kỳ thi Đánh giá tư duy (TSA) kiểm tra khả năng tư duy logic, giải quyết vấn đề, vận dụng kiến thức liên môn của thí sinh. Kết quả được nhiều trường đại học kỹ thuật, công nghệ sử dụng để xét tuyển.
        </Paragraph>
        <Paragraph>
          <b>Đối tượng:</b> Học sinh lớp 12 hoặc đã tốt nghiệp THPT, có nguyện vọng xét tuyển vào các trường đại học kỹ thuật, công nghệ.
        </Paragraph>
        <Paragraph>
          <b>Cấu trúc đề thi:</b> Gồm các phần: Toán, Khoa học tự nhiên, Đọc hiểu, Giải quyết vấn đề, Tư duy tổng hợp... Thời gian và hình thức thi do từng trường quy định. Đề thi chú trọng đánh giá khả năng vận dụng kiến thức và tư duy sáng tạo.
        </Paragraph>
        <Paragraph>
          <b>Quy trình thi:</b> Đăng ký dự thi, nhận phiếu báo dự thi, có mặt tại địa điểm thi đúng giờ, mang theo giấy tờ tùy thân và phiếu báo dự thi. Tuân thủ quy định phòng thi, không mang vật dụng cấm.
        </Paragraph>
        <Paragraph>
          <b>Kinh nghiệm ôn luyện:</b> Luyện đề thi mẫu, rèn luyện kỹ năng đọc hiểu, giải quyết vấn đề thực tiễn, làm quen với các dạng bài tư duy tổng hợp. Tham khảo đề thi các năm trước.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Đọc kỹ quy chế thi, chuẩn bị đầy đủ giấy tờ, giữ bình tĩnh khi làm bài, không trao đổi/gian lận trong phòng thi.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default TSA; 
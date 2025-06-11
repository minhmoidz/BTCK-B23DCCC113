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
        <Paragraph>
          <b>Lịch sử hình thành:</b> Kỳ thi ĐGNL, ĐGTD bắt đầu được tổ chức từ năm 2018 tại một số trường đại học lớn, sau đó mở rộng ra nhiều trường trên cả nước. Mục tiêu là đổi mới tuyển sinh, giảm áp lực thi cử, tăng cơ hội cho thí sinh.
        </Paragraph>
        <Paragraph>
          <b>Lý do tổ chức:</b> Đáp ứng nhu cầu đánh giá năng lực toàn diện, phát hiện thí sinh có tư duy sáng tạo, kỹ năng giải quyết vấn đề, phù hợp với yêu cầu đào tạo đại học hiện đại.
        </Paragraph>
        <Paragraph>
          <b>Ý nghĩa:</b> Giúp thí sinh có thêm cơ hội xét tuyển, không bị phụ thuộc hoàn toàn vào điểm thi THPT. Các trường đại học có thêm công cụ để lựa chọn thí sinh phù hợp, nâng cao chất lượng đầu vào.
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b> Thí sinh nên tìm hiểu kỹ về các kỳ thi này, chuẩn bị kiến thức và kỹ năng toàn diện để đạt kết quả tốt nhất.
        </Paragraph>
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default LichSu; 
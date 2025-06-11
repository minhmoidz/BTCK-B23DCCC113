import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, kyThi: 'ĐGNL 2025', diem: '85/100', trangThai: 'Đã công bố' },
  { key: 2, kyThi: 'ĐGTD 2025', diem: '78/100', trangThai: 'Đã công bố' },
];

const columns = [
  { title: 'Kỳ thi', dataIndex: 'kyThi', key: 'kyThi' },
  { title: 'Điểm thi', dataIndex: 'diem', key: 'diem' },
  { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai' },
];

const DiemThi: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tra cứu điểm thi</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Typography.Paragraph>
          <b>Hướng dẫn tra cứu:</b> Đăng nhập vào hệ thống, chọn mục "Tra cứu điểm thi" để xem kết quả các kỳ thi đã tham gia. Điểm sẽ được cập nhật ngay sau khi có thông báo chính thức từ hội đồng thi.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Lưu ý:</b> Kết quả chỉ có giá trị khi trạng thái là "Đã công bố". Nếu chưa thấy điểm, hãy kiểm tra lại sau hoặc liên hệ bộ phận hỗ trợ.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Giải thích trạng thái:</b> "Đã công bố" - điểm đã được xác nhận; "Đang xử lý" - điểm đang được cập nhật; "Chưa có" - chưa có kết quả.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Kinh nghiệm:</b> Kiểm tra kỹ thông tin cá nhân, mã hồ sơ khi tra cứu. Nếu có sai sót về điểm, liên hệ hỗ trợ ngay trong thời gian khiếu nại.
        </Typography.Paragraph>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DiemThi; 
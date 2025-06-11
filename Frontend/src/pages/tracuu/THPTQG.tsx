import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, mon: 'Toán', diem: 8.2 },
  { key: 2, mon: 'Ngữ văn', diem: 7.5 },
  { key: 3, mon: 'Tiếng Anh', diem: 8.0 },
  { key: 4, mon: 'KHTN', diem: 7.8 },
  { key: 5, mon: 'KHXH', diem: 8.1 },
];

const columns = [
  { title: 'Môn thi', dataIndex: 'mon', key: 'mon' },
  { title: 'Điểm', dataIndex: 'diem', key: 'diem' },
];

const THPTQG: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Điểm thi tốt nghiệp THPT Quốc gia</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Typography.Paragraph>
          <b>Hướng dẫn tra cứu:</b> Đăng nhập vào hệ thống, chọn mục "Điểm thi THPTQG" để xem điểm từng môn. Điểm sẽ được cập nhật ngay sau khi có thông báo chính thức từ Bộ GD&ĐT.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Lưu ý:</b> Kết quả chỉ có giá trị khi đã được xác nhận. Nếu chưa thấy điểm, hãy kiểm tra lại sau hoặc liên hệ bộ phận hỗ trợ.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Giải thích các môn:</b> Toán, Ngữ văn, Tiếng Anh, KHTN (Khoa học tự nhiên), KHXH (Khoa học xã hội) là các môn/bài thi chính thức của kỳ thi THPTQG.
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

export default THPTQG; 
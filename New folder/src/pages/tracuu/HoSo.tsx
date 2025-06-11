import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, maHoSo: 'HS123456', trangThai: 'Đã xác nhận', ngayNop: '10/03/2025' },
  { key: 2, maHoSo: 'HS654321', trangThai: 'Chờ xác nhận', ngayNop: '15/03/2025' },
];

const columns = [
  { title: 'Mã hồ sơ', dataIndex: 'maHoSo', key: 'maHoSo' },
  { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai' },
  { title: 'Ngày nộp', dataIndex: 'ngayNop', key: 'ngayNop' },
];

const HoSo: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tra cứu hồ sơ xét tuyển</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Typography.Paragraph>
          <b>Hướng dẫn tra cứu:</b> Đăng nhập vào hệ thống, chọn mục "Tra cứu hồ sơ" để xem trạng thái các hồ sơ đã nộp. Thông tin sẽ được cập nhật liên tục theo tiến độ xét tuyển.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Giải thích trạng thái:</b> "Đã xác nhận" - hồ sơ hợp lệ, đã được tiếp nhận; "Chờ xác nhận" - hồ sơ đang được kiểm tra; "Bị từ chối" - hồ sơ không hợp lệ hoặc thiếu thông tin.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Lưu ý:</b> Kiểm tra kỹ thông tin cá nhân, mã hồ sơ, ngày nộp. Nếu phát hiện sai sót hoặc chưa được xác nhận, liên hệ bộ phận hỗ trợ để được xử lý kịp thời.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Kinh nghiệm:</b> Nộp hồ sơ sớm, lưu lại biên nhận, thường xuyên kiểm tra trạng thái để không bỏ lỡ các thông báo quan trọng.
        </Typography.Paragraph>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default HoSo; 
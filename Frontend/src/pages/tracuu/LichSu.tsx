import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, hanhDong: 'Đăng ký ĐGNL', thoiGian: '01/02/2025 09:00' },
  { key: 2, hanhDong: 'Nộp lệ phí ĐGNL', thoiGian: '05/02/2025 14:30' },
  { key: 3, hanhDong: 'Đăng ký ĐGTD', thoiGian: '16/02/2025 10:15' },
];

const columns = [
  { title: 'Hành động', dataIndex: 'hanhDong', key: 'hanhDong' },
  { title: 'Thời gian', dataIndex: 'thoiGian', key: 'thoiGian' },
];

const LichSu: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tra cứu lịch sử đăng ký</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Typography.Paragraph>
          <b>Hướng dẫn tra cứu:</b> Đăng nhập vào hệ thống, chọn mục "Lịch sử đăng ký" để xem toàn bộ các hành động đã thực hiện (đăng ký, nộp lệ phí, chỉnh sửa hồ sơ...).
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Ý nghĩa các hành động:</b> Giúp thí sinh kiểm soát quá trình đăng ký, phát hiện kịp thời các thao tác sai sót hoặc thiếu sót.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Lưu ý:</b> Đối chiếu kỹ các mốc thời gian, hành động để đảm bảo quyền lợi. Nếu phát hiện bất thường, liên hệ hỗ trợ ngay.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Kinh nghiệm:</b> Lưu lại lịch sử đăng ký, chụp màn hình các thao tác quan trọng để làm bằng chứng khi cần thiết.
        </Typography.Paragraph>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default LichSu; 
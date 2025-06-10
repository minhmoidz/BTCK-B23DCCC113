import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, mon: 'Toán', ngay: '25/06/2025', buoi: 'Sáng' },
  { key: 2, mon: 'Ngữ văn', ngay: '25/06/2025', buoi: 'Chiều' },
  { key: 3, mon: 'Khoa học tự nhiên', ngay: '26/06/2025', buoi: 'Sáng' },
  { key: 4, mon: 'Khoa học xã hội', ngay: '26/06/2025', buoi: 'Chiều' },
  { key: 5, mon: 'Tiếng Anh', ngay: '27/06/2025', buoi: 'Sáng' },
];

const columns = [
  { title: 'Môn thi', dataIndex: 'mon', key: 'mon' },
  { title: 'Ngày thi', dataIndex: 'ngay', key: 'ngay' },
  { title: 'Buổi thi', dataIndex: 'buoi', key: 'buoi' },
];

const THPTQG: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Lịch thi tốt nghiệp THPT Quốc gia</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Typography.Paragraph>
          <b>Hướng dẫn tra cứu lịch thi:</b> Thí sinh nên kiểm tra lịch thi trên website của Bộ GD&ĐT, trường THPT và tài khoản cá nhân để cập nhật các thay đổi mới nhất về thời gian, địa điểm thi.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Lưu ý:</b> Có mặt tại điểm thi trước giờ thi ít nhất 30 phút, mang đầy đủ giấy tờ tùy thân, phiếu báo dự thi, dụng cụ học tập cần thiết. Kiểm tra kỹ thông tin về phòng thi, số báo danh.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Các mốc quan trọng:</b> Đăng ký dự thi, nộp lệ phí, nhận phiếu báo dự thi, tra cứu phòng thi, ngày thi chính thức. Nếu có thay đổi về lịch thi, nhà trường sẽ thông báo trực tiếp cho thí sinh.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Kinh nghiệm chuẩn bị:</b> Ôn tập đều các môn, chuẩn bị sẵn sàng giấy tờ, kiểm tra phương tiện di chuyển, ngủ đủ giấc trước ngày thi để đảm bảo sức khỏe và tinh thần tốt nhất.
        </Typography.Paragraph>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default THPTQG; 
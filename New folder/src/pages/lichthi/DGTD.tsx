import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, dot: 'Đợt 1', ngay: '22/03/2025', diaDiem: 'Hà Nội, Hải Phòng' },
  { key: 2, dot: 'Đợt 2', ngay: '27/04/2025', diaDiem: 'TP.HCM, Đà Nẵng' },
];

const columns = [
  { title: 'Đợt thi', dataIndex: 'dot', key: 'dot' },
  { title: 'Ngày thi', dataIndex: 'ngay', key: 'ngay' },
  { title: 'Địa điểm', dataIndex: 'diaDiem', key: 'diaDiem' },
];

const DGTD: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Lịch thi Đánh giá tư duy (ĐGTD)</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Typography.Paragraph>
          <b>Hướng dẫn tra cứu lịch thi:</b> Thí sinh nên kiểm tra lịch thi trên website chính thức và tài khoản cá nhân để cập nhật các thay đổi mới nhất về thời gian, địa điểm thi.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Lưu ý:</b> Có mặt tại địa điểm thi trước giờ thi ít nhất 30 phút, mang đầy đủ giấy tờ tùy thân và phiếu báo dự thi. Kiểm tra kỹ thông tin về ca thi, phòng thi, tránh nhầm lẫn.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Các mốc quan trọng:</b> Đăng ký dự thi, nộp lệ phí, nhận phiếu báo dự thi, tra cứu phòng thi, ngày thi chính thức. Nếu có thay đổi về lịch thi, hệ thống sẽ gửi thông báo qua email hoặc tài khoản cá nhân.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Kinh nghiệm chuẩn bị:</b> Chuẩn bị sẵn sàng giấy tờ, kiểm tra phương tiện di chuyển, ngủ đủ giấc trước ngày thi để đảm bảo sức khỏe và tinh thần tốt nhất.
        </Typography.Paragraph>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DGTD; 
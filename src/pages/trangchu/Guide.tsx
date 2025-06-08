import React from 'react';
import { Card, Typography, Steps } from 'antd';

const { Title, Paragraph } = Typography;

const steps = [
  {
    title: 'Tạo tài khoản',
    desc: 'Đăng ký tài khoản thí sinh trên hệ thống bằng email và số điện thoại.'
  },
  {
    title: 'Điền thông tin hồ sơ',
    desc: 'Nhập đầy đủ thông tin cá nhân, ngành dự thi, tải lên giấy tờ cần thiết.'
  },
  {
    title: 'Chọn ca thi & nộp lệ phí',
    desc: 'Lựa chọn ca thi phù hợp và hoàn thành nộp lệ phí dự thi.'
  },
  {
    title: 'Nhận phiếu dự thi',
    desc: 'Sau khi xác nhận, nhận phiếu dự thi và thông tin phòng thi qua email.'
  },
];

const Guide: React.FC = () => (
  <Card style={{ borderRadius: 16, marginBottom: 32 }} bodyStyle={{ padding: 32 }}>
    <Title level={3} style={{ color: '#4da3ff', marginBottom: 24 }}>Hướng dẫn đăng ký dự thi</Title>
    <Steps
      direction="vertical"
      size="default"
      current={-1}
      items={steps.map(s => ({ title: s.title, description: s.desc }))}
    />
    <Paragraph style={{ marginTop: 24, color: '#333' }}>
      Nếu cần hỗ trợ thêm, vui lòng liên hệ bộ phận tuyển sinh hoặc sử dụng chat trực tuyến ở góc phải màn hình.
    </Paragraph>
  </Card>
);

export default Guide; 
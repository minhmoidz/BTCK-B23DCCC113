import React from 'react';
import { Steps, Typography, Alert } from 'antd';

const { Title } = Typography;

const steps = [
  {
    title: 'Tạo tài khoản',
    description: 'Đăng ký tài khoản thí sinh trên hệ thống.'
  },
  {
    title: 'Đăng nhập',
    description: 'Đăng nhập vào hệ thống bằng tài khoản đã tạo.'
  },
  {
    title: 'Khai báo hồ sơ',
    description: 'Nhập thông tin cá nhân, chọn ngành, trường và nguyện vọng.'
  },
  {
    title: 'Nộp lệ phí',
    description: 'Thanh toán lệ phí dự thi/xét tuyển theo hướng dẫn.'
  },
  {
    title: 'Tham gia kỳ thi',
    description: 'Tham dự kỳ thi ĐGNL/ĐGTD theo lịch đã đăng ký.'
  },
  {
    title: 'Tra cứu kết quả',
    description: 'Xem điểm thi, kết quả xét tuyển và tra cứu thông báo.'
  },
];

const Guide: React.FC = () => (
  <div style={{ margin: '32px 0' }}>
    <Title level={4} style={{ color: '#4da3ff', marginBottom: 16 }}>Các bước đăng ký dự thi & xét tuyển đại học</Title>
    <Steps direction="vertical" size="small" current={-1} items={steps} />
    <Alert
      style={{ marginTop: 24 }}
      message="Tip hữu ích"
      description="Hãy chuẩn bị đầy đủ giấy tờ, kiểm tra kỹ thông tin cá nhân và thường xuyên theo dõi thông báo mới nhất trên hệ thống để không bỏ lỡ các mốc quan trọng!"
      type="info"
      showIcon
    />
  </div>
);

export default Guide; 
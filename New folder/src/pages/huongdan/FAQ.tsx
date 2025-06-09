import React from 'react';
import { Typography, Collapse } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const items = [
  {
    key: '1',
    label: 'Tôi quên mật khẩu, phải làm sao?',
    children: <p>Bạn hãy sử dụng chức năng "Quên mật khẩu" trên trang đăng nhập hoặc liên hệ bộ phận hỗ trợ để được cấp lại mật khẩu.</p>,
  },
  {
    key: '2',
    label: 'Làm thế nào để biết mình đã đăng ký thành công?',
    children: <p>Sau khi đăng ký thành công, hệ thống sẽ gửi xác nhận về email và tài khoản cá nhân của bạn.</p>,
  },
  {
    key: '3',
    label: 'Tôi có thể thay đổi nguyện vọng sau khi đăng ký không?',
    children: <p>Bạn có thể thay đổi nguyện vọng trong thời gian cho phép chỉnh sửa. Sau thời gian này, mọi thông tin sẽ được khóa để phục vụ xét tuyển.</p>,
  },
];

const FAQ: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Câu hỏi thường gặp</Title>
      <Collapse items={items} defaultActiveKey={['1']} />
    </div>
    <FooterPTIT />
  </>
);

export default FAQ; 
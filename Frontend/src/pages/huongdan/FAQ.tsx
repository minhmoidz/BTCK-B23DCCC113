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
  {
    key: '4',
    label: 'Nếu quên mã hồ sơ thì làm thế nào?',
    children: <p>Bạn có thể tra cứu lại mã hồ sơ trong tài khoản cá nhân hoặc liên hệ bộ phận hỗ trợ để được cấp lại.</p>,
  },
  {
    key: '5',
    label: 'Nộp lệ phí qua ngân hàng có cần xác nhận không?',
    children: <p>Có. Sau khi chuyển khoản, bạn cần tải biên lai lên hệ thống để xác nhận giao dịch.</p>,
  },
  {
    key: '6',
    label: 'Khi nào có thể tra cứu kết quả thi?',
    children: <p>Kết quả sẽ được công bố theo lịch dự kiến trên website. Bạn nên thường xuyên kiểm tra mục Thông báo.</p>,
  },
  {
    key: '7',
    label: 'Có thể đăng ký nhiều phương thức xét tuyển không?',
    children: <p>Bạn có thể đăng ký nhiều phương thức (ĐGNL, ĐGTD, THPT...) nếu đáp ứng đủ điều kiện của từng phương thức.</p>,
  },
  {
    key: '8',
    label: 'Nếu thông tin cá nhân bị sai sót thì xử lý thế nào?',
    children: <p>Bạn cần liên hệ bộ phận hỗ trợ để được điều chỉnh thông tin trước khi xét tuyển.</p>,
  },
  {
    key: '9',
    label: 'Có thể rút hồ sơ hoặc hủy đăng ký không?',
    children: <p>Bạn có thể rút hồ sơ hoặc hủy đăng ký trong thời gian cho phép chỉnh sửa/nguyện vọng.</p>,
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
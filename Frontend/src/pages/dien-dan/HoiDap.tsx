import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const hoiDap = [
  { question: 'Điểm chuẩn ĐGNL năm nay là bao nhiêu?', answer: 'Điểm chuẩn sẽ được các trường công bố sau khi có kết quả thi.' },
  { question: 'Có thể đăng ký nhiều nguyện vọng không?', answer: 'Bạn có thể đăng ký nhiều nguyện vọng và sắp xếp thứ tự ưu tiên.' },
  { question: 'Nếu quên mã hồ sơ thì làm thế nào?', answer: 'Bạn có thể tra cứu lại mã hồ sơ trong tài khoản cá nhân hoặc liên hệ hỗ trợ.' },
  { question: 'Nộp lệ phí qua ngân hàng có cần xác nhận không?', answer: 'Có. Sau khi chuyển khoản, bạn cần tải biên lai lên hệ thống để xác nhận giao dịch.' },
  { question: 'Khi nào có thể tra cứu kết quả thi?', answer: 'Kết quả sẽ được công bố theo lịch dự kiến trên website. Bạn nên thường xuyên kiểm tra mục Thông báo.' },
  { question: 'Có thể đăng ký nhiều phương thức xét tuyển không?', answer: 'Bạn có thể đăng ký nhiều phương thức (ĐGNL, ĐGTD, THPT...) nếu đáp ứng đủ điều kiện của từng phương thức.' },
  { question: 'Nếu thông tin cá nhân bị sai sót thì xử lý thế nào?', answer: 'Bạn cần liên hệ bộ phận hỗ trợ để được điều chỉnh thông tin trước khi xét tuyển.' },
  { question: 'Có thể rút hồ sơ hoặc hủy đăng ký không?', answer: 'Bạn có thể rút hồ sơ hoặc hủy đăng ký trong thời gian cho phép chỉnh sửa/nguyện vọng.' },
];

const HoiDap: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Hỏi đáp về kỳ thi & xét tuyển</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <List
          dataSource={hoiDap}
          renderItem={item => (
            <List.Item>
              <b>Hỏi:</b> {item.question}<br />
              <b>Đáp:</b> {item.answer}
            </List.Item>
          )}
        />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default HoiDap; 
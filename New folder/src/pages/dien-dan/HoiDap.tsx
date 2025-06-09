import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const hoiDap = [
  { question: 'Điểm chuẩn ĐGNL năm nay là bao nhiêu?', answer: 'Điểm chuẩn sẽ được các trường công bố sau khi có kết quả thi.' },
  { question: 'Có thể đăng ký nhiều nguyện vọng không?', answer: 'Bạn có thể đăng ký nhiều nguyện vọng và sắp xếp thứ tự ưu tiên.' },
  { question: 'Nếu quên mã hồ sơ thì làm thế nào?', answer: 'Bạn có thể tra cứu lại mã hồ sơ trong tài khoản cá nhân hoặc liên hệ hỗ trợ.' },
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
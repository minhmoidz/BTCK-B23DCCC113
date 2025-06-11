import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const kinhNghiem = [
  { title: 'Lập kế hoạch ôn tập hợp lý', desc: 'Chia nhỏ kiến thức, đặt mục tiêu từng tuần, từng tháng.' },
  { title: 'Làm đề thi thử', desc: 'Luyện tập với đề thi mẫu, đề các năm trước để làm quen áp lực thời gian.' },
  { title: 'Giữ sức khỏe và tinh thần', desc: 'Ăn uống, nghỉ ngơi hợp lý, giữ tinh thần lạc quan.' },
  { title: 'Ôn tập theo nhóm', desc: 'Thảo luận, giải đáp thắc mắc cùng bạn bè để hiểu sâu kiến thức.' },
  { title: 'Tổng hợp lỗi sai', desc: 'Ghi chú lại các lỗi thường gặp để tránh lặp lại khi thi thật.' },
  { title: 'Chia thời gian hợp lý khi làm bài', desc: 'Ưu tiên câu dễ trước, không sa đà vào câu khó, kiểm soát thời gian.' },
  { title: 'Giữ liên lạc với thầy cô', desc: 'Chủ động hỏi thầy cô khi gặp khó khăn, xin tài liệu ôn tập phù hợp.' },
  { title: 'Tập luyện kỹ năng làm bài trắc nghiệm', desc: 'Luyện phản xạ nhanh, đọc kỹ đề, tránh chọn đáp án vội vàng.' },
];

const KinhNghiem: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Chia sẻ kinh nghiệm ôn thi</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <List
          dataSource={kinhNghiem}
          renderItem={item => (
            <List.Item>
              <b>{item.title}</b><br />
              <Paragraph style={{ margin: 0 }}>{item.desc}</Paragraph>
            </List.Item>
          )}
        />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default KinhNghiem; 
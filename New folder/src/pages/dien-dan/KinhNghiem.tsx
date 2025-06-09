import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title, Paragraph } = Typography;

const kinhNghiem = [
  { title: 'Lập kế hoạch ôn tập hợp lý', desc: 'Chia nhỏ kiến thức, đặt mục tiêu từng tuần, từng tháng.' },
  { title: 'Làm đề thi thử', desc: 'Luyện tập với đề thi mẫu, đề các năm trước để làm quen áp lực thời gian.' },
  { title: 'Giữ sức khỏe và tinh thần', desc: 'Ăn uống, nghỉ ngơi hợp lý, giữ tinh thần lạc quan.' },
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
import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const tinTuc = [
  { title: 'Bộ GD&ĐT công bố quy chế tuyển sinh mới', date: '01/06/2025' },
  { title: 'Nhiều trường đại học mở thêm ngành mới', date: '20/05/2025' },
  { title: 'Cập nhật chỉ tiêu tuyển sinh 2025', date: '10/05/2025' },
  { title: 'Hội thảo tư vấn tuyển sinh trực tuyến toàn quốc', date: '05/05/2025' },
  { title: 'Công bố lịch thi ĐGNL, ĐGTD năm 2025', date: '25/04/2025' },
  { title: 'Hướng dẫn đăng ký xét tuyển trực tuyến', date: '15/04/2025' },
];

const TinTuc: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tin tức tuyển sinh</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <List
          dataSource={tinTuc}
          renderItem={item => (
            <List.Item>
              <b>{item.title}</b> <span style={{ float: 'right', color: '#888' }}>{item.date}</span>
            </List.Item>
          )}
        />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default TinTuc;

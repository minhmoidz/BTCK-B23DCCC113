import React from 'react';
import { Typography, Card, List } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const thongBao = [
  { title: 'Bạn đã đăng ký thành công ĐGNL 2025', date: '01/02/2025' },
  { title: 'Hệ thống đã xác nhận nộp lệ phí ĐGNL', date: '05/02/2025' },
  { title: 'Kết quả ĐGNL 2025 đã được công bố', date: '20/03/2025' },
];

const ThongBao: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tra cứu thông báo cá nhân</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <List
          dataSource={thongBao}
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

export default ThongBao; 
import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, hanhDong: 'Đăng ký ĐGNL', thoiGian: '01/02/2025 09:00' },
  { key: 2, hanhDong: 'Nộp lệ phí ĐGNL', thoiGian: '05/02/2025 14:30' },
  { key: 3, hanhDong: 'Đăng ký ĐGTD', thoiGian: '16/02/2025 10:15' },
];

const columns = [
  { title: 'Hành động', dataIndex: 'hanhDong', key: 'hanhDong' },
  { title: 'Thời gian', dataIndex: 'thoiGian', key: 'thoiGian' },
];

const LichSu: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tra cứu lịch sử đăng ký</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default LichSu; 
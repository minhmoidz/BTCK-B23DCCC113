import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, kyThi: 'ĐGNL 2025', diem: '85/100', trangThai: 'Đã công bố' },
  { key: 2, kyThi: 'ĐGTD 2025', diem: '78/100', trangThai: 'Đã công bố' },
];

const columns = [
  { title: 'Kỳ thi', dataIndex: 'kyThi', key: 'kyThi' },
  { title: 'Điểm thi', dataIndex: 'diem', key: 'diem' },
  { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai' },
];

const DiemThi: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tra cứu điểm thi</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DiemThi; 
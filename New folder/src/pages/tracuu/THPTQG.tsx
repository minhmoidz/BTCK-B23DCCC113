import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, mon: 'Toán', diem: 8.2 },
  { key: 2, mon: 'Ngữ văn', diem: 7.5 },
  { key: 3, mon: 'Tiếng Anh', diem: 8.0 },
  { key: 4, mon: 'KHTN', diem: 7.8 },
  { key: 5, mon: 'KHXH', diem: 8.1 },
];

const columns = [
  { title: 'Môn thi', dataIndex: 'mon', key: 'mon' },
  { title: 'Điểm', dataIndex: 'diem', key: 'diem' },
];

const THPTQG: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Điểm thi tốt nghiệp THPT Quốc gia</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default THPTQG; 
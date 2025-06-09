import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, mon: 'Toán', ngay: '25/06/2025', buoi: 'Sáng' },
  { key: 2, mon: 'Ngữ văn', ngay: '25/06/2025', buoi: 'Chiều' },
  { key: 3, mon: 'Khoa học tự nhiên', ngay: '26/06/2025', buoi: 'Sáng' },
  { key: 4, mon: 'Khoa học xã hội', ngay: '26/06/2025', buoi: 'Chiều' },
  { key: 5, mon: 'Tiếng Anh', ngay: '27/06/2025', buoi: 'Sáng' },
];

const columns = [
  { title: 'Môn thi', dataIndex: 'mon', key: 'mon' },
  { title: 'Ngày thi', dataIndex: 'ngay', key: 'ngay' },
  { title: 'Buổi thi', dataIndex: 'buoi', key: 'buoi' },
];

const THPTQG: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Lịch thi tốt nghiệp THPT Quốc gia</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default THPTQG; 
import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, maHoSo: 'HS123456', trangThai: 'Đã xác nhận', ngayNop: '10/03/2025' },
  { key: 2, maHoSo: 'HS654321', trangThai: 'Chờ xác nhận', ngayNop: '15/03/2025' },
];

const columns = [
  { title: 'Mã hồ sơ', dataIndex: 'maHoSo', key: 'maHoSo' },
  { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai' },
  { title: 'Ngày nộp', dataIndex: 'ngayNop', key: 'ngayNop' },
];

const HoSo: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Tra cứu hồ sơ xét tuyển</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default HoSo; 
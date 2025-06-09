import React from 'react';
import { Typography, Card, Table } from 'antd';
import Navbar from '../trangchu/Navbar';
import FooterPTIT from '../../component/dunglai/FooterPTIT';

const { Title } = Typography;

const data = [
  { key: 1, dot: 'Đợt 1', ngay: '22/03/2025', diaDiem: 'Hà Nội, Hải Phòng' },
  { key: 2, dot: 'Đợt 2', ngay: '27/04/2025', diaDiem: 'TP.HCM, Đà Nẵng' },
];

const columns = [
  { title: 'Đợt thi', dataIndex: 'dot', key: 'dot' },
  { title: 'Ngày thi', dataIndex: 'ngay', key: 'ngay' },
  { title: 'Địa điểm', dataIndex: 'diaDiem', key: 'diaDiem' },
];

const DGTD: React.FC = () => (
  <>
    <Navbar />
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, padding: 32 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Lịch thi Đánh giá tư duy (ĐGTD)</Title>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>
    </div>
    <FooterPTIT />
  </>
);

export default DGTD; 
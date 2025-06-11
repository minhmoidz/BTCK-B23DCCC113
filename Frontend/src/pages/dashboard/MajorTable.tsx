import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface MajorInfo {
  stt: number;
  maNganh: string;
  tenNganh: string;
  toHopXetTuyen: string[];
  chiTieu: number;
}

interface MajorTableProps {
  majors: MajorInfo[];
  loading?: boolean;
}

const MajorTable: React.FC<MajorTableProps> = ({ majors, loading }) => {
  const columns: ColumnsType<MajorInfo> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 70,
      align: 'center',
    },
    {
      title: 'Mã ngành',
      dataIndex: 'maNganh',
      key: 'maNganh',
      width: 120,
    },
    {
      title: 'Tên ngành',
      dataIndex: 'tenNganh',
      key: 'tenNganh',
    },
    {
      title: 'Tổ hợp xét tuyển',
      dataIndex: 'toHopXetTuyen',
      key: 'toHopXetTuyen',
      render: (toHop: string[]) => toHop.join(', '),
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'chiTieu',
      key: 'chiTieu',
      width: 100,
      align: 'center',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={majors}
      loading={loading}
      rowKey="maNganh"
      pagination={false}
      scroll={{ x: 800 }}
      bordered
    />
  );
};

export default MajorTable; 
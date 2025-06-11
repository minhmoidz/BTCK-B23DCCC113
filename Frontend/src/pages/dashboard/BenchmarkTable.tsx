import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface BenchmarkInfo {
  stt: number;
  tenNganh: string;
  diem2022: number;
  diem2023: number;
  diem2024: number;
}

interface BenchmarkTableProps {
  benchmarks: BenchmarkInfo[];
  loading?: boolean;
}

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ benchmarks, loading }) => {
  const columns: ColumnsType<BenchmarkInfo> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 70,
      align: 'center',
    },
    {
      title: 'Ngành',
      dataIndex: 'tenNganh',
      key: 'tenNganh',
    },
    {
      title: 'Năm 2022',
      dataIndex: 'diem2022',
      key: 'diem2022',
      width: 120,
      align: 'center',
      render: (score) => score?.toFixed(2) || '-',
    },
    {
      title: 'Năm 2023',
      dataIndex: 'diem2023',
      key: 'diem2023',
      width: 120,
      align: 'center',
      render: (score) => score?.toFixed(2) || '-',
    },
    {
      title: 'Năm 2024',
      dataIndex: 'diem2024',
      key: 'diem2024',
      width: 120,
      align: 'center',
      render: (score) => score?.toFixed(2) || '-',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={benchmarks}
      loading={loading}
      rowKey="stt"
      pagination={false}
      scroll={{ x: 800 }}
      bordered
    />
  );
};

export default BenchmarkTable; 
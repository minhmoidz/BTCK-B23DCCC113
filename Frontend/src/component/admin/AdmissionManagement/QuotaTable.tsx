// src/pages/Admin/AdmissionManagement/components/QuotaTable.tsx

import React from 'react';
import { Table, Tag, Typography, Button, Row, Col, Statistic, Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { AdmissionQuota } from '../../../types/admin/AdmissionManagement/types';

const { Text } = Typography;

interface Props {
  quotas: AdmissionQuota[];
  loading: boolean;
  onEditQuota: () => void;
}

const methodNames: any = {
  thpt: 'Điểm thi THPT',
  hsa: 'Học bạ',
  tsa: 'Xét tuyển thẳng',
  dgnl: 'Đánh giá năng lực',
  xthb: 'Xét tuyển kết hợp',
};

export const getQuotaTableData = (quota: AdmissionQuota) =>
  Object.entries(quota.quotaByMethod).map(([method, value]) => ({
    key: method,
    method,
    quota: value,
  }));

const QuotaTable: React.FC<Props> = ({ quotas, loading, onEditQuota }) => (
  <Card
    title="Thông tin chỉ tiêu"
    loading={loading}
    extra={
      <Button type="primary" icon={<EditOutlined />} onClick={onEditQuota}>
        Chỉnh sửa
      </Button>
    }
  >
    {quotas.map((quota, index) => (
      <div key={index}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Statistic title="Tổng chỉ tiêu" value={quota.totalQuota} valueStyle={{ color: '#3f8600' }} />
          </Col>
          <Col span={6}>
            <Statistic title="Trường" value={quota.schoolId} valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col span={6}>
            <Statistic title="Ngành" value={quota.majorId} valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col span={6}>
            <Statistic title="Năm học" value={quota.academicYear} valueStyle={{ color: '#faad14' }} />
          </Col>
        </Row>
        <Table
          dataSource={getQuotaTableData(quota)}
          columns={[
            {
              title: 'Phương thức',
              dataIndex: 'method',
              key: 'method',
              render: (method: string) => <Tag color="blue">{methodNames[method] || method}</Tag>,
            },
            {
              title: 'Chỉ tiêu',
              dataIndex: 'quota',
              key: 'quota',
              render: (quota: number) => <Text strong>{quota}</Text>,
            },
          ]}
          pagination={false}
          rowKey="method"
        />
      </div>
    ))}
  </Card>
);

export default QuotaTable;

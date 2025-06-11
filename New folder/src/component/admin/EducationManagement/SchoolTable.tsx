import React from 'react';
import { Table, Tag, Button, Tooltip, Space, Avatar, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, BankOutlined as SchoolOutlined } from '@ant-design/icons';
import { School } from '../../../types/admin/EducationManagement/types';

const { Text } = Typography;

interface Props {
  schools: School[];
  onEdit: (school: School) => void;
  onDelete: (id: string) => void;
  colors: any;
}

const SchoolTable: React.FC<Props> = ({ schools, onEdit, onDelete, colors }) => (
  <Table
    dataSource={schools}
    rowKey="id"
    columns={[
      { 
        title: 'ID', 
        dataIndex: 'id', 
        key: 'id',
        width: 100,
        render: (text: string) => (
          <Tag color="blue" style={{ fontFamily: 'monospace' }}>{text}</Tag>
        )
      },
      { 
        title: 'Tên trường', 
        dataIndex: 'name', 
        key: 'name',
        render: (text: string) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size="small" 
              icon={<SchoolOutlined />} 
              style={{ backgroundColor: colors.primary, marginRight: 8 }} 
            />
            <Text strong>{text}</Text>
          </div>
        )
      },
      {
        title: 'Thao tác',
        key: 'action',
        width: 150,
        render: (_: any, record: School) => (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button 
                type="text"
                icon={<EditOutlined />} 
                onClick={() => onEdit(record)}
                style={{ color: colors.primary }}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Button 
                type="text"
                icon={<DeleteOutlined />} 
                danger 
                onClick={() => onDelete(record.id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ]}
    pagination={false}
  />
);

export default SchoolTable;
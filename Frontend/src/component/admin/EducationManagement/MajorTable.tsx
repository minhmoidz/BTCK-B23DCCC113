import React from 'react';
import { Table, Tag, Button, Tooltip, Space, Avatar, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, BookOutlined, EyeOutlined } from '@ant-design/icons';
import { Major } from '../../../types/admin/EducationManagement/types';

const { Text } = Typography;

interface Props {
  majors: Major[];
  onEdit: (major: Major) => void;
  onDelete: (id: string) => void;
  onViewSubjectGroups: (majorId: string) => void;
  colors: any;
}

const MajorTable: React.FC<Props> = ({ majors, onEdit, onDelete, onViewSubjectGroups, colors }) => (
  <Table
    dataSource={majors}
    rowKey="id"
    columns={[
      { 
        title: 'ID', 
        dataIndex: 'id', 
        key: 'id',
        width: 100,
        render: (text: string) => (
          <Tag color="green" style={{ fontFamily: 'monospace' }}>{text}</Tag>
        )
      },
      { 
        title: 'Tên ngành', 
        dataIndex: 'name', 
        key: 'name',
        render: (text: string) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size="small" 
              icon={<BookOutlined />} 
              style={{ backgroundColor: colors.success, marginRight: 8 }} 
            />
            <Text strong>{text}</Text>
          </div>
        )
      },
      {
        title: 'Thao tác',
        key: 'action',
        width: 200,
        render: (_: any, record: Major) => (
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
            <Tooltip title="Xem tổ hợp môn">
              <Button 
                type="text"
                icon={<EyeOutlined />}
                onClick={() => onViewSubjectGroups(record.id)}
                style={{ color: colors.warning }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ]}
    pagination={false}
  />
);

export default MajorTable;
import React from 'react';
import { Table, Tag, Button, Tooltip, Space, Avatar, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ExperimentOutlined } from '@ant-design/icons';
import { SubjectGroup } from '../../../types/admin/EducationManagement/types';

const { Text } = Typography;

interface Props {
  subjectGroups: SubjectGroup[];
  onEdit: (sg: SubjectGroup) => void;
  onDelete: (id: string) => void;
  colors: any;
}

const SubjectGroupTable: React.FC<Props> = ({ subjectGroups, onEdit, onDelete, colors }) => (
  <Table
    dataSource={subjectGroups}
    rowKey="id"
    columns={[
      { 
        title: 'ID', 
        dataIndex: 'id', 
        key: 'id',
        width: 100,
        render: (text: string) => (
          <Tag color="orange" style={{ fontFamily: 'monospace' }}>{text}</Tag>
        )
      },
      { 
        title: 'Tên tổ hợp môn', 
        dataIndex: 'name', 
        key: 'name',
        render: (text: string) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size="small" 
              icon={<ExperimentOutlined />} 
              style={{ backgroundColor: colors.warning, marginRight: 8 }} 
            />
            <Text strong>{text}</Text>
          </div>
        )
      },
      {
        title: 'Thao tác',
        key: 'action',
        width: 150,
        render: (_: any, record: SubjectGroup) => (
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

export default SubjectGroupTable;

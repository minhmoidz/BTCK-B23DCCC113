import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  TablePaginationConfig,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PushpinOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { API_URL } from '../../config/constants';
import { Notification, PaginationParams, PaginatedResponse } from '../../types/notification';

const { TextArea } = Input;
const { Title, Text } = Typography;

// Define colors object for consistent styling
const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#0ea5e9',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  background: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    muted: '#9ca3af',
  },
};

// Update the interface to use Dayjs type
interface NotificationFormValues {
  title: string;
  content: string;
  type: 'normal' | 'urgent' | 'announcement';
  visibility: 'all_users' | 'roles';
  targetRoles?: string[];
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  scheduledFor?: dayjs.Dayjs;
  expiresAt?: dayjs.Dayjs;
  isPinned?: boolean;
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [form] = Form.useForm<NotificationFormValues>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchNotifications = async (params: PaginationParams = {}) => {
    try {
      setLoading(true);
      const { page = 1, pageSize = 10 } = params;
      const response = await axios.get<{ data: PaginatedResponse<Notification> }>(`${API_URL}/admin/notifications`, {
        params: {
          page,
          limit: pageSize,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      const { data } = response.data;
      setNotifications(data.docs);
      setPagination({
        current: data.page,
        pageSize: data.limit,
        total: data.totalDocs,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách thông báo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current && pagination.pageSize) {
      fetchNotifications({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
    }
  };

  const showModal = (record: Notification | null = null) => {
    setEditingNotification(record);
    if (record) {
      const formValues: NotificationFormValues = {
        ...record,
        scheduledFor: record.scheduledFor ? dayjs(record.scheduledFor) : undefined,
        expiresAt: record.expiresAt ? dayjs(record.expiresAt) : undefined,
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingNotification(null);
    form.resetFields();
  };

  const handleSubmit = async (values: NotificationFormValues) => {
    try {
      const url = editingNotification
        ? `${API_URL}/admin/notifications/${editingNotification._id}`
        : `${API_URL}/admin/notifications`;
      
      const method = editingNotification ? 'put' : 'post';
      
      await axios[method](url, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      message.success(
        editingNotification
          ? 'Cập nhật thông báo thành công'
          : 'Tạo thông báo thành công'
      );
      handleModalCancel();
      fetchNotifications({ page: pagination.current, pageSize: pagination.pageSize });
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/admin/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      message.success('Xóa thông báo thành công');
      fetchNotifications({ page: pagination.current, pageSize: pagination.pageSize });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa thông báo');
      console.error(error);
    }
  };

  const handleTogglePin = async (record: Notification) => {
    try {
      await axios.patch(
        `${API_URL}/admin/notifications/${record._id}/toggle-pin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      message.success(
        record.isPinned ? 'Đã bỏ ghim thông báo' : 'Đã ghim thông báo'
      );
      fetchNotifications({ page: pagination.current, pageSize: pagination.pageSize });
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Notification) => (
        <Space>
          {record.isPinned && <PushpinOutlined style={{ color: '#1890ff' }} />}
          {text}
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: Notification['type']) => {
        const typeColors = {
          normal: 'blue',
          urgent: 'red',
          announcement: 'green',
        };
        return <Tag color={typeColors[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Notification['status']) => {
        const statusColors = {
          draft: 'default',
          scheduled: 'processing',
          published: 'success',
          expired: 'error',
        };
        return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Notification) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<PushpinOutlined />}
            onClick={() => handleTogglePin(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thông báo này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Enhanced Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        color: '#fff',
        boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <NotificationOutlined style={{ fontSize: '32px', marginRight: '12px' }} />
              <Title level={1} style={{ margin: 0, color: '#fff', fontWeight: 700 }}>
                Quản lý thông báo
              </Title>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
              Quản lý và gửi thông báo đến người dùng
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              height: '40px',
              borderRadius: '8px',
            }}
          >
            Tạo thông báo mới
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ 
            borderRadius: '16px',
            border: 'none',
            background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Statistic 
              title={<Text style={{ color: colors.text.secondary }}>Tổng số thông báo</Text>}
              value={notifications.length}
              valueStyle={{ color: colors.primary, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ 
            borderRadius: '16px',
            border: 'none',
            background: `linear-gradient(135deg, ${colors.success}15, ${colors.success}05)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Statistic 
              title={<Text style={{ color: colors.text.secondary }}>Thông báo đã xuất bản</Text>}
              value={notifications.filter(n => n.status === 'published').length}
              valueStyle={{ color: colors.success, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ 
            borderRadius: '16px',
            border: 'none',
            background: `linear-gradient(135deg, ${colors.warning}15, ${colors.warning}05)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Statistic 
              title={<Text style={{ color: colors.text.secondary }}>Thông báo đã ghim</Text>}
              value={notifications.filter(n => n.isPinned).length}
              valueStyle={{ color: colors.warning, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card
        style={{ 
          borderRadius: '16px',
          border: 'none',
          background: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="_id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          className="notification-table"
        />
      </Card>

      {/* Modal remains unchanged */}
      <Modal
        title={editingNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: 'normal',
            visibility: 'all_users',
            status: 'published',
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="type" label="Loại thông báo">
            <Select>
              <Select.Option value="normal">Thông thường</Select.Option>
              <Select.Option value="urgent">Khẩn cấp</Select.Option>
              <Select.Option value="announcement">Thông báo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="visibility" label="Phạm vi hiển thị">
            <Select>
              <Select.Option value="all_users">Tất cả người dùng</Select.Option>
              <Select.Option value="roles">Theo vai trò</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.visibility !== currentValues.visibility
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('visibility') === 'roles' ? (
                <Form.Item name="targetRoles" label="Vai trò">
                  <Select mode="multiple">
                    <Select.Option value="student">Sinh viên</Select.Option>
                    <Select.Option value="parent">Phụ huynh</Select.Option>
                    <Select.Option value="school">Trường học</Select.Option>
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item name="scheduledFor" label="Lịch đăng">
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>

          <Form.Item name="expiresAt" label="Ngày hết hạn">
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
        </Form>
      </Modal>

      <style>
        {`
          .notification-table .ant-table-tbody > tr > td {
            border-bottom: 1px solid ${colors.border};
            padding: 16px;
          }
          .ant-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .ant-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
          }
          .notification-table .ant-table-tbody > tr:hover > td {
            background: ${colors.surface} !important;
          }
        `}
      </style>
    </div>
  );
};

export default NotificationManager; 
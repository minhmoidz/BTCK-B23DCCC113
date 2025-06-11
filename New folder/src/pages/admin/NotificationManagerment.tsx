import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Card,
  Typography,
  Switch,
  Tooltip,
  Row,
  Col,
  Statistic,
  Spin,
  Upload,
  Image
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PushpinOutlined,
  PushpinFilled,
  StarOutlined,
  StarFilled,
  NotificationOutlined,
  UploadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { format } from 'date-fns';

const { TextArea } = Input;
const { Title } = Typography;

// Cấu hình axios
const API_URL = 'http://localhost:3000';

interface NotificationStats {
  total: number;
  pinned: number;
  important: number;
}

interface Notification {
  _id: string;
  title: string;
  content: string;
  description: string;
  isImportant: boolean;
  isPinned: boolean;
  createdAt: string;
  image?: string;
}

const StyledCard = styled(Card)`
  .pinned-row {
    background-color: rgba(24, 144, 255, 0.05);
  }

  .important-row {
    background-color: rgba(255, 77, 79, 0.05);
  }
  
  .important-notification {
    color: #ff4d4f;
    font-weight: 500;
  }
  
  .notification-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-icons {
    display: flex;
    gap: 4px;
  }

  .ant-table {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }

  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }

  .ant-statistic {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    height: 100%;
  }

  .ant-statistic-title {
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }

  .ant-statistic-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .ant-btn {
    border-radius: 6px;
  }

  .action-button {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-modal-content {
    border-radius: 8px;
  }
`;

const NotificationManagerment: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    pinned: 0,
    important: 0
  });
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/notifications`);
      if (response.data && response.data.data) {
        setNotifications(response.data.data);
        const responseStats = response.data.stats || {};
        setStats({
          total: Number(responseStats.total) || 0,
          pinned: Number(responseStats.pinned) || 0,
          important: Number(responseStats.important) || 0
        });
      }
    } catch (error) {
      message.error('Không thể tải danh sách thông báo');
      setNotifications([]);
      setStats({ total: 0, pinned: 0, important: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Chỉ thêm mới hoặc chỉnh sửa, không upload ảnh
  const handleSubmit = async (values: any) => {
    try {
      setImageLoading(true);
      const data = {
        title: values.title,
        content: values.content,
        description: values.description,
        isImportant: values.isImportant,
        isPinned: values.isPinned,
        sender: 'admin-001'
      };
      if (editingId) {
        await axios.put(`${API_URL}/api/notifications/${editingId}`, data);
        message.success('Cập nhật thông báo thành công');
      } else {
        await axios.post(`${API_URL}/api/notifications`, data);
        message.success('Tạo thông báo thành công');
      }
      setModalVisible(false);
      setEditingId(null);
      form.resetFields();
      fetchNotifications();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(`Lỗi: ${error.response.status} - ${error.response.data.message || 'Dữ liệu không hợp lệ'}`);
      } else {
        message.error('Có lỗi xảy ra khi lưu thông báo');
      }
    } finally {
      setImageLoading(false);
    }
  };

  // Handle toggle pin
  const handleTogglePin = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/api/notifications/${id}/toggle-pin`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error toggling pin:', error);
      message.error('Không thể thay đổi trạng thái ghim');
    }
  };

  // Handle toggle important
  const handleToggleImportant = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/api/notifications/${id}/toggle-important`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error toggling important:', error);
      message.error('Không thể thay đổi trạng thái quan trọng');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Xóa thông báo thành công');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Không thể xóa thông báo');
    }
  };

  if (loading) {
    return (
      <StyledCard>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '20px' }}>Đang tải dữ liệu...</p>
        </div>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <div className="header-section">
        <Title level={2} style={{ margin: 0 }}>
          <Space>
            <NotificationOutlined />
            Quản lý thông báo
          </Space>
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalVisible(true);
          }}
          size="large"
        >
          Thêm thông báo
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Statistic 
            title="Thông báo quan trọng" 
            value={stats?.important || 0}
            prefix={<StarFilled style={{ fontSize: 20, color: '#ff4d4f' }} />}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic 
            title="Thông báo đã ghim" 
            value={stats?.pinned || 0}
            prefix={<PushpinFilled style={{ fontSize: 20, color: '#1890ff' }} />}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic 
            title="Tổng số thông báo" 
            value={stats?.total || 0}
            prefix={<NotificationOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
          />
        </Col>
      </Row>

      <Table
        columns={[
          {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            render: (text: string, record: Notification) => (
              <div className="notification-title">
                <span className={record.isImportant ? 'important-notification' : ''}>
                  {text}
                </span>
                <div className="status-icons">
                  {record.isImportant && (
                    <Tooltip title="Thông báo quan trọng">
                      <StarFilled style={{ color: '#ff4d4f' }} />
                    </Tooltip>
                  )}
                  {record.isPinned && (
                    <Tooltip title="Đã ghim">
                      <PushpinFilled style={{ color: '#1890ff' }} />
                    </Tooltip>
                  )}
                </div>
              </div>
            ),
          },
          {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '35%',
          },
          {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
          },
          {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: '15%',
            render: (image: string) => (
              image ? (
                <Image
                  src={`http://localhost:3000/${image}`}
                  alt="Notification"
                  style={{ maxWidth: '100px', height: 'auto' }}
                />
              ) : null
            ),
          },
          {
            title: 'Thao tác',
            key: 'actions',
            width: '20%',
            render: (_: any, record: Notification) => (
              <Space size="middle">
                <Tooltip title="Chỉnh sửa">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className="action-button"
                    onClick={() => {
                      setEditingId(record._id);
                      form.setFieldsValue({
                        title: record.title,
                        content: record.content,
                        description: record.description,
                        isImportant: record.isImportant,
                        isPinned: record.isPinned
                      });
                      setModalVisible(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Xóa">
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa thông báo này?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} className="action-button" />
                  </Popconfirm>
                </Tooltip>
                <Tooltip title={record.isImportant ? "Bỏ đánh dấu quan trọng" : "Đánh dấu quan trọng"}>
                  <Button
                    type="text"
                    icon={record.isImportant ? <StarFilled style={{ color: '#ff4d4f' }} /> : <StarOutlined />}
                    className="action-button"
                    onClick={() => handleToggleImportant(record._id)}
                  />
                </Tooltip>
                <Tooltip title={record.isPinned ? "Bỏ ghim" : "Ghim"}>
                  <Button
                    type="text"
                    icon={record.isPinned ? <PushpinFilled style={{ color: '#1890ff' }} /> : <PushpinOutlined />}
                    className="action-button"
                    onClick={() => handleTogglePin(record._id)}
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]}
        dataSource={notifications}
        rowKey="_id"
        loading={loading}
        rowClassName={(record: Notification) => {
          if (record.isImportant) return 'important-row';
          if (record.isPinned) return 'pinned-row';
          return '';
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} thông báo`
        }}
      />

      <Modal
        title={
          <Space>
            {editingId ? <EditOutlined /> : <PlusOutlined />}
            {editingId ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"}
          </Space>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingId(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isImportant: false,
            isPinned: false
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập mô tả ngắn gọn về thông báo" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung chi tiết của thông báo" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isImportant"
                label="Thông báo quan trọng"
                valuePropName="checked"
              >
                <Switch checkedChildren={<StarFilled />} unCheckedChildren={<StarOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isPinned"
                label="Ghim thông báo"
                valuePropName="checked"
              >
                <Switch checkedChildren={<PushpinFilled />} unCheckedChildren={<PushpinOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingId(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={imageLoading}>
                Tạo mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </StyledCard>
  );
};

export default NotificationManagerment; 
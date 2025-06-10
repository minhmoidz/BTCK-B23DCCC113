import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Typography, Spin, Empty, Card, Tooltip, Badge, message } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

interface NguyenVongListProps {
  userId?: string; // ID người dùng đang đăng nhập
}

interface HoSo {
  id: string;
  maHoSo: string;
  hoTen: string;
  phuongThuc: string;
  tenPhuongThuc: string;
  truong: string;
  nganh: string;
  nguyenVong: number;
  trangThai: string;
  createdAt: string;
  updatedAt: string;
}

const NguyenVongList: React.FC<NguyenVongListProps> = ({ userId }) => {
  const [hoSoList, setHoSoList] = useState<HoSo[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách hồ sơ khi component mount
  useEffect(() => {
    fetchHoSoList();
  }, [userId]);

  // Hàm lấy danh sách hồ sơ từ API
  const fetchHoSoList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Bạn chưa đăng nhập!');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/hoso', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setHoSoList(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hồ sơ:', error);
      message.error('Không thể tải danh sách nguyện vọng. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trạng thái hồ sơ bằng Tag
  const renderTrangThai = (trangThai: string) => {
    switch (trangThai) {
      case 'dang_duyet':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Đang duyệt</Tag>;
      case 'duyet':
        return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
      case 'tu_choi':
        return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
      case 'yeu_cau_bo_sung':
        return <Tag icon={<InfoCircleOutlined />} color="warning">Yêu cầu bổ sung</Tag>;
      default:
        return <Tag color="default">{trangThai}</Tag>;
    }
  };

  // Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cột cho bảng danh sách hồ sơ
  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      key: 'maHoSo',
      render: (text: string) => <Badge status="processing" text={text} />
    },
    {
      title: 'Nguyện vọng',
      dataIndex: 'nguyenVong',
      key: 'nguyenVong',
      render: (nv: number) => <Tag color="blue">NV{nv}</Tag>,
      sorter: (a: HoSo, b: HoSo) => a.nguyenVong - b.nguyenVong
    },
    {
      title: 'Trường',
      dataIndex: 'truong',
      key: 'truong',
    },
    {
      title: 'Ngành',
      dataIndex: 'nganh',
      key: 'nganh',
    },
    {
      title: 'Phương thức',
      dataIndex: 'tenPhuongThuc',
      key: 'tenPhuongThuc',
      render: (text: string, record: HoSo) => (
        <Tooltip title={text}>
          <Tag color="purple">{record.phuongThuc.toUpperCase()}</Tag>
        </Tooltip>
      ),
      filters: [
        { text: 'Xét tuyển thẳng', value: 'tsa' },
        { text: 'Xét tuyển học bạ', value: 'hsa' },
        { text: 'Xét tuyển điểm thi THPT', value: 'thpt' },
        { text: 'Đánh giá năng lực', value: 'dgnl' },
        { text: 'Xét tuyển kết hợp', value: 'xthb' }
      ],
      onFilter: (value: string, record: HoSo) => record.phuongThuc === value
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: renderTrangThai,
      filters: [
        { text: 'Đang duyệt', value: 'dang_duyet' },
        { text: 'Đã duyệt', value: 'duyet' },
        { text: 'Từ chối', value: 'tu_choi' },
        { text: 'Yêu cầu bổ sung', value: 'yeu_cau_bo_sung' }
      ],
      onFilter: (value: string, record: HoSo) => record.trangThai === value
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => formatDate(text),
      sorter: (a: HoSo, b: HoSo) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: HoSo) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<FileTextOutlined />}
            onClick={() => {
              // Xử lý xem chi tiết hồ sơ
              message.info(`Xem chi tiết hồ sơ ${record.maHoSo}`);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={4}>Danh sách nguyện vọng đã đăng ký</Title>
          <Text type="secondary">
            Theo dõi trạng thái các nguyện vọng đã đăng ký xét tuyển
          </Text>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchHoSoList}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>
      
      <Spin spinning={loading}>
        {hoSoList.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={hoSoList.map(item => ({ ...item, key: item.id }))} 
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
          />
        ) : (
          <Empty 
            description="Bạn chưa đăng ký nguyện vọng nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </Card>
  );
};

export default NguyenVongList;

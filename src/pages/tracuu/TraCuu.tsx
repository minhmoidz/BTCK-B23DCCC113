import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, notification, Card, Space, Popconfirm } from 'antd';
import axios from 'axios';
import RootLayout from '../../component/dunglai/RootLayout';

interface HoSo {
  id: string;
  hoTen: string;
  ngayDangKy: string; // hoặc ngayNop tùy backend
  trangThai: 'dang_duyet' | 'duyet' | 'tu_choi';
  diemThi?: number;
  ketQua?: string;
}

const statusLabelMap = {
  dang_duyet: 'Chờ duyệt',
  duyet: 'Đã duyệt',
  tu_choi: 'Từ chối',
};

const statusColor = {
  dang_duyet: 'orange',
  duyet: 'green',
  tu_choi: 'red',
};

const AdminHoSo: React.FC = () => {
  const [hoSoList, setHoSoList] = useState<HoSo[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchHoSoList = async () => {
    setLoading(true);
    try {
      // Thay token admin-token bằng token thực tế của bạn
      const res = await axios.get<HoSo[]>('http://localhost:3000/api/admin/profiles', {
        headers: { Authorization: 'Bearer admin-token' },
      });
      setHoSoList(res.data);
    } catch (error) {
      notification.error({ message: 'Lỗi lấy danh sách hồ sơ' });
      setHoSoList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoSoList();
  }, []);

  const updateStatus = async (id: string, trangThai: 'duyet' | 'tu_choi') => {
    setUpdatingId(id);
    try {
      await axios.post(
        `http://localhost:3000/api/admin/profiles/${id}/status`,
        { trangThai },
        { headers: { Authorization: 'Bearer admin-token' } }
      );
      notification.success({ message: `Đã cập nhật trạng thái thành ${statusLabelMap[trangThai]}` });
      await fetchHoSoList();
    } catch (error) {
      notification.error({ message: 'Cập nhật trạng thái thất bại' });
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'ngayDangKy',
      key: 'ngayDangKy',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: string) => <Tag color={statusColor[text as keyof typeof statusColor]}>{statusLabelMap[text as keyof typeof statusLabelMap]}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: HoSo) => {
        if (record.trangThai === 'dang_duyet') {
          return (
            <Space>
              <Popconfirm
                title="Bạn có chắc muốn duyệt hồ sơ này?"
                onConfirm={() => updateStatus(record.id, 'duyet')}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button type="primary" loading={updatingId === record.id}>Duyệt</Button>
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc muốn từ chối hồ sơ này?"
                onConfirm={() => updateStatus(record.id, 'tu_choi')}
                okText="Từ chối"
                cancelText="Hủy"
              >
                <Button danger loading={updatingId === record.id}>Từ chối</Button>
              </Popconfirm>
            </Space>
          );
        }
        return <i>Đã xử lý</i>;
      },
    },
  ];

  return (
    <RootLayout username="Admin" onLogout={() => {}}>
      <h2>Quản trị Hồ sơ xét tuyển</h2>
      <Card>
        <Table
          columns={columns}
          dataSource={hoSoList}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Không có hồ sơ nào' }}
        />
      </Card>
    </RootLayout>
  );
};

export default AdminHoSo;

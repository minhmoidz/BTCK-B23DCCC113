import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Button, notification, Card, Space, Spin } from 'antd';
import axios from 'axios';
import RootLayout from '../../component/dunglai/RootLayout';

interface HoSo {
  ketQua: string;
  id: string;
  hoTen: string;
  ngayDangKy: string;
  trangThai: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  diemThi?: number;
}

const statusColor = {
  'Chờ duyệt': 'orange',
  'Đã duyệt': 'green',
  'Từ chối': 'red',
};

const TheoDoiHoSoTraCuu: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [filteredHoSo, setFilteredHoSo] = useState<HoSo | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [hoSoList, setHoSoList] = useState<HoSo[]>([]);

  // Lấy danh sách hồ sơ khi component mount
  useEffect(() => {
    setLoadingList(true);
    axios.get<HoSo[]>('http://localhost:3000/api/hoso')
      .then(res => setHoSoList(res.data))
      .catch(() => {
        notification.error({ message: 'Lỗi lấy danh sách hồ sơ' });
        setHoSoList([]);
      })
      .finally(() => setLoadingList(false));
  }, []);

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
      dataIndex: 'ngayNop',
      key: 'ngayNop',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: string) => <Tag color={statusColor[text as keyof typeof statusColor]}>{text}</Tag>,
    },
  ];

  const onSearch = async () => {
    if (!searchId.trim()) {
      notification.warning({ message: 'Vui lòng nhập mã hồ sơ để tra cứu' });
      setFilteredHoSo(null);
      return;
    }

    setLoadingSearch(true);
    try {
      const res = await axios.get<HoSo>(`http://localhost:3000/api/hoso/${searchId.trim()}`);
      setFilteredHoSo(res.data);
    } catch (error) {
      notification.error({ message: 'Không tìm thấy hồ sơ với mã đã nhập hoặc lỗi server' });
      setFilteredHoSo(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <RootLayout username="MINH" onLogout={() => {}}>
      <h2>Theo dõi trạng thái hồ sơ và Tra cứu kết quả</h2>

      <Card style={{ marginBottom: 24 }}>
        <h3>Danh sách trạng thái hồ sơ</h3>
        <Table
          columns={columns}
          dataSource={hoSoList}
          rowKey="id"
          pagination={false}
          bordered
          loading={loadingList}
          locale={{ emptyText: 'Không có hồ sơ hiển thị' }}
        />
      </Card>

      <Card>
        <h3>Tra cứu kết quả xét tuyển</h3>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Nhập mã hồ sơ (ví dụ: HS001)"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            style={{ width: 300 }}
            onPressEnter={onSearch}
            disabled={loadingSearch}
          />
          <Button type="primary" onClick={onSearch} loading={loadingSearch}>
            Tra cứu
          </Button>
        </Space>

        {filteredHoSo && (
          <Card type="inner" title={`Kết quả hồ sơ ${filteredHoSo.id}`}>
            <p><b>Họ và tên:</b> {filteredHoSo.hoTen}</p>
            <p>
              <b>Trạng thái:</b>{' '}
              <Tag color={statusColor[filteredHoSo.trangThai]}>{filteredHoSo.trangThai}</Tag>
            </p>
            {filteredHoSo.trangThai === 'Đã duyệt' ? (
              <>
                <p><b>Điểm thi:</b> {filteredHoSo.diemThi ?? 'Chưa có'}</p>
                <p><b>Kết quả:</b> {filteredHoSo.ketQua ?? 'Chưa có'}</p>
              </>
            ) : (
              <p>Kết quả chưa có hoặc hồ sơ chưa được duyệt.</p>
            )}
          </Card>
        )}
      </Card>
    </RootLayout>
  );
};

export default TheoDoiHoSoTraCuu;

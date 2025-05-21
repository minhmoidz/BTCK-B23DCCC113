import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  Typography,
  Card,
  notification,
  Spin,
  message
} from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title } = Typography;
const { Option } = Select;

interface Truong {
  value: string;
  label: string;
}

interface Nganh {
  value: string;
  label: string;
}

interface XetTuyenFormValues {
  truong: string;
  nganh: string;
  toHop: string;
  hoTen: string;
  ngaySinh: any;
  diemThi: string;
  doiTuongUuTien?: string;
}

const NoiDungXetTuyen: React.FC = () => {
  const [form] = Form.useForm();
  const [truongList, setTruongList] = useState<Truong[]>([]);
  const [nganhList, setNganhList] = useState<Nganh[]>([]);
  const [toHopList, setToHopList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [api, contextHolder] = notification.useNotification();

  // Thông báo
  const showNotification = (type: 'success' | 'error', message: string, description: string) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: 4,
    });
  };

  // Lấy danh sách trường khi mount
  useEffect(() => {
    fetchTruongList();
  }, []);

  const fetchTruongList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/truong');
      setTruongList(response.data);
    } catch (error) {
      showNotification(
        'error',
        'Lỗi dữ liệu',
        'Không thể tải danh sách trường. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchNganhList = async (truongKey: string) => {
    setNganhList([]);
    setToHopList([]);
    form.resetFields(['nganh', 'toHop']);
    if (!truongKey) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/nganh/${truongKey}`);
      setNganhList(response.data);
    } catch (error) {
      showNotification(
        'error',
        'Lỗi dữ liệu',
        'Không thể tải danh sách ngành. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchToHopList = async (truongKey: string, nganhKey: string) => {
    setToHopList([]);
    form.resetFields(['toHop']);
    if (!truongKey || !nganhKey) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/tohop/${truongKey}/${nganhKey}`);
      setToHopList(response.data);
    } catch (error) {
      showNotification(
        'error',
        'Lỗi dữ liệu',
        'Không thể tải danh sách tổ hợp. Vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi file upload
  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Xử lý khi submit form
  const handleSubmit = async (values: XetTuyenFormValues) => {
    setSubmitting(true);

    if (!fileList || fileList.length === 0) {
      message.error('Vui lòng tải lên ít nhất 1 file minh chứng!');
      setSubmitting(false);
      return;
    }

    // Lấy userId từ localStorage
    const userId = localStorage.getItem('token');
    if (!userId) {
      message.error('Bạn chưa đăng nhập. Vui lòng đăng nhập để nộp hồ sơ!');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('truong', values.truong);
      formData.append('nganh', values.nganh);
      formData.append('toHop', values.toHop);
      formData.append('hoTen', values.hoTen);
      formData.append('ngaySinh', values.ngaySinh.format('YYYY-MM-DD'));
      formData.append('diemThi', values.diemThi);
      formData.append('doiTuongUuTien', values.doiTuongUuTien || '');

      fileList.forEach((file: any) => {
        formData.append('files', file.originFileObj);
      });

      await axios.post(
        'http://localhost:3000/api/xettuyen',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${userId}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      showNotification('success', 'Thành công', 'Hồ sơ xét tuyển của bạn đã được gửi thành công!');
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      let errorMessage = 'Không thể kết nối đến máy chủ';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || error.response.data.message || 'Gửi hồ sơ thất bại';
      }
      showNotification('error', 'Gửi hồ sơ thất bại', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Card style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30, color: 'red' }}>
          HỒ SƠ XÉT TUYỂN TRỰC TUYẾN
        </Title>
        <Spin spinning={loading || submitting}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              doiTuongUuTien: '',
            }}
          >
            {/* Lựa chọn trường */}
            <Form.Item
              name="truong"
              label="Chọn trường"
              rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}
            >
              <Select
                placeholder="Chọn trường xét tuyển"
                onChange={(value) => fetchNganhList(value)}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={truongList}
              />
            </Form.Item>

            {/* Lựa chọn ngành */}
            <Form.Item
              name="nganh"
              label="Chọn ngành"
              rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}
            >
              <Select
                placeholder="Chọn ngành xét tuyển"
                disabled={nganhList.length === 0}
                onChange={(value) => fetchToHopList(form.getFieldValue('truong'), value)}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={nganhList}
              />
            </Form.Item>

            {/* Lựa chọn tổ hợp */}
            <Form.Item
              name="toHop"
              label="Chọn tổ hợp xét tuyển"
              rules={[{ required: true, message: 'Vui lòng chọn tổ hợp!' }]}
            >
              <Select
                placeholder="Chọn tổ hợp xét tuyển"
                disabled={toHopList.length === 0}
              >
                {toHopList.map(toHop => (
                  <Option key={toHop} value={toHop}>{toHop}</Option>
                ))}
              </Select>
            </Form.Item>

            {/* Thông tin cá nhân */}
            <Form.Item
              name="hoTen"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="ngaySinh"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker
                placeholder="Chọn ngày sinh"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                locale={locale}
              />
            </Form.Item>

            {/* Thông tin điểm thi */}
            <Form.Item
              name="diemThi"
              label="Điểm thi"
              rules={[
                { required: true, message: 'Vui lòng nhập điểm thi!' },
                { pattern: /^(\d{1,2}(\.\d{1,2})?)?$/, message: 'Điểm thi không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập điểm thi" />
            </Form.Item>

            {/* Đối tượng ưu tiên */}
            <Form.Item
              name="doiTuongUuTien"
              label="Đối tượng ưu tiên (nếu có)"
            >
              <Select placeholder="Chọn đối tượng ưu tiên">
                <Option value="">Không có</Option>
                <Option value="01">01 - Con thương binh, liệt sĩ</Option>
                <Option value="02">02 - Con của người có công với cách mạng</Option>
                <Option value="03">03 - Người dân tộc thiểu số</Option>
                <Option value="04">04 - Người thuộc vùng có điều kiện kinh tế đặc biệt khó khăn</Option>
              </Select>
            </Form.Item>

            {/* Upload minh chứng */}
            <Form.Item
              label="Tải lên minh chứng (học bạ, bằng điểm, CCCD,...)"
              rules={[{ required: true, message: 'Vui lòng tải lên ít nhất 1 file minh chứng!' }]}
              extra="Hỗ trợ: JPG, PNG, PDF. Tối đa 3 file."
            >
              <Upload
                listType="picture"
                maxCount={3}
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>Tải lên file</Button>
              </Upload>
            </Form.Item>

            {/* Nút gửi hồ sơ */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SendOutlined />}
                size="large"
                style={{ width: '100%', marginTop: 20, backgroundColor: 'red', borderColor: 'red' }}
              >
                Gửi hồ sơ xét tuyển
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default NoiDungXetTuyen;

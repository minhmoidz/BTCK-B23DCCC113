import React from 'react';
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
  Divider,
  Row,
  Col
} from 'antd';
import { UploadOutlined, SendOutlined, InfoCircleOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import useXetTuyenForm from './useXetTuyenForm';

const { Title, Text } = Typography;
const { Option } = Select;

const NoiDungXetTuyen: React.FC = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  
  const {
    truongList,
    nganhList,
    toHopList,
    phuongThucList,
    selectedPhuongThuc,
    phuongThucRequirements,
    fileList,
    loading,
    onPhuongThucChange,
    onTruongChange,
    onNganhChange,
    beforeUpload,
    onFileChange,
    submitHoSo
  } = useXetTuyenForm();

  // Thông báo
  const showNotification = (type: 'success' | 'error', message: string, description: string) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: 4,
    });
  };

  // Xử lý khi submit form
  const handleSubmit = async (values: any) => {
    try {
      const result = await submitHoSo(values, form);
      if (result) {
        showNotification(
          'success',
          'Nộp hồ sơ thành công',
          `Hồ sơ của bạn đã được gửi thành công với mã hồ sơ: ${result.data.maHoSo}`
        );
      }
    } catch (error) {
      console.error('Lỗi khi nộp hồ sơ:', error);
    }
  };

  // Render các trường form dựa trên yêu cầu của phương thức xét tuyển
  const renderDynamicFields = () => {
    if (!phuongThucRequirements) return null;
    
    return phuongThucRequirements.fields.map(field => {
      switch (field.type) {
        case 'select':
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[{ required: field.required, message: `Vui lòng chọn ${field.label}!` }]}
            >
              <Select placeholder={`Chọn ${field.label}`}>
                {field.options?.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Form.Item>
          );
        
        case 'number':
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[
                { required: field.required, message: `Vui lòng nhập ${field.label}!` },
                { pattern: /^(\d{1,2}(\.\d{1,2})?)?$/, message: 'Giá trị không hợp lệ!' }
              ]}
            >
              <Input type="number" step="0.01" placeholder={`Nhập ${field.label}`} />
            </Form.Item>
          );
        
        case 'date':
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[{ required: field.required, message: `Vui lòng chọn ${field.label}!` }]}
            >
              <DatePicker
                placeholder={`Chọn ${field.label}`}
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                locale={locale}
              />
            </Form.Item>
          );
        
        case 'textarea':
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[{ required: field.required, message: `Vui lòng nhập ${field.label}!` }]}
              extra={field.description}
            >
              <Input.TextArea rows={4} placeholder={`Nhập ${field.label}`} />
            </Form.Item>
          );
        
        default:
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[{ required: field.required, message: `Vui lòng nhập ${field.label}!` }]}
            >
              <Input placeholder={`Nhập ${field.label}`} />
            </Form.Item>
          );
      }
    });
  };

  // Render các trường upload file
  const renderFileUploads = () => {
    if (!phuongThucRequirements) return null;
    
    return phuongThucRequirements.files.map(file => (
      <Form.Item
        key={file.name}
        label={file.label}
        rules={[{ required: file.required, message: `Vui lòng tải lên ${file.label}!` }]}
      >
        <Upload
          listType="picture"
          fileList={fileList[file.name] || []}
          onChange={(info) => onFileChange(file.name, info)}
          beforeUpload={beforeUpload}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Tải lên {file.label}</Button>
        </Upload>
      </Form.Item>
    ));
  };

  return (
    <>
      {contextHolder}
      <Card style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30, color: '#1890ff' }}>
          HỒ SƠ XÉT TUYỂN TRỰC TUYẾN
        </Title>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              doiTuongUuTien: '',
              ngaySinh: moment().subtract(18, 'years')
            }}
          >
            {/* Chọn phương thức xét tuyển */}
            <Form.Item
              name="phuongThuc"
              label={<Text strong>Chọn phương thức xét tuyển</Text>}
              rules={[{ required: true, message: 'Vui lòng chọn phương thức xét tuyển!' }]}
            >
              <Select
                placeholder="Chọn phương thức xét tuyển"
                onChange={(value) => onPhuongThucChange(value, form)}
              >
                {phuongThucList.map(pt => (
                  <Option key={pt.code} value={pt.code}>
                    {pt.name} - {pt.description}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedPhuongThuc && (
              <>
                <Divider orientation="left">Thông tin trường và ngành</Divider>
                
                {/* Lựa chọn trường */}
                <Form.Item
                  name="truong"
                  label="Chọn trường"
                  rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}
                >
                  <Select
                    placeholder="Chọn trường xét tuyển"
                    onChange={(value) => onTruongChange(value, form)}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {truongList.map(truong => (
                      <Option key={truong.id} value={truong.id}>{truong.name}</Option>
                    ))}
                  </Select>
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
                    onChange={(value) => onNganhChange(value, form)}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {nganhList.map(nganh => (
                      <Option key={nganh.id} value={nganh.id}>{nganh.name}</Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Nguyện vọng */}
                <Form.Item
                  name="nguyenVong"
                  label="Nguyện vọng"
                  rules={[{ required: true, message: 'Vui lòng chọn nguyện vọng!' }]}
                >
                  <Select placeholder="Chọn nguyện vọng">
                    <Option value="1">Nguyện vọng 1</Option>
                    <Option value="2">Nguyện vọng 2</Option>
                    <Option value="3">Nguyện vọng 3</Option>
                    <Option value="4">Nguyện vọng 4</Option>
                    <Option value="5">Nguyện vọng 5</Option>
                  </Select>
                </Form.Item>

                <Divider orientation="left">Thông tin cá nhân</Divider>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* Họ và tên */}
                    <Form.Item
                      name="hoTen"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                      <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Ngày sinh */}
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
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* Giới tính */}
                    <Form.Item
                      name="gioiTinh"
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                      <Select placeholder="Chọn giới tính">
                        <Option value="Nam">Nam</Option>
                        <Option value="Nữ">Nữ</Option>
                        <Option value="Khác">Khác</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Dân tộc */}
                    <Form.Item
                      name="danToc"
                      label="Dân tộc"
                      rules={[{ required: true, message: 'Vui lòng nhập dân tộc!' }]}
                    >
                      <Input placeholder="Nhập dân tộc" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* Số CCCD */}
                    <Form.Item
                      name="soCCCD"
                      label="Số CCCD/CMND"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số CCCD/CMND!' },
                        { pattern: /^\d{9,12}$/, message: 'Số CCCD/CMND không hợp lệ!' }
                      ]}
                    >
                      <Input placeholder="Nhập số CCCD/CMND" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Ngày cấp CCCD */}
                    <Form.Item
                      name="ngayCapCCCD"
                      label="Ngày cấp CCCD/CMND"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày cấp!' }]}
                    >
                      <DatePicker
                        placeholder="Chọn ngày cấp"
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        locale={locale}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Nơi cấp CCCD */}
                <Form.Item
                  name="noiCapCCCD"
                  label="Nơi cấp CCCD/CMND"
                  rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}
                >
                  <Input placeholder="Nhập nơi cấp CCCD/CMND" />
                </Form.Item>

                <Divider orientation="left">Thông tin liên hệ</Divider>

                {/* Địa chỉ thường trú */}
                <Form.Item
                  name="diaChiThuongTru"
                  label="Địa chỉ thường trú"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú!' }]}
                >
                  <Input placeholder="Nhập địa chỉ thường trú" />
                </Form.Item>

                {/* Địa chỉ liên hệ */}
                <Form.Item
                  name="diaChiLienHe"
                  label="Địa chỉ liên hệ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ liên hệ!' }]}
                >
                  <Input placeholder="Nhập địa chỉ liên hệ" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* Email */}
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input placeholder="Nhập email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Số điện thoại */}
                    <Form.Item
                      name="soDienThoai"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'Số điện thoại không hợp lệ!' }
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Số điện thoại phụ huynh */}
                <Form.Item
                  name="soDienThoaiPhuHuynh"
                  label="Số điện thoại phụ huynh"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại phụ huynh!' },
                    { pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại phụ huynh" />
                </Form.Item>

                <Divider orientation="left">Thông tin học tập</Divider>

                <Row gutter={16}>
                  <Col span={16}>
                    {/* Trường THPT */}
                    <Form.Item
                      name="truongTHPT"
                      label="Trường THPT"
                      rules={[{ required: true, message: 'Vui lòng nhập trường THPT!' }]}
                    >
                      <Input placeholder="Nhập tên trường THPT" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    {/* Mã trường THPT */}
                    <Form.Item
                      name="maTruongTHPT"
                      label="Mã trường THPT"
                      rules={[{ required: true, message: 'Vui lòng nhập mã trường THPT!' }]}
                    >
                      <Input placeholder="Nhập mã trường" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    {/* Tỉnh/Thành phố trường THPT */}
                    <Form.Item
                      name="tinhThanhTHPT"
                      label="Tỉnh/Thành phố trường THPT"
                      rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}
                    >
                      <Input placeholder="Nhập tỉnh/thành phố" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* Năm tốt nghiệp */}
                    <Form.Item
                      name="namTotNghiep"
                      label="Năm tốt nghiệp"
                      rules={[{ required: true, message: 'Vui lòng nhập năm tốt nghiệp!' }]}
                    >
                      <Input placeholder="Nhập năm tốt nghiệp" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Các trường động theo phương thức xét tuyển */}
                {phuongThucRequirements && (
                  <>
                    <Divider orientation="left">Thông tin xét tuyển {selectedPhuongThuc.toUpperCase()}</Divider>
                    {renderDynamicFields()}
                  </>
                )}

                {/* Ghi chú */}
                <Form.Item
                  name="ghiChu"
                  label="Ghi chú (nếu có)"
                >
                  <Input.TextArea rows={3} placeholder="Nhập ghi chú nếu có" />
                </Form.Item>

                {/* Upload file */}
                {phuongThucRequirements && (
                  <>
                    <Divider orientation="left">Tài liệu minh chứng</Divider>
                    <div style={{ marginBottom: 16 }}>
                      <Text type="secondary">
                        <InfoCircleOutlined /> Vui lòng tải lên các tài liệu minh chứng theo yêu cầu. Chỉ chấp nhận file PDF, JPG, PNG và dung lượng tối đa 5MB.
                      </Text>
                    </div>
                    {renderFileUploads()}
                  </>
                )}

                {/* Nút gửi hồ sơ */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    size="large"
                    style={{ width: '100%', marginTop: 20 }}
                  >
                    Gửi hồ sơ xét tuyển
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default NoiDungXetTuyen;

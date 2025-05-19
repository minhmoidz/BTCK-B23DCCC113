import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Link } = Typography;

interface RegisterFormProps {
  switchToLogin: () => void;
  showNotification: (type: 'success' | 'error', message: string, description: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ switchToLogin, showNotification }) => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form] = Form.useForm();

  // Hàm gửi OTP (fake implementation, trong thực tế bạn sẽ gọi API để gửi OTP)
  const handleSendOTP = async () => {
    try {
      const email = form.getFieldValue('email');
      const phone = form.getFieldValue('soDienThoai');
      
      if (!email || !phone) {
        showNotification('error', 'Thiếu thông tin', 'Vui lòng nhập email và số điện thoại để nhận OTP');
        return;
      }

      // Giả lập gửi OTP - luôn thành công với mã 123456
      showNotification('success', 'Đã gửi OTP', `Mã OTP đã được gửi đến số điện thoại ${phone}. Vui lòng kiểm tra!`);
      setOtpSent(true);
    } catch (error) {
      console.error('Lỗi khi gửi OTP:', error);
      showNotification('error', 'Lỗi', 'Không thể gửi mã OTP. Vui lòng thử lại sau.');
    }
  };

  const handleFinish = async (values: {
    canCuoc: string;
    ten: string;
    soDienThoai: string;
    email: string;
    matKhau: string;
    otp: string;
  }) => {
    setLoading(true);
    try {
      // Gọi API đăng ký
      const response = await axios.post('http://localhost:3000/api/register', {
        canCuoc: values.canCuoc,
        ten: values.ten,
        soDienThoai: values.soDienThoai,
        email: values.email,
        matKhau: values.matKhau,
        otp: values.otp // Mã OTP là 123456 (mặc định theo backend)
      });

      const { token, user } = response.data;
      
      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      showNotification('success', 'Đăng ký thành công', 'Tài khoản của bạn đã được tạo thành công!');
      
      // Chuyển sang trang đăng nhập
      switchToLogin();
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      
      // Hiển thị thông báo lỗi
      let errorMessage = 'Không thể kết nối đến máy chủ';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || 'Đăng ký thất bại';
      }
      
      showNotification('error', 'Đăng ký thất bại', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={handleFinish}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="canCuoc"
        rules={[
          { required: true, message: 'Vui lòng nhập căn cước công dân!' },
          { pattern: /^\d{12}$/, message: 'Căn cước công dân phải có 12 chữ số!' }
        ]}
      >
        <Input
          prefix={<IdcardOutlined />}
          placeholder="Căn cước công dân"
        />
      </Form.Item>

      <Form.Item
        name="ten"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Họ và tên"
        />
      </Form.Item>

      <Form.Item
        name="soDienThoai"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          { pattern: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ!' }
        ]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="Số điện thoại"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
        />
      </Form.Item>

      <Form.Item
        name="matKhau"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['matKhau']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('matKhau') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Xác nhận mật khẩu"
        />
      </Form.Item>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={16}>
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Vui lòng nhập mã OTP!' },
              { len: 6, message: 'Mã OTP có 6 chữ số!' }
            ]}
          >
            <Input placeholder="Nhập mã OTP" maxLength={6} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Button 
            type="default" 
            onClick={handleSendOTP} 
            style={{ width: '100%' }}
          >
            Gửi OTP
          </Button>
        </Col>
      </Row>
      
      <Form.Item>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ height: '40px', backgroundColor: 'red', borderColor: 'red' }}
          >
            Đăng ký
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Text>
              Đã có tài khoản? <Link onClick={switchToLogin} style={{ color: 'red' }}>Đăng nhập ngay</Link>
            </Text>
          </div>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';

const { Text } = Typography;

interface OTPFormProps {
  email: string;
  onVerifySuccess: () => void;
  switchToRegisterStep: (step: number) => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ email, onVerifySuccess, switchToRegisterStep }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { otp: string }) => {
    setLoading(true);
    try {
      const res = await fetch('https://btck-123.onrender.com/api/auth/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: values.otp }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        notification.success({ 
          message: 'Xác thực thành công', 
          description: 'Bạn đã đăng ký thành công' 
        });
        onVerifySuccess();
      } else {
        notification.error({ 
          message: 'Xác thực thất bại', 
          description: data.message || 'OTP không hợp lệ hoặc hết hạn' 
        });
      }
    } catch (error) {
      notification.error({ 
        message: 'Lỗi mạng', 
        description: 'Không thể kết nối tới máy chủ' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại mã OTP
  const handleResendOTP = async () => {
    if (!email) {
      notification.error({ message: 'Lỗi', description: 'Không có email để gửi OTP' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('https://btck-123.onrender.com/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        notification.success({ 
          message: 'Gửi lại OTP thành công', 
          description: 'Mã OTP mới đã được gửi đến email của bạn' 
        });
      } else {
        notification.error({ 
          message: 'Gửi lại OTP thất bại', 
          description: data.message || 'Không thể gửi lại mã OTP' 
        });
      }
    } catch (error) {
      notification.error({ 
        message: 'Lỗi mạng', 
        description: 'Không thể kết nối tới máy chủ' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text>Nhập mã OTP đã gửi đến email: <b>{email}</b></Text>
      
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
        <Form.Item 
          name="otp" 
          label="Mã OTP" 
          rules={[{ required: true, message: 'Nhập mã OTP' }]}
        >
          <Input maxLength={6} placeholder="Mã OTP" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Xác nhận OTP
          </Button>
        </Form.Item>
        
        <Form.Item>
          <Button type="default" onClick={handleResendOTP} block>
            Gửi lại mã OTP
          </Button>
        </Form.Item>
        
        <Button type="link" onClick={() => switchToRegisterStep(1)} block>
          Quay lại đăng ký
        </Button>
      </Form>
    </>
  );
};

export default OTPForm;
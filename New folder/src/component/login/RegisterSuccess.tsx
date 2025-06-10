import React from 'react';
import { Result, Button } from 'antd';

interface RegisterSuccessProps {
  handleBackToLogin: () => void;
}

const RegisterSuccess: React.FC<RegisterSuccessProps> = ({ handleBackToLogin }) => {
  return (
    <Result
      status="success"
      title="Đăng ký thành công!"
      subTitle="Tài khoản của bạn đã được tạo thành công."
      extra={[
        <Button type="primary" key="login" onClick={handleBackToLogin}>
          Trở về đăng nhập
        </Button>,
      ]}
    />
  );
};

export default RegisterSuccess;
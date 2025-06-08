import React, { useState } from 'react';
import { Card, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import OTPForm from './OTPForm';
import LoginForm from './LoginForm';

const { Title } = Typography;

// Cập nhật props để nhận hàm onLogin từ Router
const SimpleAuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Hiển thị màn hình đăng nhập trước
  const [registerStep, setRegisterStep] = useState(1); // 1: Đăng ký, 2: Nhập OTP
  const [loading, setLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerInfo, setRegisterInfo] = useState(null);
  
  // Sử dụng hook useNavigate của React Router để chuyển hướng
  const navigate = useNavigate();

  // Xử lý đăng nhập
  const handleLogin = async (sdt, password) => {
    setLoading(true);
    try {
      const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdt, password }),
      });
      
      const loginData = await loginRes.json();
      
      if (loginRes.ok) {
        notification.success({ 
          message: 'Đăng nhập thành công', 
          description: `Chào mừng ${loginData.user?.ten || 'bạn'}!` 
        });
        // Lưu thông tin đăng nhập vào localStorage nếu cần
        if (loginData.token) {
          localStorage.setItem('token', loginData.token);
        }
        if (loginData.user) {
          localStorage.setItem('user', JSON.stringify(loginData.user));
          // Gọi hàm onLogin từ props để cập nhật trạng thái đăng nhập ở component cha
          onLogin(loginData.user.ten || loginData.user.sdt);
        }
        // Sử dụng React Router để chuyển hướng
        navigate('/dashboard');
      } else {
        notification.error({ 
          message: 'Đăng nhập thất bại', 
          description: loginData.message || 'Sai số điện thoại hoặc mật khẩu.'
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

  // Gọi API đăng ký và xử lý kết quả
  const handleRegister = async (ten, sdt, email, password) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ten, sdt, email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        notification.success({ 
          message: 'Đăng ký thành công', 
          description: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác nhận.' 
        });
        // Lưu thông tin đăng ký và chuyển sang màn hình nhập OTP
        setRegisterEmail(email);
        setRegisterInfo({ ten, sdt, password });
        setRegisterStep(2);
      } else {
        notification.error({ 
          message: 'Đăng ký thất bại', 
          description: data.message || 'Có lỗi xảy ra khi đăng ký.'
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

  // Chuyển đổi màn hình đăng ký và OTP
  const switchToRegisterStep = (step) => {
    setRegisterStep(step);
  };

  // Chuyển đổi giữa đăng nhập và đăng ký
  const toggleLoginRegister = (login) => {
    setIsLogin(login);
    if (login) {
      setRegisterStep(1);
    }
  };

  // Xác thực OTP thành công
  const handleOTPVerifySuccess = () => {
    // Sau khi xác thực OTP thành công, tự động đăng nhập
    handleLoginAfterOTPVerification();
  };

  // Tự động đăng nhập sau khi xác thực OTP
  const handleLoginAfterOTPVerification = async () => {
    if (!registerInfo) {
      notification.error({ message: 'Lỗi', description: 'Không có thông tin đăng nhập' });
      return;
    }

    setLoading(true);
    try {
      const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdt: registerInfo.sdt, password: registerInfo.password }),
      });
      
      const loginData = await loginRes.json();
      
      if (loginRes.ok) {
        notification.success({ 
          message: 'Đăng nhập thành công', 
          description: `Chào mừng ${loginData.user?.ten || 'bạn'}!` 
        });
        // Lưu thông tin đăng nhập vào localStorage nếu cần
        if (loginData.token) {
          localStorage.setItem('token', loginData.token);
        }
        if (loginData.user) {
          localStorage.setItem('user', JSON.stringify(loginData.user));
          // Gọi hàm onLogin từ props để cập nhật trạng thái đăng nhập ở component cha
          onLogin(loginData.user.ten || loginData.user.sdt);
        }
        // Sử dụng React Router để chuyển hướng
        navigate('/dashboard');
      } else {
        notification.error({ 
          message: 'Đăng nhập thất bại', 
          description: loginData.message || 'Có lỗi xảy ra khi đăng nhập.'
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

  // Xử lý chuyển trang đăng nhập admin
  const handleGoToAdminLogin = () => {
    navigate('/admin');
  };

  // Xác định tiêu đề dựa trên trạng thái hiện tại của trang
  const getPageTitle = () => {
    if (isLogin) return 'Đăng nhập';
    return registerStep === 1 ? 'Đăng ký' : 'Xác thực OTP';
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>
          {getPageTitle()}
        </Title>
        
        {isLogin && (
          <LoginForm 
            loading={loading}
            onLogin={handleLogin}
            onRegister={() => toggleLoginRegister(false)}
            goToAdminLogin={handleGoToAdminLogin}
          />
        )}
        
        {!isLogin && registerStep === 1 && (
          <RegisterForm 
            loading={loading}
            setLoading={setLoading}
            showNotification={(type, message, description) => 
              notification[type]({ message, description })
            }
            onRegister={handleRegister}
            setIsLogin={() => toggleLoginRegister(true)}
            goToAdminLogin={handleGoToAdminLogin}
          />
        )}
        
        {!isLogin && registerStep === 2 && (
          <OTPForm 
            email={registerEmail} 
            onVerifySuccess={handleOTPVerifySuccess}
            switchToRegisterStep={switchToRegisterStep}
          />
        )}
      </Card>
    </div>
  );
};

export default SimpleAuthPage;
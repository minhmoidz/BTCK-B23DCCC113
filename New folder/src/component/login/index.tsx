<<<<<<< HEAD
import React, { useState } from 'react';
import { Card, Typography, notification } from 'antd';
=======
import React, { useState, useCallback, useMemo } from 'react';
import { Card, Typography, notification, Spin } from 'antd';
>>>>>>> temp-remote/main
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import OTPForm from './OTPForm';
import LoginForm from './LoginForm';

const { Title } = Typography;

<<<<<<< HEAD
// Cập nhật props để nhận hàm onLogin từ Router
const SimpleAuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Hiển thị màn hình đăng nhập trước
  const [registerStep, setRegisterStep] = useState(1); // 1: Đăng ký, 2: Nhập OTP
=======
// Constants
const API_BASE_URL = 'http://localhost:3000/api/auth';
const ADMIN_CREDENTIALS = {
  username: 'admin@gmail.com',
  password: 'admin123'
};

// Notification messages factory
const createNotificationMessages = () => ({
  loginSuccess: (name) => ({
    message: 'Đăng nhập thành công',
    description: `Chào mừng ${name}!`
  }),
  loginError: (message) => ({
    message: 'Đăng nhập thất bại',
    description: message || 'Sai số điện thoại hoặc mật khẩu.'
  }),
  registerSuccess: {
    message: 'Đăng ký thành công',
    description: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác nhận.'
  },
  registerError: (message) => ({
    message: 'Đăng ký thất bại',
    description: message || 'Có lỗi xảy ra khi đăng ký.'
  }),
  networkError: {
    message: 'Lỗi mạng',
    description: 'Không thể kết nối tới máy chủ'
  },
  adminLoginSuccess: {
    message: 'Đăng nhập Admin thành công',
    description: 'Chào mừng Quản trị viên!'
  }
});

const SimpleAuthPage = ({ onLogin, backgroundImage = '/tit.jpg' }) => {
  // State management
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
>>>>>>> temp-remote/main
  const [loading, setLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerInfo, setRegisterInfo] = useState(null);
  
<<<<<<< HEAD
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
=======
  const navigate = useNavigate();
  const NOTIFICATION_MESSAGES = useMemo(() => createNotificationMessages(), []);

  // Utility functions
  const handleApiCall = useCallback(async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return { response, data: responseData };
    } catch (error) {
      throw new Error('Network request failed');
    }
  }, []);

  const saveUserSession = useCallback((token, user) => {
    if (token) localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      onLogin?.(user.ten || user.sdt);
    }
  }, [onLogin]);

  const saveAdminSession = useCallback(() => {
    const adminData = {
      id: 'admin-001',
      username: 'admin',
      ten: 'Admin Tổng',
      role: 'superAdmin',  // ← Sửa từ 'admin' thành 'superAdmin'
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('userRole', 'superAdmin');  // ← Sửa từ 'admin' thành 'superAdmin'
    localStorage.setItem('user', JSON.stringify(adminData));
    localStorage.setItem('token', 'admin-token-' + Date.now());
  }, []);
  

  // Navigation helper
  const navigateByRole = useCallback((userRole) => {
    const routes = {
      superAdmin: '/super-admin',
      schoolAdmin: '/school-admin',
      user: '/school-admin'
    };
    navigate(routes[userRole] || '/school-admin');
  }, [navigate]);

  // Authentication handlers
  const handleLogin = useCallback(async (sdt, password) => {
    setLoading(true);
    try {
      const { response, data } = await handleApiCall(`${API_BASE_URL}/login`, { sdt, password });
      
      if (response.ok) {
        notification.success(NOTIFICATION_MESSAGES.loginSuccess(data.user?.ten || 'bạn'));
        saveUserSession(data.token, data.user);
        navigateByRole(data.user?.role);
      } else {
        notification.error(NOTIFICATION_MESSAGES.loginError(data.message));
      }
    } catch (error) {
      console.error('Login error:', error);
      notification.error(NOTIFICATION_MESSAGES.networkError);
    } finally {
      setLoading(false);
    }
  }, [handleApiCall, NOTIFICATION_MESSAGES, saveUserSession, navigateByRole]);

  const handleAdminLogin = useCallback((username, password) => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const isValidAdmin = username === ADMIN_CREDENTIALS.username && 
                           password === ADMIN_CREDENTIALS.password;
        
        if (isValidAdmin) {
          saveAdminSession();
          notification.success(NOTIFICATION_MESSAGES.adminLoginSuccess);
          onLogin?.('Admin');
          setTimeout(() => navigate('/admin'), 100);
        } else {
          notification.error(NOTIFICATION_MESSAGES.loginError('Sai tài khoản hoặc mật khẩu Admin.'));
        }
      } catch (error) {
        console.error('Admin login error:', error);
        notification.error({
          message: 'Lỗi đăng nhập',
          description: 'Có lỗi xảy ra trong quá trình đăng nhập.'
        });
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [saveAdminSession, NOTIFICATION_MESSAGES, onLogin, navigate]);

  const handleRegister = useCallback(async (ten, sdt, email, password) => {
    setLoading(true);
    try {
      const { response, data } = await handleApiCall(`${API_BASE_URL}/register`, { ten, sdt, email, password });
      
      if (response.ok) {
        notification.success(NOTIFICATION_MESSAGES.registerSuccess);
>>>>>>> temp-remote/main
        setRegisterEmail(email);
        setRegisterInfo({ ten, sdt, password });
        setRegisterStep(2);
      } else {
<<<<<<< HEAD
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
=======
        notification.error(NOTIFICATION_MESSAGES.registerError(data.message));
      }
    } catch (error) {
      console.error('Register error:', error);
      notification.error(NOTIFICATION_MESSAGES.networkError);
    } finally {
      setLoading(false);
    }
  }, [handleApiCall, NOTIFICATION_MESSAGES]);

  const handleLoginAfterOTPVerification = useCallback(async () => {
>>>>>>> temp-remote/main
    if (!registerInfo) {
      notification.error({ message: 'Lỗi', description: 'Không có thông tin đăng nhập' });
      return;
    }

    setLoading(true);
    try {
<<<<<<< HEAD
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
=======
      const { response, data } = await handleApiCall(`${API_BASE_URL}/login`, {
        sdt: registerInfo.sdt,
        password: registerInfo.password
      });
      
      if (response.ok) {
        notification.success(NOTIFICATION_MESSAGES.loginSuccess(data.user?.ten || 'bạn'));
        saveUserSession(data.token, data.user);
        navigate('/dashboard');
      } else {
        notification.error(NOTIFICATION_MESSAGES.loginError(data.message));
      }
    } catch (error) {
      console.error('Login after OTP error:', error);
      notification.error(NOTIFICATION_MESSAGES.networkError);
    } finally {
      setLoading(false);
    }
  }, [registerInfo, handleApiCall, NOTIFICATION_MESSAGES, saveUserSession, navigate]);

  // UI handlers
  const toggleLoginRegister = useCallback((login) => {
    setIsLogin(login);
    if (login) setRegisterStep(1);
  }, []);

  const handleOTPVerifySuccess = useCallback(() => {
    handleLoginAfterOTPVerification();
  }, [handleLoginAfterOTPVerification]);

  const handleGoToAdminLogin = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

  // Memoized styles
  const styles = useMemo(() => ({
    container: {
      minHeight: '100vh',
      background: backgroundImage 
        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      maxWidth: 420,
      margin: '50px auto',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden'
    },
    title: {
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '32px'
    },
    cardBody: {
      padding: '40px 32px'
    }
  }), [backgroundImage]);

  // Get page title
  const pageTitle = useMemo(() => {
    if (isLogin) return 'Đăng nhập';
    return registerStep === 1 ? 'Đăng ký' : 'Xác thực OTP';
  }, [isLogin, registerStep]);

  return (
    <div style={styles.container}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Spin spinning={loading} size="large">
          <Card style={styles.card} bodyStyle={styles.cardBody}>
            <Title level={2} style={styles.title}>
              {pageTitle}
            </Title>
            
            {isLogin && (
              <LoginForm 
                loading={loading}
                onLogin={handleLogin}
                onRegister={() => toggleLoginRegister(false)}
                onAdminLogin={handleAdminLogin}
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
                switchToRegisterStep={setRegisterStep}
              />
            )}
          </Card>
        </Spin>
      </div>
>>>>>>> temp-remote/main
    </div>
  );
};

export default SimpleAuthPage;
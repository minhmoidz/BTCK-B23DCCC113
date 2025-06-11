import React, { useState, useCallback, useMemo } from 'react';
import { Card, Typography, notification, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import OTPForm from './OTPForm';
import LoginForm from './LoginForm';

const { Title } = Typography;

// Types
type UserRole = 'superAdmin' | 'schoolAdmin' | 'user';

interface User {
  id: string;
  ten: string;
  sdt: string;
  email: string;
  role: UserRole;
  schoolId?: string;
}

interface RegisterInfo {
  ten: string;
  sdt: string;
  password: string;
}

// Constants
const API_BASE_URL = 'https://btck-123.onrender.com/api/auth';
const ADMIN_CREDENTIALS = {
  username: 'admin@gmail.com',
  password: 'admin123'
};

// Notification messages factory
const createNotificationMessages = () => ({
  loginSuccess: (name: string) => ({
    message: 'Đăng nhập thành công',
    description: `Chào mừng ${name}!`
  }),
  loginError: (message: string) => ({
    message: 'Đăng nhập thất bại',
    description: message || 'Sai số điện thoại hoặc mật khẩu.'
  }),
  registerSuccess: {
    message: 'Đăng ký thành công',
    description: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác nhận.'
  },
  registerError: (message: string) => ({
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

interface SimpleAuthPageProps {
  onLogin?: (name: string) => void;
  backgroundImage?: string;
}

const SimpleAuthPage: React.FC<SimpleAuthPageProps> = ({ onLogin, backgroundImage = '/tit.jpg' }) => {
  // State management
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo | null>(null);
  
  const navigate = useNavigate();
  const NOTIFICATION_MESSAGES = useMemo(() => createNotificationMessages(), []);

  // Utility functions
  const handleApiCall = useCallback(async (url: string, data: any) => {
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

  const saveUserSession = useCallback((token: string, user: User) => {
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
  const navigateByRole = useCallback((userRole: UserRole) => {
    const routes: Record<UserRole, string> = {
      superAdmin: '/admin',
      schoolAdmin: '/school-admin',
      user: '/dashboard'  // Thay đổi route cho user thường
    };
    navigate(routes[userRole] || '/dashboard');  // Mặc định là /dashboard cho user thường
  }, [navigate]);

  // Authentication handlers
  const handleLogin = useCallback(async (sdt: string, password: string) => {
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

  const handleAdminLogin = useCallback((username: string, password: string) => {
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

  const handleRegister = useCallback(async (ten: string, sdt: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { response, data } = await handleApiCall(`${API_BASE_URL}/register`, { ten, sdt, email, password });
      
      if (response.ok) {
        notification.success(NOTIFICATION_MESSAGES.registerSuccess);
        setRegisterEmail(email);
        setRegisterInfo({ ten, sdt, password });
        setRegisterStep(2);
      } else {
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
    if (!registerInfo) {
      notification.error({ message: 'Lỗi', description: 'Không có thông tin đăng nhập' });
      return;
    }

    setLoading(true);
    try {
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
    </div>
  );
};

export default SimpleAuthPage;
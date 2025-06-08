import React, { useState, useEffect } from 'react';
import Router from './services/router/routes';
import '@ant-design/v5-patch-for-react-19';
const App: React.FC = () => {
  // Khởi tạo state từ localStorage nếu có
  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    return localStorage.getItem('loggedInUser');
  });

  // Khi đăng nhập, lưu username vào state và localStorage
  const handleLogin = (username: string) => {
    setLoggedInUser(username);
    localStorage.setItem('loggedInUser', username);
  };

  // Khi đăng xuất, xóa username khỏi state và localStorage
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  // Optional: đồng bộ nếu localStorage thay đổi (ví dụ tab khác)
  useEffect(() => {
    const onStorageChange = () => {
      const user = localStorage.getItem('loggedInUser');
      setLoggedInUser(user);
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return <Router loggedInUser={loggedInUser} onLogin={handleLogin} onLogout={handleLogout} />;
};

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from '../component/login/index';
import Home from '../pages/trangchu/Home';
import Dashboard from '../pages/dashboard/Dashboard';
import MajorDetail from '../pages/nganhhoc/MajorDetail';
import ChatPage from '../pages/hotro/chatbot';
import XetTuyen from '../pages/xettuyen/XetTuyen';
import ThanhToan from '../pages/thanhtoan/ThanhToan';
import TheoDoiHoSoTraCuu from '../pages/tracuu/TraCuu';

interface RouterProps {
  loggedInUser: string | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

const Router: React.FC<RouterProps> = ({ loggedInUser, onLogin, onLogout }) => (
  <BrowserRouter>
    <Routes>
      {/* Trang công khai */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          loggedInUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginRegister onLogin={onLogin} />
          )
        }
      />
      <Route path="/major/:slug" element={<MajorDetail />} />
      <Route path="/chat" element={<ChatPage />} />

      {/* Trang Dashboard riêng biệt */}
      <Route
        path="/dashboard"
        element={
          loggedInUser ? (
            <Dashboard username={loggedInUser} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Các trang dịch vụ riêng biệt, không phải route con */}
      <Route
        path="/xettuyen"
        element={
          loggedInUser ? <XetTuyen username={''} onLogout={function (): void {
            throw new Error('Function not implemented.');
          } } /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/tra-cuu"
        element={
          loggedInUser ? <TheoDoiHoSoTraCuu /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/thanh-toan"
        element={
          loggedInUser ? <ThanhToan /> : <Navigate to="/login" replace />
        }
      />

      {/* Route fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default Router;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../pages/trangchu/Home';
import MajorDetail from '../../pages/nganhhoc/MajorDetail';
import ChatPage from '../../pages/hotro/chatbot';
import XetTuyen from '../../pages/xettuyen/XetTuyen';
import ThanhToan from '../../pages/thanhtoan/ThanhToan';
import TheoDoiHoSoTraCuu from '../../pages/tracuu/TraCuu';
import SimpleAuthPage from '../../component/login';
import QuyCheThi from '../../pages/huongdan/QuyCheThi';
import DangKy from '../../pages/huongdan/DangKy';
import LePhi from '../../pages/huongdan/LePhi';
import TraCuuHuongDan from '../../pages/huongdan/TraCuu';
import FAQ from '../../pages/huongdan/FAQ';
import LienHe from '../../pages/huongdan/LienHe';
import HSA from '../../pages/kythi/HSA';
import TSA from '../../pages/kythi/TSA';
import LichSuKyThi from '../../pages/kythi/LichSu';
import DeThiMau from '../../pages/kythi/DeThiMau';
import DGNL from '../../pages/lichthi/DGNL';
import DGTD from '../../pages/lichthi/DGTD';
import THPTQGLichThi from '../../pages/lichthi/THPTQG';
import ThoiHan from '../../pages/lichthi/ThoiHan';
import DiemThi from '../../pages/tracuu/DiemThi';
import HoSo from '../../pages/tracuu/HoSo';
import LichSuTraCuu from '../../pages/tracuu/LichSu';
import ThongBao from '../../pages/tracuu/ThongBao';
import THPTQGDiem from '../../pages/tracuu/THPTQG';
import KinhNghiem from '../../pages/dien-dan/KinhNghiem';
import HoiDap from '../../pages/dien-dan/HoiDap';
import TinTuc from '../../pages/dien-dan/TinTuc';
import AllNotification from '../../pages/thongbao/AllNotification';

// Import các component Admin
import ProfileManager from '../../pages/admin/ProfileManager';
import AdminLayout from '../../pages/admin/AdminLayout';
import DashboardAdmin from '../../pages/admin/DashboardAdmin';
import Dashboard from '../../pages/dashboard/Dashboard';
import DetailedAdmissionRulesPage from '../../pages/admin/DetailedAdmissionRulesPage';
import AdmissionManagement from '../../pages/admin/AdmissionManagement';
import EducationManagement from '../../pages/admin/EducationManagement';
import Chat from '../../component/admin/chat/Chat';
import NotificationManager from '../../pages/admin/NotificationManagerment';
// Sửa import này - dùng SchoolAdminProfileManager thay vì SchoolAdminDashboard
import SchoolAdminProfileManager from '../../pages/adminSchool/SchoolAdminProfileManager';
import ProtectedRoute from '../../component/login/ProtectedRoute';
import NotificationDetail from '../../pages/thongbao/NotificationDetail';
import XetTuyenManager from '../../pages/admin/XetTuyenManager';

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
            <SimpleAuthPage onLogin={onLogin} />
          )
        }
      />
      <Route path="/major/:slug" element={<MajorDetail />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/thong-bao" element={<AllNotification />} />
      <Route path="/thong-bao/:id" element={<NotificationDetail />} />
      <Route path="/huong-dan/quy-che-thi" element={<QuyCheThi />} />
      <Route path="/huong-dan/dang-ky" element={<DangKy />} />
      <Route path="/huong-dan/le-phi" element={<LePhi />} />
      <Route path="/huong-dan/tra-cuu" element={<TraCuuHuongDan />} />
      <Route path="/huong-dan/faq" element={<FAQ />} />
      <Route path="/huong-dan/lien-he" element={<LienHe />} />
      <Route path="/ky-thi/hsa" element={<HSA />} />
      <Route path="/ky-thi/tsa" element={<TSA />} />
      <Route path="/ky-thi/lich-su" element={<LichSuKyThi />} />
      <Route path="/ky-thi/de-thi-mau" element={<DeThiMau />} />
      <Route path="/lich-thi/dgnl" element={<DGNL />} />
      <Route path="/lich-thi/dgtd" element={<DGTD />} />
      <Route path="/lich-thi/thptqg" element={<THPTQGLichThi />} />
      <Route path="/lich-thi/thoi-han" element={<ThoiHan />} />
      <Route path="/tra-cuu/diem" element={<DiemThi />} />
      <Route path="/tra-cuu/ho-so" element={<HoSo />} />
      <Route path="/tra-cuu/lich-su" element={<LichSuTraCuu />} />
      <Route path="/tra-cuu/thong-bao" element={<ThongBao />} />
      <Route path="/tra-cuu/thptqg" element={<THPTQGDiem />} />
      <Route path="/dien-dan/kinh-nghiem" element={<KinhNghiem />} />
      <Route path="/dien-dan/hoi-dap" element={<HoiDap />} />
      <Route path="/dien-dan/tin-tuc" element={<TinTuc />} />

      {/* Trang Admin với các route con */}
      <Route path="/admin" element={
        loggedInUser ? (
          <AdminLayout/>
        ) : (
          <Navigate to="/login" replace />
        )
      }>
        <Route index element={<DashboardAdmin />} />
        <Route path="chi-tieu" element={<AdmissionManagement />} />
        <Route path="xet-tuyen" element={<XetTuyenManager/>} />
        <Route path="nganh-truong" element={<EducationManagement/>} />
        <Route path="ho-so" element={<ProfileManager />} />
        <Route path="cau-hinh" element={<DetailedAdmissionRulesPage />} />
        <Route path="chat" element={<Chat />} />
        <Route path="thong-bao" element={<NotificationManager />} />
      </Route>

      {/* Route cho School Admin */}
      <Route 
        path="/school-admin" 
        element={
          loggedInUser ? (
            <SchoolAdminProfileManager/>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Trang Dashboard riêng biệt */}
      <Route
        path="/dashboard"
        element={
          loggedInUser ? (
            <Dashboard userId={loggedInUser} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Các trang dịch vụ riêng biệt */}
      <Route
        path="/xettuyen"
        element={
          loggedInUser ? <XetTuyen username={loggedInUser} onLogout={onLogout} /> : <Navigate to="/login" replace />
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
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import XetTuyenManager from './XetTuyenManager';
import ProfileManager from './ProfileManager';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import 'antd/dist/reset.css';
import Test from './EducationManagement';
import DetailedAdmissionRulesPage from './DetailedAdmissionRulesPage';
import AdmissionManagement from './AdmissionManagement';
import Chat from '../../component/admin/chat/Chat';
<<<<<<< HEAD
import NotificationManagement from './NotificationManagement';
=======
import NotificationManager from './NotificationManager';
>>>>>>> temp-remote/main

const Admin = () => {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          <Route path="/" element={
            <AdminLayout>
              <Test />
            </AdminLayout>
          } />
          <Route path="/chi-tieu" element={
            <AdminLayout>
              <AdmissionManagement />
            </AdminLayout>
          } />
          <Route path="/xet-tuyen" element={
            <AdminLayout>
              <XetTuyenManager />
            </AdminLayout>
          } />
          <Route path="/ho-so" element={
            <AdminLayout>
              <ProfileManager />
            </AdminLayout>
          } />
<<<<<<< HEAD
=======
          <Route path="/qly-thong-bao" element={
            <AdminLayout>
              <NotificationManager />
            </AdminLayout>
          } />
>>>>>>> temp-remote/main
          <Route path="/cau-hinh" element={
            <AdminLayout>
              <DetailedAdmissionRulesPage />
            </AdminLayout>
          } />
          <Route path="/chat" element={
            <AdminLayout>
              <Chat />
            </AdminLayout>
          } />
<<<<<<< HEAD
          <Route path="/thong-bao" element={
            <AdminLayout>
              <NotificationManagement />
            </AdminLayout>
          } />
=======
>>>>>>> temp-remote/main
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default Admin;

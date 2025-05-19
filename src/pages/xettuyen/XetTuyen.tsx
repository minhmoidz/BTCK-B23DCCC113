import React from 'react';
import RootLayout from '../../component/dunglai/RootLayout';
import XetTuyenForm from '../../component/dashboard/XetTuyenForm';

interface XetTuyenProps {
  username: string;
  onLogout: () => void;
}

const XetTuyen: React.FC<XetTuyenProps> = ({ username, onLogout }) => {
  return (
    <RootLayout username={username} onLogout={onLogout}>
      <h1 style={{ color: '#1890ff', fontWeight: 'bold', marginBottom: 24 }}>
        Đăng ký xét tuyển
      </h1>
      <XetTuyenForm />
    </RootLayout>
  );
};

export default XetTuyen;

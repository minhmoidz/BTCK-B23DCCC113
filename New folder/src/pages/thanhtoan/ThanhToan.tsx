import React from 'react';
import RootLayout from '../../component/dunglai/RootLayout';

const ThanhToan: React.FC = () => (
  <RootLayout username="MINH" onLogout={() => {}}>
    <h2>Thanh toan trực tuyến</h2>
    <p>Đây là trang xét tuyển trực tuyến.</p>
  </RootLayout>
);

export default ThanhToan;

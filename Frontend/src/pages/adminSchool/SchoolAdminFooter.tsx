import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const SchoolAdminFooter = () => (
  <Footer style={{
    textAlign: 'center',
    background: '#fafafa',
    borderTop: '1px solid #f0f0f0',
    marginTop: 24
  }}>
    © {new Date().getFullYear()} Hệ thống quản lý hồ sơ tuyển sinh. Liên hệ: support@yourdomain.vn
  </Footer>
);

export default SchoolAdminFooter;

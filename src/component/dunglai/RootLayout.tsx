import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import FooterPTIT from './FooterPTIT';
import type { ReactNode } from 'react';

const { Content } = Layout;

interface RootLayoutProps {
  username: string;
  onLogout: () => void;
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ username, onLogout, children }) => (
  <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
    <Navbar username={username} onLogout={onLogout} />
    <Content
      style={{
        minHeight: 360,
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
        width: '100%',
        margin: 0,
      }}
    >
      {children}
    </Content>
    <FooterPTIT />
  </Layout>
);

export default RootLayout;

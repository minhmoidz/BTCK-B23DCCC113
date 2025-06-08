import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import RootLayout from '../../component/dunglai/RootLayout';
import XetTuyenForm from '../../component/user/dashboard/XetTuyenForm';
import NguyenVongList from '../../pages/xettuyen/NguyenVongList';

const { TabPane } = Tabs;

interface XetTuyenProps {
  username: string;
  onLogout: () => void;
}

const XetTuyen: React.FC<XetTuyenProps> = ({ username, onLogout }) => {
  const [activeTab, setActiveTab] = useState('danhSach');
  const [refreshKey, setRefreshKey] = useState(0);

  // Hàm callback khi đăng ký nguyện vọng thành công
  const handleSubmitSuccess = () => {
    setActiveTab('danhSach');
    setRefreshKey(prev => prev + 1); // Trigger re-render của NguyenVongList
  };

  return (
    <RootLayout username={username} onLogout={onLogout}>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        size="large"
        tabBarExtraContent={
          activeTab === 'danhSach' ? (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setActiveTab('dangKy')}
            >
              Đăng ký nguyện vọng mới
            </Button>
          ) : null
        }
      >
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              Danh sách nguyện vọng
            </span>
          } 
          key="danhSach"
        >
          <NguyenVongList key={refreshKey} />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <PlusOutlined />
              Đăng ký nguyện vọng
            </span>
          } 
          key="dangKy"
        >
          <h1 style={{ color: '#1890ff', fontWeight: 'bold', marginBottom: 24 }}>
            Đăng ký xét tuyển
          </h1>
          <XetTuyenForm onSubmitSuccess={handleSubmitSuccess} />
        </TabPane>
      </Tabs>
    </RootLayout>
  );
};

export default XetTuyen;

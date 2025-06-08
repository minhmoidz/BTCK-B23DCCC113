import React from 'react';
import { Button, Menu } from 'antd';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'TRANG CHỦ', key: 'home', link: '/' },
  {
    label: 'HƯỚNG DẪN', key: 'guide',
    children: [
      { label: 'Quy chế thi', key: 'guide1' },
      { label: 'Đề án thi', key: 'guide2' },
      { label: 'Dạng thức bài thi', key: 'guide3' },
      { label: 'Thỏa thuận', key: 'guide4' },
      { label: 'Đăng ký thi', key: 'guide5' },
      { label: 'Nộp lệ phí', key: 'guide6' },
      { label: 'Cẩm nang HSA', key: 'guide7' },
    ]
  },
  {
    label: 'KỲ THI', key: 'exam',
    children: [
      { label: 'ĐGNL - HSA', key: 'exam1' },
      { label: 'Sức khỏe - MSA', key: 'exam2' },
      { label: 'Sau đại học', key: 'exam3' },
    ]
  },
  {
    label: 'LỊCH THI', key: 'lichthi',
    children: [
      { label: 'Lịch thi ĐGNL', key: 'lichthi1' },
      { label: 'Lịch thi Sức khỏe', key: 'lichthi2' },
    ]
  },
  {
    label: 'TRA CỨU', key: 'tracuu',
    children: [
      { label: 'Tra cứu điểm', key: 'tracuu1' },
      { label: 'Tra cứu hồ sơ', key: 'tracuu2' },
    ]
  },
  {
    label: 'DIỄN ĐÀN', key: 'forum',
    children: [
      { label: 'Chia sẻ kinh nghiệm', key: 'forum1' },
      { label: 'Hỏi đáp', key: 'forum2' },
    ]
  },
];

const Navbar: React.FC = () => {
  // Xử lý click submenu: chỉ alert text tượng trưng
  const handleMenuClick = (e: any) => {
    if (e.keyPath.length > 1) {
      alert(`Bạn vừa chọn: ${e.item.props.children || e.key}`);
    }
  };

  return (
    <nav
      style={{
        width: '100%',
        background: '#4da3ff',
        padding: '0 24px 0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        margin: 0,
        border: 'none',
        boxSizing: 'border-box'
      }}
    >
      {/* Logo bên trái */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 44, width: 44, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 2 }} />
      </div>
      {/* Menu giữa */}
      <Menu
        mode="horizontal"
        style={{ background: 'transparent', borderBottom: 'none', flex: 1, justifyContent: 'center', fontWeight: 600, fontSize: 16 }}
        defaultSelectedKeys={['home']}
        items={menuItems.map(item => {
          if (item.children) {
            return {
              key: item.key,
              label: item.label,
              children: item.children.map(sub => ({
                key: sub.key,
                label: <span style={{ color: '#4da3ff', fontWeight: 600 }}>{sub.label}</span>
              }))
            };
          }
          return {
            key: item.key,
            label: <Link to={item.link} style={{ color: '#fff' }}>{item.label}</Link>
          };
        })}
        onClick={handleMenuClick}
      />
      {/* Nút đăng nhập bên phải */}
      <div style={{ display: 'flex', gap: 12, marginRight: 8 }}>
        <Link to="/login">
          <Button style={{ background: '#fff', color: '#4da3ff', fontWeight: 600, borderRadius: 8, border: 'none' }}>Đăng nhập</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 
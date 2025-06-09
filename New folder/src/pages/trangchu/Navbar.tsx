import React from 'react';
import { Button, Menu } from 'antd';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'TRANG CHỦ', key: 'home', link: '/' },
  {
    label: 'HƯỚNG DẪN', key: 'guide',
    children: [
      { label: 'Quy chế & Hướng dẫn thi', key: 'guide1', link: '/huong-dan/quy-che-thi' },
      { label: 'Đăng ký dự thi & Xét tuyển', key: 'guide2', link: '/huong-dan/dang-ky' },
      { label: 'Hướng dẫn nộp lệ phí', key: 'guide3', link: '/huong-dan/le-phi' },
      { label: 'Hướng dẫn tra cứu kết quả', key: 'guide4', link: '/huong-dan/tra-cuu' },
      { label: 'Câu hỏi thường gặp', key: 'guide5', link: '/huong-dan/faq' },
      { label: 'Liên hệ hỗ trợ', key: 'guide6', link: '/huong-dan/lien-he' },
    ]
  },
  {
    label: 'KỲ THI', key: 'exam',
    children: [
      { label: 'Đánh giá năng lực (HSA)', key: 'exam1', link: '/ky-thi/hsa' },
      { label: 'Đánh giá tư duy (TSA)', key: 'exam2', link: '/ky-thi/tsa' },
      { label: 'Lịch sử & Ý nghĩa', key: 'exam3', link: '/ky-thi/lich-su' },
      { label: 'Đề thi mẫu & Đáp án', key: 'exam4', link: '/ky-thi/de-thi-mau' },
    ]
  },
  {
    label: 'LỊCH THI', key: 'lichthi',
    children: [
      { label: 'Lịch thi ĐGNL', key: 'lichthi1', link: '/lich-thi/dgnl' },
      { label: 'Lịch thi ĐGTD', key: 'lichthi2', link: '/lich-thi/dgtd' },
      { label: 'Thời hạn đăng ký & nộp lệ phí', key: 'lichthi3', link: '/lich-thi/thoi-han' },
    ]
  },
  {
    label: 'TRA CỨU', key: 'tracuu',
    children: [
      { label: 'Tra cứu điểm thi', key: 'tracuu1', link: '/tra-cuu/diem' },
      { label: 'Tra cứu hồ sơ xét tuyển', key: 'tracuu2', link: '/tra-cuu/ho-so' },
      { label: 'Tra cứu lịch sử đăng ký', key: 'tracuu3', link: '/tra-cuu/lich-su' },
      { label: 'Tra cứu thông báo cá nhân', key: 'tracuu4', link: '/tra-cuu/thong-bao' },
    ]
  },
  {
    label: 'DIỄN ĐÀN', key: 'forum',
    children: [
      { label: 'Chia sẻ kinh nghiệm ôn thi', key: 'forum1', link: '/dien-dan/kinh-nghiem' },
      { label: 'Hỏi đáp về kỳ thi & xét tuyển', key: 'forum2', link: '/dien-dan/hoi-dap' },
      { label: 'Góc phụ huynh & giáo viên', key: 'forum3', link: '/dien-dan/phu-huynh' },
      { label: 'Tin tức tuyển sinh', key: 'forum4', link: '/dien-dan/tin-tuc' },
    ]
  },
];

const Navbar: React.FC = () => {
  // Xử lý click submenu: chỉ alert text tượng trưng
  const handleMenuClick = (e: any) => {
    // Không cần xử lý gì đặc biệt nếu đã có link
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
              children: item.children.map(sub => {
                const labelContent = <span style={{ color: sub.link ? '#1677ff' : '#4da3ff', fontWeight: 600 }}>{sub.label}</span>;
                if (sub.link) {
                  return {
                    key: sub.key,
                    label: <Link to={sub.link}>{labelContent}</Link>
                  };
                }
                return {
                  key: sub.key,
                  label: labelContent
                };
              })
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
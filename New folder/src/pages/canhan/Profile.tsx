import React from 'react';

interface ProfileProps {
  username: string;
}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: 20 }}>
      <h1>Trang cá nhân của {username}</h1>
      <p>Ở đây bạn có thể hiển thị thông tin cá nhân, chỉnh sửa hồ sơ, v.v.</p>
    </div>
  );
};

export default Profile;

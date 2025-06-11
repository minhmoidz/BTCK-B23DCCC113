import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Result } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AdmissionInfo from '../dashboard/AdmissionInfo';
import RootLayout from '../../component/dunglai/RootLayout';

interface SchoolAdmissionInfoProps {
  username: string;
  onLogout: () => void;
}

const SchoolAdmissionInfo: React.FC<SchoolAdmissionInfoProps> = ({ username, onLogout }) => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      if (!schoolId) return;

      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/schools/${schoolId}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy thông tin trường');
        }
        const data = await response.json();
        setSchoolName(data.tenTruong);
      } catch (error) {
        console.error('Failed to fetch school info:', error);
        setError('Không thể tải thông tin trường. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolInfo();
  }, [schoolId]);

  if (error) {
    return (
      <RootLayout username={username} onLogout={onLogout}>
        <Result
          status="error"
          title="Có lỗi xảy ra"
          subTitle={error}
          extra={[
            <Button type="primary" onClick={() => navigate('/dashboard')} icon={<ArrowLeftOutlined />}>
              Quay lại trang chủ
            </Button>
          ]}
        />
      </RootLayout>
    );
  }

  return (
    <RootLayout username={username} onLogout={onLogout}>
      <div style={{ padding: '24px' }}>
        <Button 
          type="link" 
          onClick={() => navigate('/dashboard')}
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: 16, padding: 0 }}
        >
          Quay lại trang chủ
        </Button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <AdmissionInfo schoolId={schoolId} />
        )}
      </div>
    </RootLayout>
  );
};

export default SchoolAdmissionInfo; 
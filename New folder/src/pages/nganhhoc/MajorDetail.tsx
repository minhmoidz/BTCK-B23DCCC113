import React from 'react';
import { useParams } from 'react-router-dom';
import RootLayout from '../../component/dunglai/RootLayout';
import { Typography } from 'antd';
import { hotMajors, newMajors } from '../nganhhoc/majorsData';

const { Title, Paragraph } = Typography;

const allMajors = [...hotMajors, ...newMajors];

const MajorDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const major = allMajors.find(m => m.slug === slug);

  return (
    <RootLayout username="..." onLogout={() => {}}>
      {major ? (
        <>
          <Title level={2}>{major.name}</Title>
          <Paragraph>
            Thông tin chi tiết về <b>{major.name}</b> sẽ được hiển thị ở đây.
          </Paragraph>
        </>
      ) : (
        <Title level={3}>Không tìm thấy ngành!</Title>
      )}
    </RootLayout>
  );
};

export default MajorDetail;

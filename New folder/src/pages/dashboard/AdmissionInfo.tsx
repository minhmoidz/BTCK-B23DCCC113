import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, List, Divider, Table, Tag, Spin, Button, Space, Select, Tooltip, message } from 'antd';
import { BookOutlined, CheckCircleOutlined, GlobalOutlined, DollarOutlined, TableOutlined, RobotOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MajorTable from './MajorTable';
import BenchmarkTable from './BenchmarkTable';
import { useNavigate } from 'react-router-dom';
import RootLayout from '../../component/dunglai/RootLayout';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface AdmissionInfoProps {
  schoolId?: string;
  username?: string;
  onLogout?: () => void;
}

const AdmissionInfo: React.FC<AdmissionInfoProps> = ({ schoolId, username , onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [majors, setMajors] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [schoolInfo, setSchoolInfo] = useState<{ tenTruong: string } | null>(null);
 

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!schoolId) return;
      
      setLoading(true);
      try {
        // TODO: Replace with actual API calls
        const response = await fetch(`/api/schools/${schoolId}`);
        const data = await response.json();
        setSchoolInfo(data);
        setMajors(data.majors || []);
        setBenchmarks(data.benchmarks || []);
      } catch (error) {
        console.error('Failed to fetch school data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [schoolId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    message.success('Đăng xuất thành công');
    navigate('/');
  };

  // Data for admission methods
  const admissionMethods = [
    {
      key: '1',
      name: 'Xét tuyển tài năng',
      description: 'Xét tuyển thẳng và ưu tiên xét tuyển cho thí sinh đoạt giải Quốc gia, Quốc tế'
    },
    {
      key: '2',
      name: 'Xét tuyển dựa vào kết quả Chứng chỉ đánh giá năng lực quốc tế',
      description: 'Chứng chỉ SAT từ 1130/1600 hoặc ACT từ 25/36 trở lên'
    },
    {
      key: '3',
      name: 'Xét tuyển dựa vào kết quả bài thi đánh giá năng lực (ĐGNL)',
      description: 'Kết quả từ các kỳ thi ĐGNL của ĐHQG HN, ĐHQG HCM, ĐH Bách Khoa HN, ĐH Sư phạm HN'
    },
    {
      key: '4',
      name: 'Xét tuyển kết hợp với chứng chỉ tiếng Anh quốc tế',
      description: 'IELTS 5.5+, TOEFL iBT 65+, hoặc TOEFL ITP 513+ và học lực Khá trở lên'
    },
    {
      key: '5',
      name: 'Xét tuyển dựa vào kết quả thi tốt nghiệp THPT',
      description: 'Theo tổ hợp xét tuyển tương ứng các ngành'
    }
  ];

  // Data for tuition fees
  const tuitionData = [
    {
      type: 'Chương trình đại trà',
      range: '29,6 - 37,6 triệu đồng/năm'
    },
    {
      type: 'Chương trình chất lượng cao',
      range: '49,2 - 55 triệu đồng/năm'
    },
    {
      type: 'Chương trình đặc thù (CNTT, Game, Việt-Nhật, AI)',
      range: '40 - 45,5 triệu đồng/năm'
    },
    {
      type: 'Chương trình liên kết quốc tế',
      range: '54 - 62,5 triệu đồng/năm'
    }
  ];

  return (
    <RootLayout username={username || ''} onLogout={handleLogout}>
      {/* Header Section */}
      <div 
        style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: '40px 48px',
          marginBottom: 40,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          color: '#222',
          textAlign: 'center',
        }}
      >

        <Title level={1} style={{ fontWeight: 700, marginBottom: 1, color: '#1890ff' }}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              {schoolInfo?.tenTruong || 'Thông Tin Tuyển Sinh'} 
              {schoolId && <Text type="secondary" style={{ fontSize: 16, marginLeft: 8 }}>({schoolId})</Text>}
            </>
          )}
        </Title>
        
        
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 24px' }}>
        {/* General Information Section */}
        <Card title="I. Thông Tin Chung" style={{ marginBottom: 24 }}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={4}>
                <BookOutlined /> 1. Thời Gian Xét Tuyển
              </Title>
              <Paragraph>
                Theo lịch tuyển sinh chung của Bộ GD&ĐT và kế hoạch tuyển sinh của trường công bố cụ thể trên website.
              </Paragraph>
            </Col>

            <Col span={24}>
              <Title level={4}>
                <CheckCircleOutlined /> 2. Đối Tượng Xét Tuyển
              </Title>
              <List
                dataSource={[
                  'Tốt nghiệp THPT (giáo dục chính quy hoặc giáo dục thường xuyên)',
                  'Tốt nghiệp trình độ trung cấp (có bằng tốt nghiệp THPT)',
                  'Tốt nghiệp THPT ở nước ngoài',
                  'Có đủ sức khỏe để học tập theo quy định',
                  'Đáp ứng các điều kiện xét tuyển của Bộ GD&ĐT'
                ]}
                renderItem={item => (
                  <List.Item>
                    <Text>• {item}</Text>
                  </List.Item>
                )}
              />
            </Col>

            <Col span={24}>
              <Title level={4}>
                <GlobalOutlined /> 3. Phạm Vi Tuyển Sinh
              </Title>
              <Paragraph>
                <Tag color="blue">Tuyển sinh trong cả nước và quốc tế</Tag>
              </Paragraph>
            </Col>
          </Row>
        </Card>
                  {/* Admission Methods Section */}
        <Card title="IV. Phương Thức Xét Tuyển" style={{ marginBottom: 24 }}>
          <List
            itemLayout="vertical"
            dataSource={[
              {
                key: '1',
                name: 'Xét tuyển thẳng',
                description: 'Dành cho thí sinh đạt giải trong các kỳ thi học sinh giỏi Quốc gia, Quốc tế'
              },
              {
                key: '2',
                name: 'Xét tuyển bằng chứng chỉ quốc tế',
                description: 'Chứng chỉ SAT từ 1130/1600 hoặc ACT từ 25/36 trở lên'
              },
              {
                key: '3',
                name: 'Xét tuyển bằng điểm thi đánh giá năng lực',
                description: 'Sử dụng kết quả thi ĐGNL của ĐHQG HN, ĐHQG HCM, ĐH Bách Khoa HN, ĐH Sư phạm HN'
              },
              {
                key: '4',
                name: 'Xét tuyển kết hợp chứng chỉ ngoại ngữ',
                description: 'IELTS 5.5+, TOEFL iBT 65+, hoặc TOEFL ITP 513+ và học lực Khá trở lên'
              },
              {
                key: '5',
                name: 'Xét tuyển bằng điểm thi THPT',
                description: 'Theo tổ hợp môn xét tuyển tương ứng của từng ngành'
              }
            ]}
            renderItem={(item, index) => (
              <List.Item>
                <Title level={5}>Phương thức {index + 1}: {item.name}</Title>
                <Text>{item.description}</Text>
              </List.Item>
            )}
          />
        </Card>

        {/* Tuition Fees Section */}
        <Card title={<><DollarOutlined /> V. Học Phí Năm Học 2025-2026</>}>
          <Table
            dataSource={[
              {
                type: 'Chương trình đại trà',
                range: '29,6 - 37,6 triệu đồng/năm'
              },
              {
                type: 'Chương trình chất lượng cao',
                range: '49,2 - 55 triệu đồng/năm'
              },
              {
                type: 'Chương trình đặc thù (CNTT, Game, Việt-Nhật, AI)',
                range: '40 - 45,5 triệu đồng/năm'
              },
              {
                type: 'Chương trình liên kết quốc tế',
                range: '54 - 62,5 triệu đồng/năm'
              }
            ]}
            pagination={false}
            columns={[
              {
                title: 'Loại Chương Trình',
                dataIndex: 'type',
                key: 'type',
                width: '60%'
              },
              {
                title: 'Mức Học Phí',
                dataIndex: 'range',
                key: 'range',
                render: (text) => <Tag color="green">{text}</Tag>
              }
            ]}
          />
        </Card>
        {/* Major Information Section */}
        <Card 
          title={
            <Title level={4} style={{ margin: 0 }}>
              <TableOutlined /> II. Danh Sách Ngành Đào Tạo
            </Title>
          } 
          style={{ marginBottom: 24 }}
        >
          <Spin spinning={loading}>
            <MajorTable majors={majors} />
          </Spin>
        </Card>

        {/* Benchmark History Section */}
        <Card 
          title={
            <Title level={4} style={{ margin: 0 }}>
              <TableOutlined /> III. Điểm Chuẩn Các Năm Trước
            </Title>
          } 
          style={{ marginBottom: 24 }}
        >
          <Spin spinning={loading}>
            <BenchmarkTable benchmarks={benchmarks} />
          </Spin>
        </Card>

      
      </div>

      {/* Chatbot Button */}
      <Tooltip title="Tư vấn tuyển sinh trực tuyến">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<RobotOutlined />}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 64,
            height: 64,
            fontSize: 28,
            boxShadow: '0 6px 20px rgba(24, 144, 255, 0.4)',
            zIndex: 1100,
          }}
          onClick={() => navigate('/chat')}
        />
      </Tooltip>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          marginTop: 80,
          padding: '24px 0',
          borderTop: '1px solid #e8e8e8',
          color: '#888',
        }}
      >
        <Text>© 2024 Hệ thống xét tuyển trực tuyến (PTIT). Bản quyền thuộc về Học viện Công nghệ Bưu chính Viễn thông.</Text>
      </footer>
    </RootLayout>
  );

 
};

export default AdmissionInfo; 
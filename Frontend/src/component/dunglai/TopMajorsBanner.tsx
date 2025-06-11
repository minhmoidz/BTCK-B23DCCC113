import React from 'react';
import { Row, Col, Card, Typography, Tag, Space } from 'antd';
import { FireOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { hotMajors, newMajors } from '../../pages/nganhhoc/majorsData';

const { Title, Text } = Typography;

const TopMajorsBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Row gutter={[32, 32]} justify="center" style={{ marginTop: 32 }}>
      {/* Banner HOT */}
      <Col xs={24} md={12}>
        <Card
          style={{
            borderRadius: 18,
            boxShadow: '0 6px 20px rgba(224, 224, 224, 0.7)',
            background: 'linear-gradient(90deg, #fff 70%, #ffefef 100%)',
            minHeight: 240,
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <FireOutlined style={{ fontSize: 48, color: '#e53935', marginRight: 12 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Title level={4} style={{ margin: 0, color: '#b71c1c' }}>
                  Ngành <span style={{ fontWeight: 'bold' }}>HOT</span> nhất
                </Title>
                <Tag color="#b71c1c" style={{ fontWeight: 600, fontSize: 14, borderRadius: 8, padding: '4px 12px' }}>
                  HOT
                </Tag>
              </div>
              <Text style={{ color: '#555', fontSize: 15, marginTop: 8 }}>
                Danh sách các ngành được nhiều thí sinh quan tâm và đăng ký nhiều nhất trong các năm gần đây.
              </Text>
              <Space direction="vertical" size={12} style={{ marginTop: 24, width: '100%' }}>
                {hotMajors.map((major, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    hoverable
                    style={{
                      borderRadius: 10,
                      background: '#fff',
                      boxShadow: '0 2px 10px rgba(255, 200, 200, 0.5)',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 20px',
                    }}
                    onClick={() => navigate(`/major/${major.slug}`)}
                  >
                    <Tag color="#b71c1c" style={{ marginRight: 12, fontWeight: 600 }}>
                      {major.tag}
                    </Tag>
                    <Text strong style={{ color: '#b71c1c', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {major.name}
                    </Text>
                  </Card>
                ))}
              </Space>
            </div>
          </div>
        </Card>
      </Col>

      {/* Banner NEW */}
      <Col xs={24} md={12}>
        <Card
          style={{
            borderRadius: 18,
            boxShadow: '0 6px 20px rgba(224, 224, 224, 0.7)',
            background: 'linear-gradient(90deg, #f9fff9 70%, #e6f4e6 100%)',
            minHeight: 240,
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <StarOutlined style={{ fontSize: 48, color: '#388e3c', marginRight: 12 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Title level={4} style={{ margin: 0, color: '#2e7d32' }}>
                  Ngành <span style={{ fontWeight: 'bold' }}>MỚI</span> nhất
                </Title>
                <Tag color="#2e7d32" style={{ fontWeight: 600, fontSize: 14, borderRadius: 8, padding: '4px 12px' }}>
                  NEW
                </Tag>
              </div>
              <Text style={{ color: '#555', fontSize: 15, marginTop: 8 }}>
                Các ngành học mới được bổ sung, cập nhật phù hợp với xu hướng phát triển và nhu cầu xã hội.
              </Text>
              <Space direction="vertical" size={12} style={{ marginTop: 24, width: '100%' }}>
                {newMajors.map((major, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    hoverable
                    style={{
                      borderRadius: 10,
                      background: '#fff',
                      boxShadow: '0 2px 10px rgba(200, 255, 200, 0.5)',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 20px',
                    }}
                    onClick={() => navigate(`/major/${major.slug}`)}
                  >
                    <Tag color="#2e7d32" style={{ marginRight: 12, fontWeight: 600 }}>
                      {major.tag}
                    </Tag>
                    <Text strong style={{ color: '#2e7d32', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {major.name}
                    </Text>
                  </Card>
                ))}
              </Space>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default TopMajorsBanner;

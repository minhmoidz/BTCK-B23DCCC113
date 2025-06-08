import React, { useState } from 'react';
import { Card, Button, Spin, Typography, Alert, Tag, Space } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const ApiTestCard = ({ title, endpoint, method = 'GET', data = null, onSuccess, buttonText = 'Test API' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const API_URL = 'http://localhost:3000/api';
  const ADMIN_TOKEN = 'admin-token';

  const callApi = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        method,
        url: `${API_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.data = data;
      }

      const response = await axios(config);
      setResult(response.data);
      setHasRun(true);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error(`Error calling ${endpoint}:`, err);
      setError(err.message);
      setHasRun(true);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!hasRun) return null;
    
    const hasError = !!error;
    const statusColor = hasError ? '#fff2f0' : '#f6ffed';
    const borderColor = hasError ? '#ffccc7' : '#b7eb8f';
    
    return (
      <div style={{ marginTop: '15px' }}>
        <Space style={{ marginBottom: '10px' }}>
          <Text strong>Status:</Text>
          {hasError ? 
            <Tag color="error">Lỗi</Tag> : 
            <Tag color="success">Thành công</Tag>
          }
        </Space>
        
        {hasError ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <div style={{ 
            backgroundColor: statusColor,
            padding: '10px',
            borderRadius: '5px',
            border: `1px solid ${borderColor}`,
            overflow: 'auto'
          }}>
            <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card 
      title={
        <Space>
          <Text strong>{title}</Text>
          <Text type="secondary">({method} {endpoint})</Text>
        </Space>
      }
      style={{ marginBottom: '16px' }}
    >
      {data && (
        <div style={{ marginBottom: '15px' }}>
          <Text strong>Request Data:</Text>
          <div style={{ 
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '5px'
          }}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
      
      <Button 
        type="primary" 
        onClick={callApi} 
        loading={loading}
      >
        {buttonText}
      </Button>
      
      {renderResult()}
    </Card>
  );
};

export default ApiTestCard;

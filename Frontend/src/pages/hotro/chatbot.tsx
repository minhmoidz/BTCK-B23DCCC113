import React, { useState, useRef, useEffect } from 'react';
import { Layout, Typography, Input, Button, Avatar, List, Divider, Card, Space } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{
    content: string;
    type: 'user' | 'bot';
    timestamp: string;
  }[]>([
    {
      content: 'Xin chào! Tôi là trợ lý ảo của PTIT. Tôi có thể giúp gì cho bạn về quá trình xét tuyển, nhập học hoặc thanh toán?',
      type: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Thêm tin nhắn người dùng vào lịch sử
    const userMessage = {
      content: message,
      type: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    
    // Giả lập phản hồi từ bot sau 1 giây
    setTimeout(() => {
      // Logic đơn giản để trả lời dựa trên từ khóa
      let botResponse = '';
      const lowercaseMsg = message.toLowerCase();
      
      if (lowercaseMsg.includes('xét tuyển') || lowercaseMsg.includes('đăng ký')) {
        botResponse = 'Để xét tuyển vào PTIT, bạn cần chuẩn bị hồ sơ gồm học bạ, bằng tốt nghiệp hoặc giấy chứng nhận tốt nghiệp tạm thời, và các giấy tờ ưu tiên (nếu có). Bạn có thể đăng ký xét tuyển trực tuyến tại mục "Xét tuyển trực tuyến" trên Dashboard.';
      } else if (lowercaseMsg.includes('nhập học')) {
        botResponse = 'Sau khi trúng tuyển, bạn cần hoàn thành thủ tục nhập học trong thời hạn quy định. Vui lòng truy cập mục "Nhập học trực tuyến" trên Dashboard để biết chi tiết về quy trình và những giấy tờ cần thiết.';
      } else if (lowercaseMsg.includes('học phí') || lowercaseMsg.includes('thanh toán')) {
        botResponse = 'Học phí có thể được thanh toán trực tuyến qua cổng thanh toán của trường hoặc chuyển khoản ngân hàng. Để thanh toán trực tuyến, vui lòng truy cập mục "Thanh toán trực tuyến" trên Dashboard.';
      } else if (lowercaseMsg.includes('ngành') || lowercaseMsg.includes('chuyên ngành')) {
        botResponse = 'PTIT có nhiều ngành học hấp dẫn như Công nghệ thông tin, Điện tử viễn thông, An toàn thông tin, Quản trị kinh doanh, Marketing,... Mỗi ngành có các yêu cầu đầu vào và cơ hội nghề nghiệp khác nhau. Bạn có thể tìm hiểu thêm về các ngành học tại mục "Ngành học nổi bật" trên Dashboard.';
      } else if (lowercaseMsg.includes('điểm chuẩn') || lowercaseMsg.includes('điểm')) {
        botResponse = 'Điểm chuẩn của các ngành tại PTIT sẽ được công bố sau khi kết thúc đợt xét tuyển. Bạn có thể theo dõi thông báo mới nhất trên website của trường hoặc trong mục "Thông báo mới" trên Dashboard.';
      } else {
        botResponse = 'Cảm ơn bạn đã liên hệ. Nếu bạn cần hỗ trợ về quy trình xét tuyển, nhập học hoặc thanh toán, vui lòng cho tôi biết chi tiết hơn để tôi có thể giúp đỡ tốt hơn.';
      }
      
      // Thêm phản hồi bot vào lịch sử
      const botMessage = {
        content: botResponse,
        type: 'bot' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, botMessage]);
    }, 1000);
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionQuestions = [
    'Điểm chuẩn các ngành học năm nay là bao nhiêu?',
    'Làm thế nào để xét tuyển vào PTIT?',
    'Quy trình nhập học như thế nào?',
    'Cách thanh toán học phí?'
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ 
        background: '#f5222d', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RobotOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>Trợ lý ảo PTIT</Title>
        </div>
        <div>
          <Button 
            type="text" 
            icon={<HomeOutlined />} 
            style={{ color: 'white', marginRight: 8 }}
            onClick={() => navigate('/')}
          >
            Trang chủ
          </Button>
          <Button 
            type="text" 
            icon={<InfoCircleOutlined />} 
            style={{ color: 'white' }}
            onClick={() => navigate('/')}
          >
            Hỗ trợ
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '84px 24px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Card
          style={{ 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            height: 'calc(100vh - 108px)',
            display: 'flex',
            flexDirection: 'column'
          }}
          bodyStyle={{ 
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {/* Phần danh sách tin nhắn */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto',
              padding: '20px 24px',
              background: '#f9f9f9',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={chatHistory}
              renderItem={item => (
                <List.Item style={{ 
                  padding: '8px 0',
                  display: 'flex',
                  justifyContent: item.type === 'user' ? 'flex-end' : 'flex-start' 
                }}>
                  <div style={{ 
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: item.type === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start'
                  }}>
                    {item.type === 'bot' && (
                      <Avatar 
                        icon={<RobotOutlined />} 
                        style={{ 
                          backgroundColor: '#f5222d',
                          marginRight: 12,
                          marginTop: 4
                        }} 
                      />
                    )}
                    {item.type === 'user' && (
                      <Avatar 
                        icon={<UserOutlined />} 
                        style={{ 
                          backgroundColor: '#1890ff',
                          marginLeft: 12,
                          marginTop: 4
                        }} 
                      />
                    )}
                    <div>
                      <div style={{ 
                        background: item.type === 'user' ? '#1890ff' : 'white',
                        color: item.type === 'user' ? 'white' : 'rgba(0, 0, 0, 0.85)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        marginBottom: 4
                      }}>
                        <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {item.content}
                        </Paragraph>
                      </div>
                      <div style={{ 
                        textAlign: item.type === 'user' ? 'right' : 'left',
                        padding: '0 4px'
                      }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.timestamp}
                        </Text>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div ref={chatEndRef} />
          </div>

          {/* Gợi ý câu hỏi */}
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0' }}>
            <Text type="secondary" style={{ fontSize: 13 }}>Gợi ý câu hỏi:</Text>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, paddingTop: 4 }}>
              {suggestionQuestions.map((question, index) => (
                <Button
                  key={index}
                  type="default"
                  size="small"
                  style={{ 
                    borderRadius: 16,
                    fontSize: 12,
                    border: '1px solid #d9d9d9',
                    whiteSpace: 'nowrap',
                    background: '#f9f9f9'
                  }}
                  onClick={() => {
                    setMessage(question);
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Phần nhập tin nhắn */}
          <div style={{ 
            padding: '16px 24px', 
            borderTop: '1px solid #f0f0f0',
            background: 'white',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12
          }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <TextArea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ 
                  borderRadius: 24,
                  padding: '8px 16px',
                  resize: 'none',
                  fontSize: 15
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                style={{ 
                  background: '#f5222d',
                  border: 'none',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                disabled={!message.trim()}
              />
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ChatPage;
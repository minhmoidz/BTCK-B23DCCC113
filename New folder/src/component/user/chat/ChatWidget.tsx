import React, { useState, useRef, useEffect } from 'react';
import { FloatButton, Modal, Input, List, Avatar, Tag } from 'antd';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';
import { useChat, MessageType } from './useChat';


const { Search } = Input;

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isConnected } = useChat();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống tin nhắn cuối cùng
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (text.trim()) {
      sendMessage(text);
    }
  };

  const renderMessage = (item: MessageType) => {
    const isUser = item.type === 'message';
    const alignStyle = isUser ? 'flex-end' : 'flex-start';
    const bubbleColor = isUser ? '#1890ff' : '#f0f0f0';
    const textColor = isUser ? 'white' : 'black';

    if (item.type === 'systemMessage') {
      return (
        <List.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <Tag>{item.text}</Tag>
        </List.Item>
      );
    }

    return (
      <List.Item style={{ border: 'none', padding: '5px 0', display: 'flex', justifyContent: alignStyle }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', maxWidth: '70%' }}>
          {!isUser && <Avatar style={{ marginRight: 8 }}>A</Avatar>}
          <div style={{ backgroundColor: bubbleColor, color: textColor, padding: '8px 12px', borderRadius: '18px' }}>
            {item.text}
          </div>
        </div>
      </List.Item>
    );
  };

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setIsOpen(true)}
        tooltip="Chat với Admin"
      />
      <Modal
        title="Hỗ trợ trực tuyến"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null} // Bỏ footer mặc định
        bodyStyle={{ padding: 0 }} // Bỏ padding body mặc định
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
          <div style={{ padding: '0 16px', color: '#888', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <p>Trạng thái: {isConnected ? <Tag color="green">Đã kết nối</Tag> : <Tag color="red">Đã ngắt kết nối</Tag>}</p>
          </div>
          <List
            dataSource={messages}
            renderItem={renderMessage}
            style={{ flex: 1, overflowY: 'auto', padding: '16px' }}
          >
             <div ref={messageEndRef} />
          </List>
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0' }}>
            <Search
              placeholder="Nhập tin nhắn..."
              enterButton={<SendOutlined />}
              size="large"
              onSearch={handleSend}
              disabled={!isConnected}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatWidget;
import React, { useState, useEffect, useRef } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Badge, Spin, Empty, Tag } from 'antd';
import { SendOutlined, WechatOutlined } from '@ant-design/icons';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// --- CÁC HẰNG SỐ VÀ KIỂU DỮ LIỆU ---
const API_BASE_URL = 'http://localhost:5000/api';
const WEBSOCKET_URL = "http://localhost:5000/chat";

interface RoomInfo {
  roomId: string;
  sender?: string; // Thêm sender để hiển thị tên
  clientCount: number;
  adminCount: number;
  messageCount: number;
  lastActivity: string | null;
}

interface Message {
  type: 'message' | 'adminMessage' | 'systemMessage';
  sender: string;
  text: string;
  timestamp: string;
  roomId: string;
}

// --- COMPONENT DANH SÁCH PHÒNG CHAT ---
const RoomList: React.FC<{
  onSelectRoom: (roomId: string) => void;
  selectedRoomId?: string;
}> = ({ onSelectRoom, selectedRoomId }) => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Thay vì chỉ lấy rooms, chúng ta lấy chi tiết từng room để có 'sender'
        const roomsResponse = await axios.get<RoomInfo[]>(`${API_BASE_URL}/rooms`);
        const detailedRoomsPromises = roomsResponse.data.map(room => 
          axios.get<RoomInfo>(`${API_BASE_URL}/room/${room.roomId}`).then(res => res.data)
        );
        const detailedRooms = await Promise.all(detailedRoomsPromises);
        setRooms(detailedRooms);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    const intervalId = setInterval(fetchRooms, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDateSafely = (dateString: string | null) => {
    if (dateString && !isNaN(new Date(dateString).getTime())) {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    }
    return 'chưa có hoạt động';
  };

  return (
    <Spin spinning={loading}>
      {rooms.length === 0 && !loading ? (
        <Empty description="Không có phòng chat nào" style={{marginTop: 60}}/>
      ) : (
        <List
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item
              onClick={() => onSelectRoom(room.roomId)}
              style={{
                cursor: 'pointer',
                padding: '12px 24px',
                backgroundColor: selectedRoomId === room.roomId ? '#e6f7ff' : 'transparent',
              }}
            >
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#1890ff' }} icon={<WechatOutlined />} />}
                title={<Text strong>{room.sender || room.roomId}</Text>}
                description={`Cập nhật ${formatDateSafely(room.lastActivity)}`}
              />
            </List.Item>
          )}
        />
      )}
    </Spin>
  );
};


// --- COMPONENT CỬA SỔ CHAT ---
const ChatWindow: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null); // Ref để lưu kết nối WebSocket bền vững
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    setMessages([]);

    const fetchMessageHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/messages/${roomId}`);
        setMessages(response.data);
      } catch (error) {
        console.error(`Lỗi khi tải tin nhắn cho phòng ${roomId}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessageHistory();

    // Thiết lập kết nối WebSocket bền vững
    const socket = new WebSocket(WEBSOCKET_URL);
    ws.current = socket; // Lưu kết nối vào ref

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ type: 'adminJoin', email: 'admin@system.com', roomId }));
    };

    socket.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.onclose = () => setIsConnected(false);
    socket.onerror = (error) => console.error('Lỗi WebSocket:', error);
    
    return () => {
      socket.close();
      ws.current = null; // Dọn dẹp ref
    };
  }, [roomId]);

  // =================================================================
  // === SỬA LỖI CHÍNH NẰM Ở ĐÂY ===
  // =================================================================
  const handleSendMessage = (text: string) => {
    // Sử dụng kết nối WebSocket bền vững đã được lưu trong ws.current
    if (text.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
      const messagePayload = {
        type: 'adminMessage',
        text: text,
      };
      
      // Gửi tin nhắn qua kết nối hiện tại
      ws.current.send(JSON.stringify(messagePayload));

      // Cập nhật UI ngay lập tức
      const adminReply: Message = {
        type: 'adminMessage',
        text: messagePayload.text,
        sender: 'Admin',
        timestamp: new Date().toISOString(),
        roomId: roomId
      };
      setMessages(prev => [...prev, adminReply]);
    } else {
      console.error("Không thể gửi tin nhắn. WebSocket không được kết nối.");
    }
  };

  const renderMessage = (item: Message) => {
    const isAdmin = item.type === 'adminMessage';
    const alignStyle = isAdmin ? 'flex-end' : 'flex-start';
    if (item.type === 'systemMessage') return <List.Item style={{justifyContent: 'center'}}><Tag>{item.text}</Tag></List.Item>;
    
    const timeString = item.timestamp && !isNaN(new Date(item.timestamp).getTime())
      ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: vi }) : '';

    return (
      <List.Item style={{ border: 'none', padding: '5px 0', display: 'flex', justifyContent: alignStyle }}>
        <div style={{ backgroundColor: isAdmin ? '#dcf8c6' : '#fff', padding: '8px 12px', borderRadius: '12px', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', maxWidth: '70%' }}>
          <Text strong>{isAdmin ? 'Bạn' : item.sender}</Text>
          <Paragraph style={{ marginBottom: 0 }}>{item.text}</Paragraph>
          <Text type="secondary" style={{ fontSize: '11px' }}>{timeString}</Text>
        </div>
      </List.Item>
    );
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
          <Title level={4} style={{ margin: 0 }}>Phòng: {roomId}</Title>
          <Tag color={isConnected ? 'green' : 'red'}>{isConnected ? 'Đã kết nối' : 'Đã ngắt kết nối'}</Tag>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#eceff1' }}>
          <Spin spinning={loading}>
            <List dataSource={messages} renderItem={renderMessage} />
            <div ref={messagesEndRef} />
          </Spin>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
          <Search
            placeholder="Nhập tin nhắn..."
            enterButton={<Button type="primary" icon={<SendOutlined />} />}
            size="large"
            onSearch={handleSendMessage}
            disabled={!isConnected}
          />
        </div>
      </Content>
    </Layout>
  );
};


// --- COMPONENT CHÍNH CỦA TRANG ADMIN ---
const Chat: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={350} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={3}>Hộp thư hỗ trợ</Title>
        </div>
        <RoomList onSelectRoom={setSelectedRoomId} selectedRoomId={selectedRoomId} />
      </Sider>
      <Layout>
        <Content>
          {selectedRoomId ? <ChatWindow roomId={selectedRoomId} /> : <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><Empty description="Vui lòng chọn một phòng chat" /></div>}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;
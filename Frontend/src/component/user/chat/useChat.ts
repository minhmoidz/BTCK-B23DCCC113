import { useState, useEffect, useRef } from 'react';

// Định nghĩa kiểu dữ liệu cho một tin nhắn
export interface MessageType {
  type: 'message' | 'adminMessage' | 'systemMessage' | 'history';
  sender: string;
  text: string;
  timestamp: string;
  roomId: string;
}

const WEBSOCKET_URL = "ws://localhost:5000/chat";

export const useChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  // Tạo một roomId duy nhất cho mỗi phiên chat và lưu nó
  const [roomId] = useState(() => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Chỉ kết nối nếu chưa có kết nối
    if (!ws.current) {
      const socket = new WebSocket(WEBSOCKET_URL);
      ws.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        // Gửi tin nhắn "join" để bắt đầu phiên chat
        const joinMessage = {
          type: "join",
          email: `guest-${roomId}`, // Có thể thay bằng email người dùng nếu đã đăng nhập
          roomId: roomId,
        };
        socket.send(JSON.stringify(joinMessage));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received:", data);

        switch (data.type) {
          case "history":
            setMessages(data.messages);
            break;
          case "message":
          case "adminMessage":
          case "systemMessage":
            setMessages((prevMessages) => [...prevMessages, data]);
            break;
          default:
            break;
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    // Hàm dọn dẹp: đóng kết nối khi component bị unmount
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [roomId]); // Chỉ chạy một lần khi component mount

  const sendMessage = (text: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const messagePayload = {
        type: "message",
        text,
        roomId,
      };
      ws.current.send(JSON.stringify(messagePayload));
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  return { messages, sendMessage, isConnected };
};
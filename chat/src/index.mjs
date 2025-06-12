import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors";
import http from "http";

const app = express();
const port = 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5173/mess"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
const server = http.createServer(app);

const wss = new WebSocketServer({
  server,
  path: "/chat",
  verifyClient: (info, done) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5173/mess",
    ];
    if (allowedOrigins.includes(info.origin)) {
      done(true);
    } else {
      done(false, 403, "Forbidden");
    }
  },
});

// Cấu trúc dữ liệu để quản lý phòng chat
const chatRooms = new Map(); // Lưu trữ thông tin về các phòng chat
const clientRooms = new Map(); // Map để theo dõi phòng chat của mỗi client
const adminClients = new Map(); // Map để lưu trữ admin websocket và phòng họ đang trong đó

// Hàm gửi tin nhắn đến tất cả người dùng trong một phòng cụ thể
const broadcastToRoom = (roomId, message, excludeWs = null) => {
  const room = chatRooms.get(roomId);
  if (room) {
    // Gửi cho users trong phòng
    room.clients.forEach((client) => {
      if (client.ws !== excludeWs && client.ws.readyState === 1) {
        client.ws.send(JSON.stringify(message));
      }
    });

    // Gửi cho admins đang theo dõi phòng này
    adminClients.forEach((adminRoom, adminWs) => {
      if (
        adminRoom === roomId &&
        adminWs !== excludeWs &&
        adminWs.readyState === 1
      ) {
        adminWs.send(JSON.stringify(message));
      }
    });
  }
};

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received message:", data);

      switch (data.type) {
        case "join":
          handleUserJoin(ws, data);
          break;
        case "adminJoin":
          handleAdminJoin(ws, data);
          break;
        case "message":
          handleMessage(ws, data);
          break;
        case "adminMessage":
          handleAdminMessage(ws, data);
          break;
        default:
          console.error("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    handleDisconnect(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

function handleUserJoin(ws, data) {
  const { email, roomId } = data;
  if (!roomId) {
    console.error("No roomId provided for user join");
    return;
  }

  console.log(`User ${email} joined room ${roomId}`);

  if (!chatRooms.has(roomId)) {
    chatRooms.set(roomId, {
      clients: new Set(),
      messages: [],
      sender: email, // Thêm thông tin người tạo phòng
      createdAt: new Date().toISOString(),
    });
  }

  const room = chatRooms.get(roomId);
  const clientInfo = { ws, email, isAdmin: false };
  room.clients.add(clientInfo);
  clientRooms.set(ws, roomId);

  // Gửi tin nhắn chào mừng
  const welcomeMessage = {
    type: "systemMessage",
    sender: "Anonymous",
    text: `Chào mừng ${email} đến với phòng chat ${roomId}! Hãy đặt câu hỏi cho đội ngũ chúng tôi.`,
    timestamp: new Date().toISOString(),
    roomId,
  };

  // Gửi lịch sử tin nhắn cho client mới
  ws.send(
    JSON.stringify({
      type: "history",
      messages: room.messages,
      roomId,
    })
  );

  broadcastToRoom(roomId, welcomeMessage);
}

function handleAdminJoin(ws, data) {
    const { email, roomId } = data;
    if (!roomId) {
      console.error("No roomId provided for admin join");
      return;
    }
  
    console.log(`Admin ${email} joined room ${roomId}`);
  
    // Cập nhật thông tin admin
    ws.isAdmin = true;
    adminClients.set(ws, roomId);
  
    // Tạo phòng nếu chưa tồn tại
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, {
        clients: new Set(),
        messages: [],
      });
    }
  
    const room = chatRooms.get(roomId);
  
    // Gửi lịch sử tin nhắn cho admin
    ws.send(
      JSON.stringify({
        type: "history",
        messages: room.messages,
        roomId,
      })
    );
  
    // Thông báo admin đã tham gia - chỉ gửi cho các client khác
    const adminJoinMessage = {
      type: "systemMessage",
      sender: "Anonymous",
      text: `Admin đã tham gia phòng chat`,
      timestamp: new Date().toISOString(),
      roomId,
    };
    
    // Gửi tin nhắn trực tiếp đến các client trong phòng, không qua broadcast
    room.clients.forEach((client) => {
      if (client.ws.readyState === 1) { // Kiểm tra kết nối còn active
        client.ws.send(JSON.stringify(adminJoinMessage));
      }
    });
  }

function handleMessage(ws, data) {
  const { text, roomId } = data;
  let targetRoomId = roomId;

  // Nếu không có roomId trong tin nhắn, lấy từ clientRooms
  if (!targetRoomId) {
    targetRoomId = clientRooms.get(ws);
    if (!targetRoomId) {
      console.error("No room found for this client");
      return;
    }
  }

  const room = chatRooms.get(targetRoomId);
  if (room) {
    // Tìm thông tin client trong phòng
    let clientInfo = null;
    room.clients.forEach((client) => {
      if (client.ws === ws) {
        clientInfo = client;
      }
    });

    // Nếu không tìm thấy client, thêm client vào phòng
    if (!clientInfo) {
      clientInfo = {
        ws,
        email: data.email || "Anonymous",
        isAdmin: false,
      };
      room.clients.add(clientInfo);
      clientRooms.set(ws, targetRoomId);
    }

    const newMessage = {
      type: "message",
      sender: clientInfo.email,
      text,
      timestamp: new Date().toISOString(),
      roomId: targetRoomId,
    };

    // Thêm tin nhắn vào lịch sử
    room.messages.push(newMessage);

    // Gửi tin nhắn cho người gửi
    ws.send(JSON.stringify(newMessage));

    // Broadcast tin nhắn cho những người khác trong phòng
    broadcastToRoom(targetRoomId, newMessage, ws);
  } else {
    console.error("Room not found:", targetRoomId);
  }
}

function handleAdminMessage(ws, data) {
  if (!ws.isAdmin) {
    console.error("Non-admin tried to send admin message");
    return;
  }

  const { text } = data;
  const roomId = adminClients.get(ws);

  if (!roomId) {
    console.error("No room found for this admin");
    return;
  }

  const adminMessage = {
    type: "adminMessage",
    sender: "Admin",
    text,
    timestamp: new Date().toISOString(),
    roomId,
  };

  const room = chatRooms.get(roomId);
  if (room) {
    room.messages.push(adminMessage);
    broadcastToRoom(roomId, adminMessage, ws); // Exclude sender
  }
}

function handleDisconnect(ws) {
  let disconnectRoomId;

  if (ws.isAdmin) {
    // Xử lý admin disconnect
    disconnectRoomId = adminClients.get(ws);
    adminClients.delete(ws);

    if (disconnectRoomId) {
      const disconnectMessage = {
        type: "systemMessage",
        sender: "System",
        text: "Admin đã rời phòng chat",
        timestamp: new Date().toISOString(),
        roomId: disconnectRoomId,
      };
      broadcastToRoom(disconnectRoomId, disconnectMessage);
    }
  } else {
    // Xử lý user disconnect
    disconnectRoomId = clientRooms.get(ws);
    if (disconnectRoomId) {
      const room = chatRooms.get(disconnectRoomId);
      if (room) {
        room.clients.forEach((client) => {
          if (client.ws === ws) {
            room.clients.delete(client);
          }
        });

        if (
          room.clients.size === 0 &&
          !Array.from(adminClients.values()).includes(disconnectRoomId)
        ) {
          setTimeout(() => {
            const currentRoom = chatRooms.get(disconnectRoomId);
            if (
              currentRoom &&
              currentRoom.clients.size === 0 &&
              !Array.from(adminClients.values()).includes(disconnectRoomId)
            ) {
              chatRooms.delete(disconnectRoomId);
              console.log(
                `Chat room ${disconnectRoomId} has been removed due to inactivity`
              );
            }
          }, 3600000); // Xóa sau 1 giờ không hoạt động
        }
      }
      clientRooms.delete(ws);
    }
  }

  if (disconnectRoomId) {
    console.log("Client disconnected from room:", disconnectRoomId);
  }
}

// API endpoints
app.get("/", (req, res) => {
  res.send("Chat server is running!");
});

// Endpoint để lấy danh sách các phòng chat đang hoạt động
app.get("/api/rooms", (req, res) => {
  const rooms = Array.from(chatRooms.entries()).map(([roomId, room]) => ({
    roomId,
    clientCount: room.clients.size,
    adminCount: Array.from(adminClients.values()).filter((r) => r === roomId)
      .length,
    messageCount: room.messages.length,
    lastActivity:
      room.messages.length > 0
        ? room.messages[room.messages.length - 1].timestamp
        : null,
  }));
  res.json(rooms);
});

// Endpoint để lấy thông tin về một phòng chat cụ thể
app.get("/api/room/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = chatRooms.get(roomId);

  if (room) {
    // Lấy thông tin người gửi từ client đầu tiên trong phòng nếu có
    let sender = room.sender;
    if (!sender && room.clients.size > 0) {
      const firstClient = Array.from(room.clients)[0];
      sender = firstClient.email;
    }

    const roomInfo = {
      roomId,
      sender: sender, // Thêm thông tin người gửi
      clientCount: room.clients.size,
      adminCount: Array.from(adminClients.values()).filter((r) => r === roomId)
        .length,
      messageCount: room.messages.length,
      lastActivity:
        room.messages.length > 0
          ? room.messages[room.messages.length - 1].timestamp
          : null,
      createdAt: room.createdAt,
    };
    res.json(roomInfo);
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});
// Endpoint để lấy tin nhắn của một phòng
app.get("/api/messages/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = chatRooms.get(roomId);

  if (room) {
    res.json(room.messages);
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

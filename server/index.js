const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 存储在线用户
const onlineUsers = new Map(); // socketId -> { address, username }
const userSockets = new Map(); // address -> socketId

// 存储消息历史（内存）
const messageHistory = [];
const MAX_HISTORY = 100;

// 存储频道
const channels = [
  { id: 1, name: '综合讨论', members: 0 },
  { id: 2, name: '技术分析', members: 0 },
  { id: 3, name: '项目动态', members: 0 }
];

// 健康检查
app.get('/', (req, res) => {
  res.json({ status: 'ok', online: onlineUsers.size });
});

// 获取在线用户
app.get('/api/online-users', (req, res) => {
  const users = [];
  onlineUsers.forEach((user, socketId) => {
    users.push({ ...user, socketId });
  });
  res.json(users);
});

// 获取消息历史
app.get('/api/messages', (req, res) => {
  res.json(messageHistory.slice(-MAX_HISTORY));
});

// Socket.io 连接处理
io.on('connection', (socket) => {
  console.log('🔗 新连接:', socket.id);

  // 用户注册/登录
  socket.on('register', (data) => {
    const { address, username } = data;
    
    // 保存用户信息
    onlineUsers.set(socket.id, {
      address,
      username: username || `用户${address.slice(0, 6)}`,
      connectedAt: Date.now()
    });
    userSockets.set(address, socket.id);
    
    // 广播用户上线
    io.emit('user-online', {
      address,
      username: username || `用户${address.slice(0, 6)}`,
      onlineCount: onlineUsers.size
    });
    
    // 发送历史消息给新用户
    socket.emit('message-history', messageHistory.slice(-50));
    
    console.log(`✅ 用户上线: ${address} (${onlineUsers.size}人在线)`);
  });

  // 发送消息
  socket.on('send-message', (data) => {
    const { address, username, content, channelId, type } = data;
    
    const message = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      address,
      username: username || `用户${address.slice(0, 6)}`,
      content,
      channelId: channelId || 1,
      type: type || 'text',
      timestamp: Date.now()
    };
    
    // 保存到历史
    messageHistory.push(message);
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift();
    }
    
    // 广播给所有用户
    io.emit('new-message', message);
    
    console.log(`💬 ${message.username}: ${content}`);
  });

  // 私聊消息（A用户发给B用户）
  socket.on('private-message', (data) => {
    const { from, to, content } = data;
    
    const message = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      from,
      to,
      content,
      type: 'private',
      timestamp: Date.now()
    };
    
    // 发送给目标用户
    const targetSocketId = userSockets.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('private-message', message);
      socket.emit('private-message-sent', message);
    } else {
      socket.emit('private-message-failed', { error: '用户不在线' });
    }
  });

  // 加入频道
  socket.on('join-channel', (data) => {
    const { channelId, address } = data;
    socket.join(`channel-${channelId}`);
    io.to(`channel-${channelId}`).emit('user-joined', { address, channelId });
  });

  // 离开频道
  socket.on('leave-channel', (data) => {
    const { channelId, address } = data;
    socket.leave(`channel-${channelId}`);
    io.to(`channel-${channelId}`).emit('user-left', { address, channelId });
  });

  // 断开连接
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      userSockets.delete(user.address);
      io.emit('user-offline', {
        address: user.address,
        onlineCount: onlineUsers.size
      });
      console.log(`❌ 用户下线: ${user.address} (${onlineUsers.size}人在线)`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

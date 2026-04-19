const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { users } = require('../db/schema/index');
const { eq } = require('drizzle-orm');
const chatSocket = require('./chatSocket');
const webrtcSocket = require('./webrtcSocket');

const socketHandler = (io) => {
  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: No token'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [user] = await db
        .select({ id: users.id, name: users.name, role: users.role })
        .from(users)
        .where(eq(users.id, decoded.id));
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Token invalid'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    socket.join(userId); // Personal room for notifications

    console.log(`🔌 Connected: ${socket.user.name}`);
    socket.broadcast.emit('user_online', { userId });

    chatSocket(io, socket);
    webrtcSocket(io, socket);

    socket.on('disconnect', () => {
      socket.broadcast.emit('user_offline', { userId });
      console.log(`🔌 Disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = socketHandler;

const chatSocket = (io, socket) => {
  socket.on('join_conversation', ({ conversationId }) => {
    socket.join(`conv_${conversationId}`);
  });

  socket.on('leave_conversation', ({ conversationId }) => {
    socket.leave(`conv_${conversationId}`);
  });

  socket.on('typing_start', ({ conversationId }) => {
    socket.to(`conv_${conversationId}`).emit('user_typing', {
      userId: socket.user.id,
      name: socket.user.name,
    });
  });

  socket.on('typing_stop', ({ conversationId }) => {
    socket.to(`conv_${conversationId}`).emit('user_stop_typing', {
      userId: socket.user.id,
    });
  });
};

module.exports = chatSocket; 
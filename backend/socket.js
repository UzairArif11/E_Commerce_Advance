// socket.js
let io;

module.exports = {
  init: (server) => {
    const socketio = require('socket.io');
    io = socketio(server, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('New client connected via WebSocket');

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  }
};

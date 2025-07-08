const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const config = require("./config/env");
const User = require("./models/User");
let io;

module.exports = {
  init: (server) => {
      io = socketio(server, {
      cors: {
        origin: 'https://e-commerce-advance-tau.vercel.app',
        methods: ['GET', 'POST'],
      },
    });

    // Middleware to verify token
    io.use(async(socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
      
        const user = await User.findById( decoded.user._id);
        if (!user) {
          return res.status(403).json({ msg: "Access denied," });
        }
        socket.userId  = decoded.user._id;
        socket.role = user.role;
        return next();
      } catch (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
    });

    io.on("connection", (socket) => {
      const { userId, role } = socket;

      if (role === 'admin') {
        socket.join('admin');
      } else {
        socket.join(userId);
      }

      console.log(`User ${userId} (${role}) connected and joined ${role === 'admin' ? 'admin' : userId}`);

      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected`);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
  },
};

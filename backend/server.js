const http = require('http');
const app = require('./app');
const config = require('./config/env');
const socket = require('./socket'); // <--- import the new socket module

const server = http.createServer(app);

// Initialize and start socket.io
socket.init(server);

const PORT = config.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

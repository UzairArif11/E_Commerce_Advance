// server.js
const app = require('./app');
const config = require('./config/env');

const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

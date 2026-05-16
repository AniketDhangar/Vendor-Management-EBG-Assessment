const http = require('http');
const app = require('./app');
const { connect } = require('./database');
const { port } = require('./config');

const start = async () => {
  await connect();
  const server = http.createServer(app);
  server.listen(port, () => console.log(`Server listening on ${port}`));
};

start().catch((err) => {
  console.error('Failed to start', err);
  process.exit(1);
});

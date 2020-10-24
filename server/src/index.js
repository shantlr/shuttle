import express from 'express';
import http from 'http';
import Server from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);

const PORT = 3005;

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

const io = new Server({
  path: '/api',
});
io.attach(server);

io.of('operations').on('connect', () => {
  console.log('App connected');
});

app.post('/operation', bodyParser.json(), (req, res) => {
  // console.log(req.body);
  io.of('operations').emit('operation', req.body);

  return res.sendStatus(200);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const gracefulShutdown = () => {
  server.close((err) => {
    console.log('Server closed');
    if (!err) {
      process.exit(0);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
};

process.once('SIGUSR2', gracefulShutdown);
process.once('SIGABRT', gracefulShutdown);

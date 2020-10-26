import express from 'express';
import http from 'http';
import Server from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8021;
const MAX_PAYLOAD_SIZE = process.env.MAX_PAYLOAD_SIZE || '10mb';

app.use(
  cors({
    origin: ['http://localhost:8022'],
    credentials: true,
  })
);

app.use('/app', express.static(path.join(__dirname, '../public')));

app.get(['/', '/app/*'], (req, res) => {
  return res.redirect('/app');
});

const io = new Server({
  path: '/api',
});
io.attach(server);

io.of('operations').on('connect', () => {
  console.log('App connected');
});

app.post(
  '/operation',
  bodyParser.json({ limit: MAX_PAYLOAD_SIZE }),
  (req, res) => {
    io.of('operations').emit('operation', req.body);
    return res.sendStatus(200);
  }
);

server.listen(PORT, () => {
  console.log(
    `You can post your traces to http://localhost:${PORT}/operations`
  );
  console.log(`Shuttle available at http://localhost:${PORT}/app`);
});

const gracefulShutdown = () => {
  console.log('Closing shuttle...');
  server.close((err) => {
    console.log('Shuttle closed');
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

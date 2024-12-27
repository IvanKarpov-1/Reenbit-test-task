import { Server } from 'socket.io';
import { auth0Middleware } from 'auth0-socketio';
import userSocket from './user.socket.js';
import messageSocket from './message.socket.js';

const sessionUser = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  });

  const checkJwtIo = auth0Middleware(
    process.env.AUTH0_ISSUER_BASE_URL,
    process.env.AUTH0_AUDIENCE
  );

  io.use(checkJwtIo);

  io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    if (!socket.handshake.auth.userId) {
      return;
    }

    socket.join(socket.handshake.auth.userId);

    sessionUser.set(socket.id, socket.handshake.auth.userId);

    userSocket(io, socket);
    messageSocket(io, socket, sessionUser);

    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
      sessionUser.delete(socket.id);
    });
  });
};

export default initializeSocket;

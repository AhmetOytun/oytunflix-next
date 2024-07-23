import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const rooms = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "X-Auth-Token"],
        credentials: true
      }
  });

  io.on("connection", (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log("User joined room roomId = ", roomId);
        if (!rooms[roomId]) {
          rooms[roomId] = { clients: 0, readyCount: 0 };
        }
        rooms[roomId].clients++;
      });
    
      socket.on('video-event', (data) => {
        const { type, roomId, currentTime } = data;
        if (type === 'seek') {
          rooms[roomId].readyCount = 0;
          io.to(roomId).emit('video-event', data);
        } else if (type === 'ready') {
          rooms[roomId].readyCount++;
          if (rooms[roomId].readyCount === rooms[roomId].clients) {
            io.to(roomId).emit('video-event', { type: 'resume' });
          }
        } else {
          socket.broadcast.to(roomId).emit('video-event', data);
        }
      });
    
      socket.on('disconnect', () => {
        console.log("User disconnected");
      });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
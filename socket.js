import cors from 'cors'
import express from 'express'
import http from 'http';
import {Server} from 'socket.io';
import {
  joinRoom,
  createRoom,
  findRoom,
  usersRoom,
  getVideoState,
  playVideo,
  stopVideo,
  seekVideo,
  setVideoState,
  changeRoomVideo,
  userRoomLeave,
  testError
} from './utils/rooms.js';
import { v4 as uuidv4 } from 'uuid';

const app = express()
const server = http.createServer(app)

app.use(cors({
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
}));
const port = 4000;

const io = new Server({
  server,
  cors: {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }
});


io.on('connection', (socket) => {
  socket.on('create_room', (data,callback) => {
    const event = createRoom(data.userName, data.roomId)
    callback({
      create: event.create
    })
  })

  socket.on('find_room', (data, callback) => {
    const event = findRoom(data.roomId)
    callback({
      find: event
    })
  })

  socket.on('set_video_state',(data) => {
    setVideoState(data.roomId, data.time)
  })

  socket.on("join_room", (data) => {
    const user = joinRoom(data.userName, data.userId, data.room, data.videoLink)

    socket.join(user.room);

    io.to(user.room).emit("videoState", getVideoState(user.room));


    io.to(user.room).emit("message", {
      messageId: uuidv4().split('-')[0],
      userName: user.userName,
      userId: user.userId,
      message: `Вошёл`
    });

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: usersRoom(user.room),
    });
  });

  socket.on('play',(data) => {
    const room = playVideo(data.room)
    socket.to(data.room).emit('play', room)
  }) 
  socket.on('stop',(data) => {
    const room = stopVideo(data.room)
    socket.to(data.room).emit('stop', room)
  })
  socket.on('seek', (data) => {
    const state = getVideoState(data.room)
    if (!state.isPlay) {
      const room = seekVideo(data.room,data.time)
      socket.to(data.room).emit('seek', room)
    }
  })

  socket.on("change_link", (data) => {
    changeRoomVideo(data.room, data.link)
    socket.to(data.room).emit("change_link", data);
  });

  socket.on("send_message", (data) => {
    if (data.event === 'leave') {
      userRoomLeave(data.room, data.userId)
      io.to(data.room).emit("roomUsers", {
        room: data.room,
        users: usersRoom(data.room),
      });
    }
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

io.listen(port, () => {
  console.log(`server ${port}`)
});


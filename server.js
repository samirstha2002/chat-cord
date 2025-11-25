const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const http = require("http");
const socketio = require("socket.io");
const { userJoin, getCurrentUser } = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessages = require("./utils/messages");

// middle ware for static files
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat-Cord Bot";

// run when clients connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessages(botName, "Welcome to Chat-Cord!"));

    // broadcast the all user except current user in room
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessages(botName, `${user.username} has joined the chat`)
      );
  });

  // listen message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessages(user.username, msg));
  });

  // disconnect the current user
  socket.on("disconnect", () => {
    // broadcast to all user including current one
    io.emit("message", formatMessages(botName, `a user has left the chat`));
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(` Server is  running on port ${port}`);
});

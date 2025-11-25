const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const http=require('http')
const socketio=require('socket.io')
const app = express();

const server=http.createServer(app)
const io= socketio(server)

// middle ware for static files

app.use(express.static(path.join(__dirname, "public")));

// run when clients connect

io.on("connection",socket=>{
    console.log("NEW WS connection")
})
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(` Server is  running on port ${port}`);
});

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");
// get username and room from url

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log(username, room);
const socket = io();

// join room
socket.emit("joinRoom", {
  username,
  room,
});

// get user and room
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //emit message to server
  socket.emit("chatMessage", msg);

  // clear message in put
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//  OUtput msg to the Dom

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p> <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//output room name to Dom

function outputRoomName(room) {
  roomName.innerText = room;
}

//output users to Dom

function outputUsers(users) {
  usersList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li> `)
    .join("")}`;
}

'use strict';

function showMessage(user, text) {
  var message = document.createElement('li');
  message.classList.add('self');
  message.innerHTML = `<div class="avatar"><img src="${user.pic}" alt="${user.name}" draggable="false"/></div>
    <div class="msg">
      <p>${text}</p>
      <time>${(new Date).toLocaleTimeString('ru-RU')}</time>
    </div>`;
  var list = document.getElementById('messageList');
  list.appendChild(message);
  message.scrollIntoView();
}

function showOtherMessage(user, text) {
  var message = document.createElement('li');
  message.classList.add('other');
  message.innerHTML = `<div class="avatar"><img src="${user.pic}" alt="${user.name}" draggable="false"/></div>
    <div class="msg">
      <p>${text}</p>
      <time>${(new Date).toLocaleTimeString('ru-RU')}</time>
    </div>`;
  var list = document.getElementById('messageList');
  list.appendChild(message);
  message.scrollIntoView();
}

function showNewUser(user) {
  var message = document.createElement('li');
  message.classList.add('info');
  message.innerHTML = `<p>${user.name} вошел в чат …</p>`;
  var list = document.getElementById('messageList');
  list.appendChild(message);
  message.scrollIntoView();
}

var currentUser;
var server = io(`//${location.host}/`);
server.on('login', function (user) {
  console.log(user);
  currentUser = user;
  document.getElementById('userName').innerHTML = currentUser.name;
  document.getElementById('userPic').src = currentUser.pic;
});

server.on('message', function (message) {
  showOtherMessage(message.user, message.text);
});

server.on('lastMessages', function (messages) {
  messages.forEach(message => showOtherMessage(message.user, message.text));
});

server.on('newUser', function (user) {
  showNewUser(user);
});

document.getElementById('messageForm').addEventListener('submit', function (event) {
  event.preventDefault();
  //console.log(this.message.value);
  showMessage(currentUser, this.message.value);
  server.emit('message', this.message.value);
  this.reset();
});

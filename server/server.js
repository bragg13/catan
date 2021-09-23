// importing stuff
var express = require('express');
const fs = require('fs');

var Player = require('./player.js');
var Board = require('./board.js');
var Manager = require('./manager.js');
var Hexagon = require('./hexagon.js');


// global variables
let rooms = new Map();
let utilsjson;


// reading 'utils.json' file
fs.readFile('./public/utils.json', (err, data) => {
  if (err) throw err;
  utilsjson = JSON.parse(data);
});



// Create the app
var app = express();

// Set up the server - process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
});

// I will put in public folder the static files
app.use(express.static('public'));

// WebSocket Portion
var io = require('socket.io')(server, {
  cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  'connection',
  // We are given a websocket object in our function
  function(socket) {
    console.log('We have a new client: ' + socket.id);

    socket.on('join', data => {
      let gameid = data.gameid;
      let user = data.username;

      if (gameid === '') {
        // no gameid sent. Find a match automatically
        // if there is no match, create one in rooms
        let joined = false;
        for (let [roomid, room] of rooms) {
          if (room.players.length < utilsjson.maxplayers) {
            // there's a not full room. Let's join it
            joinRoom(roomid, user, socket);
            joined = true;
          }
        }

        if (!joined) {
          // gotta create a new room because all the others are full
          let _gameid = Math.floor(Math.random()*6000);    // TODO i dont trust probability
          createRoom(_gameid);
          joinRoom(_gameid, user, socket);

        }

      } else {
        if (rooms.has(gameid)) {
          console.log(`room with gameid ${gameid} found. Trying to join...`);

          // join given match
          if (rooms.get(gameid).players.length < 4) {
            // the player can join
            joinRoom(gameid, user, socket);

          } else {
            // the player cant join
            console.log('creating a new room [full]...');
            let _gameid = Math.floor(Math.random()*6000);    // TODO i dont trust probability
            createRoom(_gameid);
            joinRoom(_gameid, user, socket);

          }
        } else {
          console.log(`no room with gameid ${gameid} found. Creating one...`);
          createRoom(gameid);
          joinRoom(gameid, user, socket);

        }
      }
    });

    socket.on('update', data => {
      console.log("DATA sent from client="+data);
      emitUpdate(data.gameid, data);
    
    });

    socket.on('disconnect', data => {
      console.log('Client has disconnected');
      emitUpdate(data.gameid, data);
      
    });
  }
);


/**
 * Makes the player join the given room, as in rooms and socketRoom.
 * Notifies the scene change and emits update.
 * @param {int} gameid Room/Game identifier
 * @param {string} user Player username
 * @param {io.Socket} socket Socket object
 */
const joinRoom = (gameid, user, socket) => {
  console.log('joining room ['+gameid+']...');

  // creating new player and sending it back to client
  let nplayers = rooms.get(gameid).players.length;
  let player = new Player(user, socket.id, rooms.get(gameid).mgr.playersColors[nplayers]);
  socket.emit('set_player', player);
  
  // pushing the new player
  rooms.get(gameid).players.push(player);
  socket.join(gameid);

  // player could either be joining a lobby or being the last player needed to start the game
  io.to(gameid)
    .emit('changeScene', {
      newScene: (rooms.get(gameid).players.length === utilsjson.maxplayers) ? 'EARLY_GAME' : 'LOBBY'
  });

  io.to(gameid).emit('update', rooms.get(gameid));

}


/**
 * Creates a new room/socketRoom  
 * @param {int} gameid Room/game identifier
 */
const createRoom = (gameid) => {
  console.log('creating new room ['+gameid+']...');

  // create a match
  let room = {};
  room.gameid = gameid;
  room.players = [];

  room.board = new Board();
  room.board.generateBoard(utilsjson.resourceTypes, utilsjson.values);
  
  room.mgr = new Manager();

  rooms.set(gameid, room);

}


/**
 * Emit update to given room with given data
 */
const emitUpdate = (room, data) => {
    io.to(room).emit('update', data);
}


/**
 * Emit update to all the rooms, not yet with given data
 * instead with room data (supposing room data is updated
 * somewhere else)
 */
const emitBroadcast = (data) => {
  for (let [gameid, game] of rooms) {
    io.to(gameid).emit('update', game);
  }
}
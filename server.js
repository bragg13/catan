// game stuff
let rooms = new Map();

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This callback just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

// I will put in public folder the static files
app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
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
      let retdata = {};

      if (gameid === '') {
        console.log('gameid empty.');

        // no gameid sent. Find a match automatically
        // if there is no match, create one in rooms
        // if (rooms.has(gameid)) {
        //   rooms.players.push(user);   // push the player
        //   socket.join(gameid);        // this client joins the rooms '$gameid'
        //
        //
        // }
      } else {
        if (rooms.has(gameid)) {
          console.log(`room with gameid ${gameid} found. Trying to join...`);

          // join given match
          if (rooms.get(gameid).players < 4) {
            // the player can join
            console.log('joining room ['+gameid+']...');

            rooms.get(gameid).players.push(new Player(user));
            socket.join(gameid);
            retdata.status = 'WAITING';

          } else {
            // the player cant join
            console.log('creating a new room [full]...');

          }
        } else {
          console.log(`no room with gameid ${gameid} found. Creating one...`);

          // create a match
          let room = {};
          room.gameid = gameid;
          room.players = [];
          room.players.push(new Player(user));
          room.started = false;
          room.game = new Board();
          // room.mgr = new Manager();

          rooms.set(gameid, room);
          socket.join(gameid);

        }
      }
    });

    socket.on('update', data => {
      var blob;
      for (var i = 0; i < blobs.length; i++) {
        if (socket.id == blobs[i].id) {
          blob = blobs[i];
        }
      }
      blob.x = data.x;
      blob.y = data.y;
      blob.r = data.r;
    });

    socket.on('disconnect', function() {
      console.log('Client has disconnected');
    });
  }
);




  // on new game

    // else {
    //   // 1. check if a started game has given gameid to avoid duplicates, in case give error
    //   // 2. then check if there is a rooms with given gameid, in case try to join
    //   // 3. finally if there is no rooms with given gameid, create one
    //   gameid = data.gameid;
    //
    //   if (games.has(gameid)) {
    //     // game exists, but it's already started
    //     returnData.msg = 'Error, game already started';
    //     returnData.state = 'ERR';
    //   }
    //
    //   else if (rooms.has(gameid)) {
    //     // join the game
    //     // if has the same name of another player, add '*'
    //     if (rooms.get(gameid).players.includes(user)) {
    //       user.concat("*");
    //     }
    //
    //     returnData.msg = 'Joining match '+gameid+' with username '+user+'...';
    //     returnData.state = 'rooms';
    //
    //     // add player
    //     rooms.get(gameid).players.push(user);
    //
    //     // join socket rooms
    //     socket.join(gameid);
    //   }
    //
    //   else {
    //     // create a match
    //     returnData.msg = 'Creating new match '+gameid+' with username '+user+'...';
    //     returnData.state = 'rooms';
    //
    //   }
    //
    //   socket.emit('handshake', returnData);
    //
    //
    //
    // }
//   })
// })

// send specific update data to every room
setInterval(() => {
  for (let room of rooms) {
    console.log(`room with gameid ${room.gameid}. Players: ${room.players}`);
    io.to(room.gameid).emit('update', room);
  }

}, 2000);

/**
 * @author: Andrea Bragante
 * @version: 19/07/21
 */
var board;
var mgr;
var socket;
var utilsjson;
var gameinfo = {};
var SCENE = 'MENU';

/* ===================================== */
/* =           SCENE MANAGER           = */
/* ===================================== */
function preload() {
  utilsjson = loadJSON('./utils.json');

  // socket stuff
  socket = io.connect('http://localhost:3000');
  socket.on('update', data => handleUpdate(data));
  socket.on('changeScene', data => SCENE = data.newScene);

}

function setup() {
  // GUI stuff
  createCanvas(utilsjson.canvasW, utilsjson.canvasH);
  background("darkkhaki");

  // got to call again setup function :c
  if (SCENE === 'MENU') {
    textSize(28);
    textAlign(CENTER, TOP);
    text("Game menu", utilsjson.canvasW/2, 25);

    // inputs
    username = createInput("", "text");
    username.position(25, 125);
    username.elt.placeholder = "Username";

    gameid = createInput("", "text");
    gameid.position(25, 150);
    gameid.elt.placeholder = "Game ID (leave empty for random)";

    button = createButton("play game");
    button.position(25, 200);
    button.mousePressed(() => {
      if (username.elt.value == "") {
        username.elt.style.borderColor = "red";

      } else {
        // connect to gameid

        socket.emit('join', {
          username: username.elt.value,
          gameid: gameid.elt.value       // if empty handle from server side
        })
      }

    });

  } else if (SCENE === 'LOBBY') {
    removeElements();
    textSize(28);
    textAlign(CENTER, TOP);
    text("Game lobby", utilsjson.canvasW/2, 25);

    textAlign(LEFT);
    text("Waiting for game #"+gameinfo.gameid, 25, 100);
    text("Players:", 25, 150);
    let i=0;
    for (let player of gameinfo.players) {
      text("- "+player.name, 25, 180+i*40);
      i++;
    }

  } else if (SCENE === 'EARLY_GAME') {
    removeElements();
    textSize(28);
    textAlign(CENTER, TOP);
    text("Early game", utilsjson.canvasW/2, 25);

    gameinfo.board.init();


  } else if (SCENE === 'GAME') {
    removeElements();
    textSize(28);
    textAlign(CENTER, TOP);
    text("Game started!", utilsjson.canvasW/2, 25);
  }
}


function handleUpdate (data) {
  console.log(data);
  // get update data
  gameinfo.gameid = data.gameid;
  gameinfo.players = [...data.players];
  gameinfo.board = new Board({...data.board});
  gameinfo.mgr = new Manager({...data.mgr});
  // gameinfo = {...data};
  setup();

}

/**
 * @author: Andrea Bragante
 * @version: 19/07/21
 */
var board;
var players = [];
var scene_mgr;
var mgr;
var socket;

/* ===================================== */
/* =           SCENE MANAGER           = */
/* ===================================== */
function setup() {
  createCanvas(canvasW, canvasH);
  background("darkkhaki");

  scene_mgr = new SceneManager();

  // preload scenes
  scene_mgr.addScene(Menu); // Menu is a client based scene
  scene_mgr.addScene(Game); // Game is a server based scene

  scene_mgr.showNextScene();
}

function draw() {
  scene_mgr.draw();
}

function mousePressed() {
  scene_mgr.handleEvent("mousePressed");
}


/* ===================================== */
/* =               MENU                = */
/* ===================================== */
function Menu() {
  this.setup = () => {
    // socket stuff
    socket = io.connect('http://localhost:3000');

    socket.on('update', data => console.log(data));    // this should persist through scenes


    // GUI stuff
    textSize(28);
    text("catan", canvasW / 2 - 40, 50);

    // inputs
    username = createInput("", "text");
    username.position(25, 75);
    username.elt.placeholder = "Username";

    gameid = createInput("", "text");
    gameid.position(25, 100);
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
  }

  // this.startgame = () => {
  //   players.push(new Player(user1.elt.value, 1));
  //   players.push(new Player(user2.elt.value, 2));
  //   if (user3.elt.value !== "") players.push(new Player(user3.elt.value, 3));
  //   if (user4.elt.value !== "") players.push(new Player(user4.elt.value, 4));
  //
  //   // cleanup and move onto next scene
  //   removeElements();
  //   background("darkkhaki");
  //   scene_mgr.showNextScene();
  // }
}

function Game(){}

function handleUpdate (data) {
  // get update data
  let game = data.game;
  let mgr = data.mgr;
  let players = data.players;
  let started = data.started;

  if (started) {
    console.log('Game started');
  } else {
    console.log('Game not started');

  }

  // // create GUI
  // fill("black");
  // textSize(20);
  //
  // // round & dice
  // text(mgr.round == 0 ? "pre" : mgr.round, );
  // text(mgr.dice == 0 ? "/" : mgr.dice);
  //
  // // players
  // for (let i = 0; i < players.length; i++) {
  //   // fill color
  //   fill((mgr.roundPlayer === players[i].name) ? "red" : "black");
  //   text(`${players[i].name}`, players[i].guiX, players[i].guiY);
  // }
  //
  // drawSprites();
  //
  // // handle rounds
  // if (mgr.round === 0) {
  //   // time to decide first colonies
  // } else {
  //
  // }
  //
  /* ===================================== */
  /* =               GAME                = */
  /* ===================================== */
}

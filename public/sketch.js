/**
 * @author: Andrea Bragante
 * @version: 19/09/21
 */

/* === MISC === */
var socket;
var utilsjson;
var gameinfo = {};
var player = {};
var SCENE = 'MENU';

/* === GUI === */
var diceBtn, roundBtn;

/**
 * Loads 'utils.json' and initializes socket stuff
 */
function preload() {
  utilsjson = loadJSON('./utils.json');

  // socket stuff
  socket = io.connect('http://localhost:3000');
  socket.on('update', data => handleUpdate(data));
  socket.on('changeScene', data => SCENE = data.newScene);
  socket.on('set_player', _player => player = new Player(_player));
}


/**
 * ...
 */
function setup() {
  // basic drawing
  createCanvas(utilsjson.canvasW, utilsjson.canvasH);
  background("darkkhaki");

  // got to call again setup function :c
  if (SCENE === 'MENU') {
    textSize(28);
    textAlign(CENTER, TOP);
    text("Game menu", utilsjson.canvasW/2, 25);

    // username input
    username = createInput("", "text");
    username.position(25, 125);
    username.elt.placeholder = "Username";

    // gameid input
    gameid = createInput("", "text");
    gameid.position(25, 150);
    gameid.elt.placeholder = "Game ID (leave empty for random)";

    // play button
    button = createButton("play game");
    button.position(25, 200);

    // play button handler
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
    textAlign(LEFT);
    text("Waiting for game #"+gameinfo.gameid, 25, 100);
    text("Players:", 25, 150);
    let i=0;
    for (let player of gameinfo.players) {
      text("- "+player.name, 25, 180+i*40);
      i++;
    }

    // wont work since not in draw()
    // let dots = '';
    // if (frameCount%15==0) dots = '.'; 
    // if (frameCount%30==0) dots = '..';
    // if (frameCount%15!=0 && frameCount%30!=0) dots = '...';

    text(`${utilsjson.maxplayers - gameinfo.players.length} player left...`, 25, 250);


  } else if (SCENE === 'EARLY_GAME') {
    removeElements();
    gameinfo.board.init();
    
    if (gameinfo.mgr.playerTurn===player.name) text(`It's your turn to choose`, utilsjson.canvasW/2-10, 10);

    drawPlayerGUI();


  } else if (SCENE === 'GAME') {
    removeElements();
  }
}


/**
 * Needed to draw sprites and handle mouse pressed
 */
function draw() {
  drawSprites();
}


/**
 * 
 */
function drawPlayerGUI () {
  // ready my brush
  fill('black');

  // player name and image (coloured circle atm)
  // fill('red');
  // ellipse(25, 25, 50, 50);
  
  textSize(25);
  textAlign(LEFT, TOP);
  fill(player.color);
  if (gameinfo.mgr.playerTurn === player.name) textStyle(BOLD);
  text(`${player.name}`, 25, 25);
  
  fill('black');
  textStyle(NORMAL);
  
  // army
  textSize(20);
  if (player.army>0) text(`${player.army}`, 100, 25);
  
  // points
  textSize(20);
  text(`Points: ${player.getPoints()}`, 25, 50);


  // roads
  textAlign(LEFT, BOTTOM);
  textSize(20);
  text(`Roads:${utilsjson.totRoads - player.roads.length}`, 25, utilsjson.canvasH-25);

  // cities and colonies
  textAlign(LEFT, BOTTOM);
  textSize(20);
  text(`Colonies:${utilsjson.totColonies - player.colonies.length}`, 25, utilsjson.canvasH-50);
  text(`Cities:${utilsjson.totCities - player.cities.length}`, 25, utilsjson.canvasH-75);


  // round and dice btns
  textAlign(RIGHT, TOP);
  diceBtn = createSprite(utilsjson.canvasW-50, 25, 30, 30); 
  diceBtn.draw = function() {
    fill('red');
    stroke('black');
    ellipse(0, 0, 30, 30);

    fill('white');
    textAlign(CENTER);
    text(gameinfo.mgr.dice, 0, 0);
  }
  diceBtn.onMousePressed = function() {
    gameinfo.mgr.dice++;
  }

  roundBtn = createSprite(utilsjson.canvasW-50, 75, 30, 30); 
  roundBtn.draw = function() {
    fill('red');
    stroke('black');
    ellipse(0, 0, 30, 30);

    fill('white');
    textAlign(CENTER);
    text(gameinfo.mgr.round, 0, 0);
  }
  roundBtn.onMousePressed = function() {
    gameinfo.mgr.round++;
  }

  // round and dice text
  textSize(25);
  text(`Round`, utilsjson.canvasW-80, 15);
  text(`DICE`, utilsjson.canvasW-80, 65);


  // other players
  textAlign(RIGHT, CENTER);
  textSize(20);
  text(`People playing:`, utilsjson.canvasW-100, 150);
  let i=1;
  gameinfo.players.forEach(player => {
    if (player.name !== this.player.name) {
      fill(player.color);
      text(`${player.name}`, utilsjson.canvasW-100, 150+50*i);
      i++;
    }
  });

  
  // cards
  stroke('black');
  strokeWeight(0.5);
  i=0;
  for (let card of player.resources) {
    fill(card.color);
    rect(i*50+220, utilsjson.canvasH-110, 50, 100);
    i++;
  }

}


function sendUpdate (data) {
  socket.to(gameinfo.gameid).emit('update', gameinfo);  // i could send the manager only
  
}

/**
 * Gets updated data from server and casts it
 * into 'gameinfo' object. Runs setup to write changes.
 * @param {Object} data The updated data 
 */
function handleUpdate (data) {
  gameinfo.gameid = data.gameid;
  gameinfo.players = [...data.players];
  gameinfo.board = new Board({...data.board});
  gameinfo.mgr = new Manager({...data.mgr});
  setup();

}

function mouseClicked(){
  var x = floor(mouseX);
  var y = floor(mouseY);
  console.log(x+"_"+y);
}
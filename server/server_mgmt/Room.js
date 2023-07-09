import { Game } from "../game_mgmt/Game.js";
import { debug, io } from "../index.js";

export class Room {
  constructor(id, maxPlayers) {
    this.id = id;
    this.maxPlayers = maxPlayers;

    this.players = [];
    this.playersReady = [];
    this.gameStatus = "lobby";

    this.game = null;
  }

  joinRoom = (player) => {
    // add player to room and to player list
    this.players.push(player);
    io.sockets.sockets.get(player.id).join(this.id);

    // emit player info to player
    io.sockets.sockets.get(player.id).emit("playerInfo", {
      msg: "playerInfo",
      ...player,
    });

    // emit updated room info to room
    io.to(this.id).emit("roomJoined", {
      msg: "roomJoined",
      roomId: this.id,
      roomMaxPlayers: this.maxPlayers,
      players: this.players,
    });
  };

  createGame = () => {
    this.gameStatus = "created";

    this.game = new Game(this.id, this.players);
    this.game.gameInitialise();

    const initialGameState = this.game.getGameState();

    // emit initial game state to room
    io.to(this.id).emit("gameInitialised", {
      msg: "gameInitialised",
      ...initialGameState,
    });

    // subscribe to player updates
    this.players.forEach((player) => {
      io.sockets.sockets
        .get(player.id)
        .on("playerUpdate", (updateData) =>
          this.processPlayerUpdate(updateData)
        );
    });
  };

  processPlayerUpdate = (playerUpdate) => {
    console.log(`[PlayerUpdate] ${playerUpdate.from}: ${playerUpdate.msg}`);

    switch (playerUpdate.msg) {
      case "earlyGameClientReady":
        this.playersReady.push(playerUpdate.from);
        if (this.playersReady.length === this.players.length) {
          this.playersReady.length = 0;
          this.gameStatus = "earlyGame";
          if (debug) {
            this.handleEarlyGame(this.game.generateInitialDebugData());
          } else {
            this.handleEarlyGame();
          }
        }
        break;

      case "clientReady":
        this.playersReady.push(playerUpdate.from);
        if (this.playersReady.length === this.players.length) {
          this.playersReady.length = 0;
          this.gameStatus = "game";
          this.handleGame(playerUpdate);
        }
        break;

      case "selectedTown":
        this.game.selectedTown(
          playerUpdate.updateData.selectedTown,
          playerUpdate.from
        );
        this.handleEarlyGame([{
          msg: "newTown",
          updatedBy: playerUpdate.from,
          town: playerUpdate.updateData.selectedTown,
          road: null,
        }]);
        break;

      case "selectedRoad":
        this.game.selectedRoad(
          playerUpdate.updateData.selectedRoad,
          playerUpdate.from
        );
        this.handleEarlyGame([{
          msg: "newRoad",
          updatedBy: playerUpdate.from,
          road: playerUpdate.updateData.selectedRoad,
          town: null,
        }]);
        break;

      case "selectedHarvestSpot":
        this.game.selectedHarvestSpot(
          playerUpdate.updateData.selectedHarvestSpot,
          playerUpdate.from
        );
        this.handleEarlyGame();
        break;

      case "diceRolled":
        this.game.diceRolled(
          playerUpdate.from,
          playerUpdate.updateData.diceValue
        );
        this.handleGame(playerUpdate);
        break;

      case "turnDone":
        this.handleGame(playerUpdate);
        break;

      default:
        break;
    }
  };

  handleGame = (updateData) => {
    // dont increase turn id it is just another action from the same player
    let turnData =
      updateData.msg === "turnDone" || updateData.msg === "clientReady"
        ? this.game.turnSystem.nextTurn()
        : this.game.turnSystem.getTurnData();
    console.log("turnData", turnData);

    // list of actions the player can do
    let availableActions =
    updateData.msg === "turnDone" || updateData.msg === "clientReady"
        ? ["diceRoll"]
        : this.game.getAvailableActions(turnData.player);

      // send update to players
      const gameUpdate = {
        turn: turnData,
        availableActions: availableActions,
        players: this.game.players,
        updatedBoard: [...updateData],
      }

      io.to(this.id).emit("gameUpdate", gameUpdate);

      console.log("[Game] Sent this update: ", gameUpdate);

  };

  handleEarlyGame = (additionalUpdateData = null) => {
    let turnData = this.game.turnSystem.nextInitialTurn();
    let gameUpdate = {}

    // if early game is over
    if (turnData.round === 0) {
      // send last early game update (last player's inventory)
      gameUpdate = {
        availableSpots: null,
        availableRoads: null,
        availableHarvestSpots: null,
        turn: turnData,
        players: this.game.players,
        updatedBoard: additionalUpdateData!==null ? [...additionalUpdateData] : [],   // posso metterlo nei parametri
      }
    
    } else {
      // else send update to players
      let availableRoads = null,
        availableSpots = null,
        availableHarvestSpots = null;

      if (turnData.action === "town_1" || turnData.action === "town_2") {
        availableSpots = this.game.getAvailableSpots(turnData.player);
      } else if (turnData.action === "road_1" || turnData.action === "road_2") {
        availableRoads = this.game.getAvailableRoads(turnData.player);
      } else if (turnData.action === "harvest") {
        availableHarvestSpots = this.game.getAvailableHarvestSpots(
          turnData.player
        );
      }

      // send update to players
      gameUpdate = {
        availableSpots,
        availableRoads,
        availableHarvestSpots,
        turn: turnData,
        players: this.game.players,
        updatedBoard: additionalUpdateData!==null ? [...additionalUpdateData] : [],
      };
    }

    io.to(this.id).emit("earlyGameUpdate", gameUpdate);
    console.log("[EGame] Sent this update: ", gameUpdate);

  };
}

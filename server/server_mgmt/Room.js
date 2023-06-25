import { Game } from "../game_mgmt/Game.js";
import { io } from "../index.js";

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
    this.players.push(player);
    io.sockets.sockets.get(player.id).join(this.id);
    io.sockets.sockets
      .get(player.id)
      .emit("playerInfo", { msg: "playerInfo", ...player });
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
    console.log(playerUpdate);
    switch (playerUpdate.msg) {
      case "clientReady":
        console.log("[SERVER] Room - client ready");
        this.playersReady.push(playerUpdate.from);
        if (this.playersReady.length === this.players.length) {
          this.gameStatus = "started";
          this.handleEarlyGame();
        }
        break;

      case "selectedTown":
        console.log(
          `[SERVER] Room - Player ${playerUpdate.from} has selected a town`
        );
        this.game.selectedTown(playerUpdate.selectedTown, playerUpdate.from);
        this.handleEarlyGame({
          msg: 'newTown',
          player: playerUpdate.from,
          town: playerUpdate.selectedTown
        });
        break;

      case "selectedRoad":
        console.log(
          `[SERVER] Room - Player ${playerUpdate.from} has selected a road`
        );
        this.game.selectedRoad(playerUpdate.selectedRoad, playerUpdate.from);
        this.handleEarlyGame({
          msg: 'newRoad',
          player: playerUpdate.from,
          road: playerUpdate.selectedRoad
        });
        break;

      case "turnDone":
        console.log("[SERVER] Room - turn done");
        this.handleGame(playerUpdate)
        break;

      default:
        break;
    }
  };

  handleGame = (updateData) => {
    console.log('game actaully started')
  }

  handleEarlyGame = (additionalUpdateData) => {
    console.log("[SERVER] Room - sending early game update");
    let turnData = this.game.turnSystem.nextInitialTurn();

    if (turnData.round===0) {
        this.handleGame(additionalUpdateData)
    }
    else {
        let data = {}
        data.player = turnData.player
        if (turnData.send === "spots") {
          data.availableSpots = this.game.getAvailableSpots(
            turnData.player
          );
          data.availableRoads = null;
    
        } else {
          data.availableSpots = null;
          data.availableRoads = this.game.getAvailableRoads(
            turnData.player
          );
        }

        data.updateData = {...additionalUpdateData}
    
        io.to(this.id).emit("earlyGameUpdate", data);

    }

  };
}

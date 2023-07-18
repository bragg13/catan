import { debug, io } from "../index.js";
import { Board } from "./Board.js";
import { TurnSystem } from "./TurnSystem.js";
import { townHarvest, deck, awards } from "./helpers/constants.js";

export class Game {
  constructor(id, players) {
    this.roomId = id;
    this.players = {};
    this.deck = deck.sort(() => Math.random() - 0.5);

    for (let player of players) {
      this.players[player.id] = {
        // TODO: replace with Player object
        id: player.id,
        color: player.color,
        username: player.username,
        inventory: {
          wood: 0,
          clay: 0,
          sheep: 0,
          wheat: 0,
          rocks: 0,
        },
        roads: [],
        towns: [],
        cities: [],
        dev: [],
        points: 0,
        awards: [],
      };
    }
  }

  gameInitialise = () => {
    this.turnSystem = new TurnSystem(this.players);
    this.board = new Board(this.players);

    console.log("towns spawned");
    console.log("roads spawned");

    console.log("game created");
  };

  // debug
  generateInitialDebugData = () => {
    const players = Object.values(this.players);

    if (debug) {
      let updateData = [];

      updateData.push(this.debugTownSpawn(9, players[0].id));
      updateData.push(this.debugTownSpawn(15, players[0].id));
      updateData.push(this.debugTownSpawn(29, players[1].id));
      updateData.push(this.debugTownSpawn(37, players[1].id));
      updateData.push(this.debugRoadSpawn(9, 13, 13, players[0].id));
      updateData.push(this.debugRoadSpawn(15, 11, 17, players[0].id));
      updateData.push(this.debugRoadSpawn(29, 23, 35, players[1].id));
      updateData.push(this.debugRoadSpawn(37, 32, 47, players[1].id));

      return updateData
      
    }
  };

  debugTownSpawn = (town, player_id) => {
    this.selectedTown(town, player_id);
    return {
      msg: "newTown",
      updatedBy: player_id,
      town: town,
      road: null,
    };
  };

  debugRoadSpawn = (from, to, id, player_id) => {
    this.selectedRoad({ from, to }, player_id);
    return {
      msg: "newRoad",
      updatedBy: player_id,
      town: null,
      road: { from, to, id },
    };
  };

  getGameState = () => {
    return {
      board: this.board,
      turn: this.turnSystem,
      players: this.players,
    };
  };

  getAvailableActions = (player_id) => {
    let availableActions = [];
    let player = this.players[player_id];
    let playerInventory = player.inventory;
    console.log(playerInventory);

    // === CRAFTING ===
    let availableSpotsTown = this.getAvailableSpots(player_id);
    let availableRoads = this.getAvailableSpots(player_id);
    let availableSpotsCity = this.getAvailableHarvestSpots(player_id);

    console.log(availableSpotsTown);
    console.log(availableRoads);
    console.log(availableSpotsCity);
    
    // check if player can afford town
    if (
      playerInventory.wood >= 1 &&
      playerInventory.clay >= 1 &&
      playerInventory.sheep >= 1 &&
      playerInventory.wheat >= 1
    ) {
      if (availableSpotsTown.length > 0) availableActions.push("town");
    }

    // check if player can afford city
    if (playerInventory.rocks >= 3 && playerInventory.wheat >= 2) {
      if (availableSpotsCity.length > 0) availableActions.push("city");
    }

    // check if player can afford road
    if (playerInventory.wood >= 1 && playerInventory.clay >= 1) {
      if (availableRoads.length > 0)
        // useless?
        availableActions.push("road");
    }

    // check if player can afford dev card
    if (
      playerInventory.sheep >= 1 &&
      playerInventory.wheat >= 1 &&
      playerInventory.rocks >= 1
    ) {
      availableActions.push("dev");
    }

    // === DEV CARDS ===
    if (player.dev.length > 0) {
      availableActions.push("playDev");
    }

    return availableActions;
  };


  // harvest is handled here
  // should work on temp arrays TODO GENERALLY
  diceRolled = (player, dice) => {
    // update dice value on turnSystem
    this.turnSystem.dice = dice;

    const diceValue = dice.value1 + dice.value2;
    let harvestSpots = []

    // for each player
    for (let player of Object.keys(this.players)) {
      // for each of their town
      for (let town of this.players[player].towns) {
        // id of the tiles I would be harvesting from
        for (let tileToBeHarvested of townHarvest[town]) {
          // if the tile has the same value as the dice
          if (this.board.getTileValue(tileToBeHarvested) === diceValue) {
            this.harvest(tileToBeHarvested, player);
            harvestSpots.push(tileToBeHarvested)
          }
        }
      }
    }

    return harvestSpots;
  };

  harvest = (tileId, player_id) => {
    // add the resource to their inventory
    let harvestResource = this.board.getTileResource(tileId);
    this.players[player_id].inventory[harvestResource] += 1;
    console.log(
      `Player ${player_id} harvested ${harvestResource} with total of ${this.players[player_id].inventory[harvestResource]}`
    );
  };

  // interaction with board
  getAvailableSpots = (player_id) => {
    return this.board.getAvailableSpots(player_id);
  };
  getAvailableRoads = (player_id) => {
    return this.board.getAvailableRoads(player_id);
  };
  getAvailableHarvestSpots = (player_id) => {
    return this.players[player_id].towns;
  };
  pickDevCard = (player_id) => {
    // pick a random card from the deck
    let card = this.deck.pop();
    this.players[player_id].dev.push(card);
  };

  // when a player selects a spot/road/harvest spot (on early game)
  selectedTown = (town, player_id) => {
    // spawn town on board (graph)
    this.board.spawnTown(town, player_id);

    // add town to player's inventory
    this.players[player_id].towns.push(town);
  };

  selectedRoad = (road, player_id) => {
    // spawn road on board (graph)
    this.board.spawnRoad(road.from, road.to, player_id);

    // add road to player's inventory
    this.players[player_id].roads.push(road);
  };

  selectedHarvestSpot = (spot, player_id) => {
    // harvest the spot
    for (let tile of townHarvest[spot]) {
      console.log(`Player ${player_id} is harvesting tile ${tile}`);
      this.harvest(tile, player_id);
    }
  };
}

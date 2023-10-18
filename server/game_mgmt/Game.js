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
    let availableActions = {};
    let player = this.players[player_id];
    let playerInventory = player.inventory;

    let availableSpotsTown = this.getAvailableSpots(player_id);
    let availableSpotsRoad = this.getAvailableRoads(player_id);
    let availableSpotsCity = this.getAvailableHarvestSpots(player_id);

    // check if player can build towns
    const affordableTowns = this.getAffordableTowns(playerInventory)
    if (affordableTowns > 0 && availableSpotsTown.length > 0) {
      availableActions["town"] = {
        quantity: Math.min(affordableTowns, availableSpotsTown.length),
        spots: availableSpotsTown
      }
    }

    // check if player can build roads
    const affordableRoads = this.getAffordableRoads(playerInventory)
    if (affordableRoads > 0 && availableSpotsRoad.length > 0) {
      availableActions["road"] = {
        quantity: Math.min(affordableRoads, availableSpotsRoad.length),
        spots: availableSpotsRoad
      }
    }

    // check if player can build cities
    const affordableCities = this.getAffordableCities(playerInventory)
    if (affordableCities > 0 && availableSpotsCity.length > 0) {
      availableActions["city"] = {
        quantity: Math.min(affordableCities, availableSpotsCity.length),
        spots: availableSpotsCity
      }
    }

    // check if player can trade TODO later (per ora c'e tutto l'inventario)
    if (!this.isInventoryEmpty(playerInventory))
    availableActions['trade'] = {
      ...playerInventory
    }

    // check if player can afford dev cards
    const affordableDevs = this.getAffordableDev(playerInventory)
    if (affordableDevs > 0) {
      availableActions["buildDev"] = {
        quantity: affordableDevs
      }
    }

    // check if player can play dev cards
    // TODO: distinguish between victory points and knights/whatevs
    if (player.dev.length > 0) {
      availableActions["playDev"] = {
        quantity: player.dev.length
      }
    }

    // always available actions - polezno?
    availableActions['passTurn'] = true;

    console.log(`\tAvailable actions for player ${player_id}: ${JSON.stringify(availableActions)}`)
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

  // affordability - dovrebbe funzionare ma tbh non ne ho idea
  getAffordableTowns = (inv) => {
    return Math.min(
      inv.wood,
      inv.clay,
      inv.sheep,
      inv.wheat)
  }
  getAffordableRoads = (inv) => {
    return Math.min(
      inv.wood,
      inv.clay)
  }
  getAffordableCities = (inv) => {
    const rocks = Math.floor(inv.rocks / 3);
    const wheat = Math.floor(inv.wheat / 2);

    return Math.min(rocks, wheat)
  }
  getAffordableDev = (inv) => {
    return Math.min(
      inv.rocks,
      inv.sheep,
      inv.wheat)
  }

  isInventoryEmpty = (inv) => {
    return inv.wood>0&&inv.rocks>0&&inv.sheep>0&&inv.wheat>0&&inv.clay>0
  }
}

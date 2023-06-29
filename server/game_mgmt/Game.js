import { Board } from "./Board.js"
import { TurnSystem } from "./TurnSystem.js"
import { townHarvest } from "./helpers/constants.js"

export class Game {
    constructor(id, players) {
        this.roomId = id
        this.players = {}
        
        for (let player of players) {
            this.players[player.id] = {     // TODO: replace with Player object
                id: player.id,
                color: player.color,
                username: player.username,
                inventory: {
                    wood: 0,
                    clay: 0,
                    sheep: 0,
                    wheat: 0,
                    rocks: 0
                },
                roads: [],
                towns: [],
                cities: [],
                dev: [],
                points: 0,
                awards: []
            }
        }
    }
    
    gameInitialise = () => {
        this.turnSystem = new TurnSystem(this.players)
        this.board = new Board(this.players)
        console.log(this.players)
        console.log('game created')
    }

    getGameState = () => {
        return {
            board: this.board,
            turn: this.turnSystem,
            players: this.players
        }
    }

    // harvest is handled here
    // should work on temp arrays TODO GENERALLY
    diceRolled = (diceValue) => {
        // for each player
        for (let player of this.players) {
            // for each of their town
            for (let town of player.towns) {
                // id of the tiles I would be harvesting from
                for (let tileToBeHarvested of townHarvest[town]) {
                    // if the tile has the same value as the dice
                    if (this.board.getTileValue(tileToBeHarvested) === diceValue) {
                        this.harvest(tileToBeHarvested, player.id)
                    }
                }
            }
        }
    }

    harvest = (tileId, player_id) => {
        // add the resource to their inventory
        let harvestResource = this.board.getTileResource(tileId)
        this.players[player_id].inventory[harvestResource] += 1
        console.log(`Player ${player_id} harvested ${harvestResource} with total of ${this.players[player_id].inventory[harvestResource]}`)
    }


    // interaction with board
    getAvailableSpots = (player_id) => {
        return this.board.getAvailableSpots(player_id)
    }
    getAvailableRoads = (player_id) => {
        return this.board.getAvailableRoads(player_id)
    }
    getAvailableHarvestSpots = (player_id) => {
        return this.players[player_id].towns;
    }

    // when a player selects a spot/road/harvest spot (on early game)
    selectedTown = (town, player_id) => {
        // spawn town on board (graph)
        this.board.spawnTown(town, player_id)

        // add town to player's inventory
        this.players[player_id].towns.push(town)
    }

    selectedRoad = (road, player_id) => {
        // spawn road on board (graph)
        this.board.spawnRoad(road.from, road.to, player_id)

        // add road to player's inventory
        this.players[player_id].roads.push(road)
    }

    selectedHarvestSpot = (spot, player_id) => {
        // harvest the spot
        for (let tile of townHarvest[spot]) {
            console.log(`Player ${player_id} is harvesting tile ${tile}`)
            this.harvest(tile, player_id)
        }
    }

}
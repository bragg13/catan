import { Board } from "./Board.js"
import { TurnSystem } from "./TurnSystem.js"

export class Game {
    constructor(id, players) {
        this.roomId = id
        this.players = []
        
        for (let player of players) {
            this.players.push({     // TODO: replace with Player object
                id: player.id,
                color: player.color,
                username: player.username,
                inventory: [],
                roads: [],
                towns: [],
                cities: [],
                dev: [],
                points: 0,
                awards: []
            })
        }
    }
    
    gameInitialise = () => {
        this.turnSystem = new TurnSystem(this.players)
        this.board = new Board(this.players)
        console.log('game created')
    }

    getGameState = () => {
        return {
            server_board: this.board,
            server_turn: this.turnSystem,
            server_players: this.players        // TODO: might be redundant
        }
    }


    // interaction with board
    getAvailableSpots = (player_id) => {
        return this.board.showAvailableSpots(player_id)
    }
    getAvailableRoads = (player_id) => {this.board.graph.showAvailableRoads(player_id)}

    selectedTown = (player, town) => {
        this.board.spawnTown(town, player)
        this.turnSystem.nextInitialTurn()
    }
    selectedRoad = (player, road) => {
        this.board.spawnRoad(road, player)
        this.turnSystem.nextInitialTurn()
    }
}
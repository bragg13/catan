import { Board } from "./Board.js"

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
        this.turn = {
            round: 0,
            player: null
        }
        
        this.board = new Board(this.players)
        console.log(this.turn)
        console.log('game created')
    }

    getGameState = () => {
        return {
            server_board: this.board,
            server_turn: this.turn,
            server_players: this.players        // TODO: might be redundant
        }
    }
}
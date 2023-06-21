import { Socket } from "socket.io"
import { io } from "../index.js"
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
                built: [],   // ids of things built
                points: 0,
                awards: [],
            })
        }
    }
    
    gameInitialise = () => {
        this.turn = 0
        this.background = 'skyblue'
        
        this.board = new Board(this.players)
        
        console.log('game created')
    }

    getGameState = () => {
        return {
            server_board: this.board,
            server_bg: this.background,
            server_players: this.players        // TODO: might be redundant
        }
    }
}
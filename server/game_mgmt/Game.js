import { Socket } from "socket.io"
import { io } from "../index.js"
import { Board } from "./Board.js"

export class Game {
    constructor(id, name, players) {
        this.roomId = id
        this.roomName = name
        this.background = 'skyblue'
        
        // init game components
        this.turn = 0
        this.players = []
        for (let player of players) {
            this.players.push({     // TODO: replace with Player object
                id: player.id,
                username: player.username,
                inventory: [],
                built: [],   // ids of things built
                points: 0,
                awards: [],
            })
        }
        this.board = new Board(this.players)

        console.log('game created')

        // notify players that the game started
        this.update('GAME_STARTED', {})

        io.to(this.roomId).emit('game_init', {
            server_board: this.board,
            server_bg: this.background,
            server_players: this.players        // TODO: might be redundant
        })

        // subscribe to player updates
        io.sockets.on('client_updates', data => {
            handleClientUpdate(data)
        })

        console.log('bounds to clients')

        // // first update
        // this.update()

    }

    // CLIENT UPDATES
    handleClientUpdate = (data) => {
        console.log('comng from client:')
        console.log(data)
    }

    update = (event, data) => {
        io.to(this.roomId).emit('msg_from_server', {
            // timestamp: new Date().toUTCString(),
            event: event,
            data: data
        })
    }

    gameUpdate = (event, data) => {
        io.to(this.roomId).emit('game_update_from_server', {
            // timestamp: new Date().toUTCString(),
            event: event,
            data: data
        })
    }

    updatePlayer = (socketId, event, data) => {
        io.to(socketId).emit('msg_from_server', {
            // timestamp: new Date().toUTCString(),
            event: event,
            data: data
        })
    }
}
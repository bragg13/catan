import { Socket } from "socket.io"
import { io } from "../index.js"

export class Game {
    constructor(id, name, players) {
        this.roomId = id
        this.roomName = name

        // init game components
        this.turn = 0
        this.board = new Board()
        this.players = []
        for (let player of players) {
            this.players.push({
                id: player.id,
                username: player.username,
                inventory: [],
                built: [],   // ids of things built
                points: 0,
                awards: [],
            })
        }
        console.log('game created')

        // notify players that the game started
        this.update('GAME_STARTED', {
            board: this.board,
        })

        // subscribe to player updates
        io.sockets.on('client_updates', data => {
            console.log(data)
        })

        console.log('bounds to clients')


        // // first update
        // this.update()

    }

    update = (event, data) => {
        io.to(this.roomId).emit('msgs_from_server', {
            timestamp: new Date().toUTCString(),
            event: event,
            data: data
        })
    }

    updatePlayer = (socketId, event, data) => {
        io.to(socketId).emit('msgs_from_server', {
            timestamp: new Date().toUTCString(),
            event: event,
            data: data
        })
    }
}
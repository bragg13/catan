import { Game } from '../game_mgmt/Game.js'
import { io } from '../index.js'

export class Room {
    constructor(id, maxPlayers, name) {
        this.id = id
        this.maxPlayers = maxPlayers
        this.name = name

        this.players = []
        this.gameStatus = 'lobby' // | ready | game

        this.game = null
    }

    /**
     * Adds player to the room
     * @param {Object} player The player to be pushed
     */
    pushPlayer = (player) => {
        this.players.push(player)
    }

    /**
     * Checks if the numbers of players is enough to start the game
     * @returns if the game is ready to start
     */
    checkIsReady = () => {
        if (this.players.length === this.maxPlayers) {
            this.gameStatus = 'ready'
            this.game = new Game(this.id, this.name, this.players)
        }
    }

    /**
     * Adds player to the room and emits related information events
     * @param {Object} player The player who just joined
     * @param {Socket} socket The socket related to the player
     */
    newPlayerJoined = (player, socket) => {
        // add player to room    
        this.pushPlayer(player)     // virtual room 
        socket.join(this.id)        // socket room

        // let all in the lobby know
        io.to(this.id).emit('msg_from_server', {
            message: `${player.username} joined the room`,
            event: 'NEW_PLAYER',
            room: {
                roomId: this.id,
                maxPlayers: this.maxPlayers,
                players: [...this.players]
            }
        })
    }
}
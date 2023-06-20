import { Game } from '../game_mgmt/Game.js'
import { io } from '../index.js'

export class Room {
    constructor(id, maxPlayers) {
        this.id = id
        this.maxPlayers = maxPlayers

        this.players = []
        this.gameStatus = 'lobby'

        this.game = null
    }

    joinRoom = (player) => {
        this.players.push(player)
        io.sockets.sockets.get(player.id).join(this.id)
        io.sockets.sockets.get(player.id).emit('playerInfo', {msg: 'playerInfo', ...player})
        io.to(this.id).emit('roomJoined', {msg: 'roomJoined', roomId: this.id, roomMaxPlayers: this.maxPlayers, players: this.players})
    }

    startGame = () => {
        this.gameStatus = 'started'

        this.game = new Game(this.id, this.players)
        this.game.gameInitialise()

        const initialGameState = this.game.getGameState()

        // emit initial game state to room
        io.to(this.id).emit('gameInitialised', {msg: 'gameInitialised', ...initialGameState})

        // subscribe to player updates
        this.players.forEach(player => {
            io.sockets.sockets.get(player.id)
            .on('playerUpdate', (updateData) => this.processPlayerUpdate(updateData))
        })
    }

    processPlayerUpdate = (playerUpdate) => {
        console.log(playerUpdate)
    }
}
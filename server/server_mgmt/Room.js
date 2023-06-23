import { Game } from '../game_mgmt/Game.js'
import { io } from '../index.js'

export class Room {
    constructor(id, maxPlayers) {
        this.id = id
        this.maxPlayers = maxPlayers

        this.players = []
        this.playersReady = []
        this.gameStatus = 'lobby'

        this.game = null
    }

    joinRoom = (player) => {
        this.players.push(player)
        io.sockets.sockets.get(player.id).join(this.id)
        io.sockets.sockets.get(player.id).emit('playerInfo', {msg: 'playerInfo', ...player})
        io.to(this.id).emit('roomJoined', {msg: 'roomJoined', roomId: this.id, roomMaxPlayers: this.maxPlayers, players: this.players})
    }

    createGame = () => {
        this.gameStatus = 'created'

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
        switch(playerUpdate.msg) {
            case 'clientReady':
                this.handleClientReady(playerUpdate)
                break;
            
            case 'initialTurn':
                this.nextInitialTurn(playerUpdate)
                break;
            
            default:
                break;
        }
    }

    handleClientReady = (playerId) => {
        this.playersReady.push(playerId)
        if (this.playersReady.length === this.players.length) {
            this.gameStatus = 'started'
            this.startGame()
        }
    }

    nextInitialTurn = () => {
        
    }

    startGame = () => {
        let data = {}
        
        // turn
        this.game.turn.player = this.players[0].id
        data.player = this.game.turn.player

        // available spots

        // available roads

        io.to(this.id).emit('initialTurn', data)
    }
}
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
                console.log('[SERVER] Room - client ready');
                this.handleClientReady(playerUpdate)
                break;

            case 'selectedTown':
                console.log(`[SERVER] Room - Player ${playerUpdate.from} has selected a town`)    
                this.game.selectedTown(playerUpdate.from, playerUpdate.selectedTown)
                break;
            
            case 'selectedTown':
                console.log(`[SERVER] Room - Player ${playerUpdate.from} has selected a road`)    
                this.game.selectedRoad(playerUpdate.from, playerUpdate.selectedRoad)
                break;

            case 'turnDone':
                console.log('[SERVER] Room - turn done');
                break;

            default:
                break;
        }
    }

    handleClientReady = (playerId) => {
        this.playersReady.push(playerId)
        if (this.playersReady.length === this.players.length) {
            this.gameStatus = 'started'
            console.log('[SERVER] Room - sending early game update')

            let data = {
                turnPlayer: this.game.turnSystem.player,
                availableSpots: this.game.getAvailableSpots(this.game.turnSystem.player),
                availableRoads: null
            }

            io.to(this.id).emit('earlyGameUpdate', data)
        }
    }
}
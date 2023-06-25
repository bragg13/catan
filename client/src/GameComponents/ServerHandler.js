export class ServerHandler {
    constructor(socket) {
        this.socket = socket
    }

    updateServer = (updateData) => {
        this.socket.emit('playerUpdate', {from: this.socket.id, ...updateData})
    }

}
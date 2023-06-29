export class ServerHandler {
    constructor(socket) {
        this.socket = socket
    }

    updateServer = (msg, updateData = null) => {
        this.socket.emit('playerUpdate', {from: this.socket.id, msg, updateData})
    }

}
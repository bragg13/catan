export class Board {
    constructor(server_board) {
        this.tiles = [...server_board.tiles]
        this.players = server_board.players
    }
}
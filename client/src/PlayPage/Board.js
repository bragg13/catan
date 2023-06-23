export class Board {
    constructor(server_board) {
        this.tiles = [...server_board.tiles]
        this.graph = server_board.graph
        this.players = server_board.players
    }

    spawnTown = (spot_id, player_id) => {
        this.graph.buildSpot(spot_id, player_id)
    }
    spawnRoad = (from, to, player_id) => {
        this.graph.buildRoad(from, to, player_id)
    }

    showSelectableSpots = () => {

    }
}
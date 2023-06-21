// const values = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]
// const resourceTypes = [
//     "sheep", "sheep", "sheep", "sheep",
//     "wood", "wood", "wood", "wood",
//     "wheat", "wheat", "wheat", "wheat",
//     "clay", "clay", "clay",
//     "rocks", "rocks", "rocks", "bandits"
// ]

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
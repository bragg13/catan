export class Graph {
    constructor() {
        this.spots = {};
        this.roads = {};
    }

    addSpot = (id) => {
        this.spots[id] = null
        this.roads[id] = {}
    }

    // for the way I created the coordinates, need just this
    addRoad = (from, to, road_id) => {
        this.roads[from][to] = {player: null, id: road_id}
    }

    buildSpot = (spot_id, player_id) => {
        this.spots[spot_id] = player_id

        // set adjacents to unbuildable
        const adjs = this.roads[spot_id]
        for (let adj of Object.keys(adjs)) {
            this.spots[adj] = 'not_buildable'
        }
    }

    buildRoad = (from, to, player_id) => {
        this.roads[from][to].player = player_id
        this.roads[to][from].player = player_id
    }

    print = () => {
        let road;
        for (let node of Object.keys(this.roads)) {
            console.log(`Node: ${node} (built by ${this.spots[node]})`)
            for (let to of Object.keys(this.roads[node])) {
                road = this.roads[node][to]
                console.log(`...has road to ${to} (built by ${road.player}, ID:${road.id})`)
            }
        }
    }

    // basically perform a BFS starting from built towns/cities
    getAvailableSpots = (player_id) => {
        // retrieve ids of towns built by player
        let playerTowns = []
        for (const [spot_id, built_by] of Object.entries(this.spots)) {
            if (built_by === player_id) playerTowns.push(spot_id)
        }


        // if no town or just one is built, (almost) all are available (1st/2nd round)
        if (playerTowns.length <= 1) {
            let buildable = []
            for (const [spot_id, built_by] of Object.entries(this.spots)) {
                if (built_by === null) buildable.push(spot_id)
            }
            return buildable
        }

        let availableSpots = []
        for (let town of playerTowns) {
            let queue = []
            let explored = {}
            explored[town] = true
            queue.push(town)

            while (queue.length > 0) {
                let t = queue.pop()
                explored[t] = true

                // check the town
                if (this.spots[t] === null) availableSpots.push(t)

                // check adjacents
                for (let adj of Object.keys(this.roads[t])) {
                    if (!explored[adj]) {
                        // se la strada è mia -> queue
                        if (this.roads[t][adj].player === player_id) {
                            queue.push(adj)
                        }

                    }
                }
            }
        }
        return availableSpots
    }


    getAvailableRoads = (player_id) => {
        // list all the spots I could build a road from
        let playerTowns = []
        for (const [spot_id, built_by] of Object.entries(this.spots)) {
            if (built_by === player_id) playerTowns.push(spot_id)
        }

        let availableRoads = []
        for (let town of playerTowns) {
            let queue = []
            let explored = {}
            explored[town] = true
            queue.push(town)

            while (queue.length > 0) {
                let t = queue.pop()
                explored[t] = true

                // check adjacents
                for (let adj of Object.keys(this.roads[t])) {
                    if (!explored[adj]) {
                        // se la strada è libera -> available
                        if (this.roads[t][adj].player === null) {
                            availableRoads.push({from: t, to: adj, id: this.roads[t][adj].id})
                        }

                        // se la strada è mia -> queue
                        if (this.roads[t][adj].player === player_id) {
                            queue.push(adj)
                        }

                    }
                }
            }
        }
        console.log(availableRoads)
        return availableRoads
    }
}
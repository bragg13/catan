import { Graph } from "./graph/Graph.js"
import { roadConnections } from "./helpers/coords.js"
import {resourceTypes, values} from './helpers/constants.js'

export class Board {
    constructor() {
        this.tiles = []
        this.graph = null

        // create the board
        this.createTiles()
        this.createGraph()
    }

    createGraph() {
        this.graph = new Graph()
        let to, id;

        // add nodes
        for (let tile = 1; tile <= 54; tile++) {
            this.graph.addSpot(tile)

            // add roads
            for (let road of roadConnections[tile]) {
                // road = { 4: '1' }, { 5: '2' }
                to = Object.keys(road)[0]
                id = road[to]
                this.graph.addRoad(tile, to, id)
            }
        }
    }

    createTiles = () => {
        let _values = values.sort(() => Math.random() - 0.5);
        let _resourceTypes = resourceTypes.sort(() => Math.random() - 0.5);
        let valueIndex = 0

        for (let i = 0; i < _resourceTypes.length; i++) {
            let value = (_resourceTypes[i] === "bandits") ? 7 : _values[valueIndex++];
            this.tiles.push({
                resource: _resourceTypes[i],
                value: value,
                id: i + 1
            })
        }
    }

    // getRandom = (min, max) => {
    //     return Math.random() * (max - min) + min;
    // }

    // shuffleTilesAndValues = () => {
    //     let _values = values.sort(() => Math.random() - 0.5);
    //     let _resourceTypes = resourceTypes.sort(() => Math.random() - 0.5);

    //     for (let i = 0; i < this.tiles.length; i++) {
    //         let value = (_resourceTypes[i] === "bandits") ? 7 : _values[i];
    //         this.tiles[i].resource = _resourceTypes[i]
    //         this.tiles[i].value = value
    //     }
    // }

    getAvailableSpots = (player_id) => {
        return this.graph.getAvailableSpots(player_id)
    }
    getAvailableRoads = (player_id) => {
        return this.graph.getAvailableRoads(player_id)
    }

    spawnTown = (spot_id, player_id) => {
        console.log(spot_id, player_id)
        this.graph.buildSpot(spot_id, player_id)
    }
    spawnRoad = (from, to, player_id) => {
        this.graph.buildRoad(from, to, player_id)
    }
}
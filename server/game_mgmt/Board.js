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

        // add nodes
        for (let tile = 1; tile <= 54; tile++) {
            this.graph.addSpot(tile)

            // add roads
            for (let to of roadConnections[tile]) {
                this.graph.addRoad(tile, to)
            }
        }
    }

    createTiles = () => {
        let _values = values.sort(() => Math.random() - 0.5);
        let _resourceTypes = resourceTypes.sort(() => Math.random() - 0.5);

        for (let i = 0; i < _resourceTypes.length; i++) {
            let value = (_resourceTypes[i] === "bandits") ? 7 : _values[i];
            this.tiles.push({
                resource: _resourceTypes[i],
                value: value,
                id: i + 1
            })
        }
    }

    getRandom = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    shuffleTilesAndValues = () => {
        let _values = values.sort(() => Math.random() - 0.5);
        let _resourceTypes = resourceTypes.sort(() => Math.random() - 0.5);

        for (let i = 0; i < this.tiles.length; i++) {
            let value = (_resourceTypes[i] === "bandits") ? 7 : _values[i];
            this.tiles[i].resource = _resourceTypes[i]
            this.tiles[i].value = value
        }
    }

    showAvailableSpots = (player_id) => {
        return this.graph.showAvailableSpots(player_id)
    }

    spawnTown = (spot_id, player_id) => {
        this.graph.buildSpot(spot_id, player_id)
    }
    spawnRoad = (from, to, player_id) => {
        this.graph.buildRoad(from, to, player_id)
    }
}
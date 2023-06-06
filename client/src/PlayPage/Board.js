import * as THREE from 'three'
import { hexCoords, roadCoords, spotCoords, roadConnections } from "../assets/coords.js"
import { Player } from './Player.js'

const values = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]
const resourceTypes = [
    "sheep", "sheep", "sheep", "sheep",
    "wood", "wood", "wood", "wood",
    "wheat", "wheat", "wheat", "wheat",
    "clay", "clay", "clay",
    "rocks", "rocks", "rocks", "bandits"
]

export class Board {
    constructor(server_board) {
        this.tiles = [...server_board.tiles]
        this.graph = server_board.graph
        this.players = server_board.players

        // create the board
        this.createTiles()
        // this.createGraph()
    }

    // createGraph() {
    //     this.graph = new Graph()

    //     // add nodes
    //     for (let tile = 1; tile <= 54; tile++) {
    //         this.graph.addSpot(tile)

    //         // add roads
    //         for (let to of roadConnections[tile]) {
    //             this.graph.addRoad(tile, to)
    //         }
    //     }
    // }


    spawnTown = (spot_id, player_id) => {
        this.graph.buildSpot(spot_id, player_id)
    }
    spawnRoad = (from, to, player_id) => {
        this.graph.buildRoad(from, to, player_id)
    }


    showSelectableSpots = () => {

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
}
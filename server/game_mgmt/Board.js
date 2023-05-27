const values = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]
const resourceTypes = [
    "sheep", "sheep", "sheep", "sheep",
    "wood", "wood", "wood", "wood",
    "wheat", "wheat", "wheat", "wheat",
    "clay", "clay", "clay",
    "rock", "rock", "rock", "bandits"
]

export class Board {
    constructor() {
        // tiles
        this.tiles = Array.fill({
            id: crypto.randomUUID(),
            resource: null,
            value: 0
        }, 19)

        // spots
        this.spots = Array.fill({
            id: crypto.randomUUID(),
            playerId: null,
            harvest: [],
            // type: either town or village
        }, 54)

        // roads
        this.roads = Array.fill({
            id: crypto.randomUUID(),
            playerId: null,
            // part of longest?
        }, 74)

        this.shuffleTilesAndValues()

        console.log('board created')
        console.log(JSON.stringify(this.tiles))

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
}
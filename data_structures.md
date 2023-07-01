# Data structures - SERVER

## Room (creates the game, handles c/s interaction with sockets)

```js
Room: {
    id: String,
    maxPlayers: Number,
    players: Array of PlayerID,
    playersReady: Array of String,
    gameStatus: String,
    game: Game
}

PlayerID: String
```

## Game (getGameState returns this object without roomId)

```js
{
    roomId: String,
    players: Players,
    turnSystem: TurnSystem,
    board: Board
}
```

## Board (handles the graph and tiles setting)

```js
Board: {
    tiles: Array of Tile,
    graph: Graph
}

Tile: {
    id: Number,
    value: Number,
    resource: String
}

Graph: {
    spots: Object,
    roads: Object
}
```

## TurnSystem

```js
TurnSystem: {
    playerOrder: Array of PlayerID,
    playerOrderIndex: Number,
    player: PlayerID,
    action: TurnAction,
    earlyGameSteps: {
        PlayerID: Number
    },
    round: Number
}

TurnAction: String
```

## Players

```js
{
    playerID: Player
}

Player: {
    id: PlayerID,
    color: String,
    username: String,
    inventory: {
        wood: Number,
        clay: Number,
        sheep: Number,
        wheat: Number,
        rocks: Number
    },
    roads: Array of String,
    towns: Array of String,
    cities: Array of String,
    dev: Array of String,
    points: Number,
    awards: Array of Object
}

```

# Events - SERVER (sent by Room)

## LOBBY - playerInfo

```js
    msg: "playerInfo",
    id: PlayerID,
    username: String,
    color: String
```

## LOBBY - roomJoined

```js
{
    msg: "roomJoined",
    roomId: String,
    roomMaxPlayers: Number,
    players: Array of PlayerID
}
```

## LOBBY/PLAY - gameInitialised

```js
{
    msg: "gameInitialised",
    board: Board,
    turn: {
        player: PlayerID,
        action: TurnAction,
        round: Number
    },
    players: Players
}
```

## earlyGameUpdate

```js
{
    availableSpots?: Array of SpotID,
    availableRoads?: Array of RoadID,
    availableHarvestSpots?: Array of SpotID,
    turn: {
        player: PlayerID,
        action: TurnAction,
        round: Number
    },
    players: Players,
    updatedBoard: {
        msg: 'newRoad' | 'newTown',
        updatedBy: PlayerID,
        town?: SpotID,
        road?: RoadID
    }
}
```

## gameUpdate TBI

```js

```

# Events - CLIENT (sent by World/SceneHandler via ServerHandler)

```js
/*
    Every update client-side has this structure.
    Server-side, we discriminate based on the "msg" parameter
*/
{
    from: PlayerID,
    msg: String,
    updateData?: Object
}
```

## earlyGameClientReady (msg)
> updateData is null

## clientReady
> updateData is null

## selectedTown
```js
{
    selectedTown: SpotID
}
```

## selectedRoad
```js
{
    selectedRoad: RoadID
}
```

## selectedHarvestSpot
```js
{
    selectedHarvestSpot: SpotID
}
```

## diceRolled
```js
```

## turnDone
```js
```

export class TurnSystem {
    constructor(players) {
        this.playerOrder = players.map(el => el.id)
        this.playerOrderIndex = 0
        this.player = this.playerOrder[this.playerOrderIndex]

        this.isInitialTurn = true
        this.initialTurnSteps = {
            [players[0].id]: 0,
            [players[1].id]: 0,
            // [players[2].id]: 0,
            // [players[3].id]: 0,
        }

        this.round = 0
    }

    nextTurn = () => {
        if (this.checkIsInitialTurn) this.nextInitialTurn()
        else {
            console.log('normal turn')
        }
    }

    nextInitialTurn = () => {
        const turnPlayer = this.player
        this.initialTurnSteps[turnPlayer]++

        if (this.initialTurnSteps[turnPlayer] === 1 || this.initialTurnSteps[turnPlayer] === 3) {
            // time to place a road
            
        } else if (this.initialTurnSteps[turnPlayer] === 2) {
            // time to pass initial turn
        } else if (this.initialTurnSteps[turnPlayer] === 4) {
            // initial turn over for player
        }
    }

    checkIsInitialTurn = () => {
        return (this.initialTurnSteps[0] === 4) && (this.initialTurnSteps[1] === 4) 
        /*&& (this.initialTurn[2] === 2) && (this.initialTurn[3] === 2)*/
    }
}
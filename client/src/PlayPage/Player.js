export class Player {
    constructor(id) {
        this.id = id
        this.color = Math.random() > 0.5 ? 'red' : 'green'
    }
}
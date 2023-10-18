import { Room } from "./Room.js"
const rooms = {}  // on redis later
const idk = ['a', 'b', 'c', 'd', 'e', 'f', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export const generateRandomColor = () => {
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += idk[Math.floor(Math.random() * idk.length)]
    }
    return color
}


export const onConnection = socket => {
    socket.on('join_room', data => {
        let { username, roomId } = data
        const player = {
            id: socket.id, 
            username: username,
            color: generateRandomColor()
        }

        // join existing room
        if (roomId in rooms && rooms[roomId].canJoin) {
                rooms[roomId].joinRoom(player)

        // create new room (also if roomID is full)
        } else {
            if (roomId in rooms && rooms[roomId].canJoin === false) 
                roomId = roomId.concat(roomId)

            let room = new Room(roomId, 2)
            rooms[roomId] = room
            rooms[roomId].joinRoom(player)
        }

        // check if room is full, start the game
        if (rooms[roomId].players.length === rooms[roomId].maxPlayers){
            rooms[roomId].createGame()
            rooms[roomId].canJoin = false;
        }

    })

    // deletes the room even if only one player leaves TODO.
    socket.on('disconnecting', () => {
        // get roomId
        const _rooms = [...socket.rooms]
        const roomId = _rooms.filter(el => el !== socket.id)

        console.log(`user disconnecting ${socket.id} from ${roomId}`)

        delete rooms[roomId]

    })

} 
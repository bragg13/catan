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
    console.log(`user connected: ${socket.id}`)

    socket.on('join_room', data => {
        const { username, roomId } = data
        const player = {
            id: socket.id, 
            username: username, 
            color: generateRandomColor()
        }

        if (roomId in rooms) {
            // join existing room
            if (rooms[roomId].players.length < rooms[roomId].maxPlayers) {
                rooms[roomId].joinRoom(player)
            }

        } else {
            // create new room
            let room = new Room(roomId, 2)
            rooms[roomId] = room
            rooms[roomId].joinRoom(player)
        }

        if (rooms[roomId].players.length === rooms[roomId].maxPlayers){
            rooms[roomId].createGame()
        }

    })

    // socket.on('disconnecting', () => {
    //     // get roomId
    //     const _rooms = [...socket.rooms]
    //     const roomId = _rooms.filter(el => el !== socket.id)

    //     console.log(`user disconnecting ${socket.id} from ${roomId}`)

    //     // rooms[roomId].playerLeft(socket.id)

    // })

} 
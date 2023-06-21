import { Room } from "./Room.js"
const rooms = {}  // on redis later
let colors = ['#f44336', '#3f51b5', '#4CAF50', '#ff5722']

export const onConnection = socket => {
    console.log(`user connected: ${socket.id}`)

    socket.on('join_room', data => {
        const { username, roomId } = data
        const player = {id: socket.id, username: username, color: colors.pop()}

        if (roomId in rooms) {
            // join existing room
            if (rooms[roomId].players.length < rooms[roomId].maxPlayers) {
                rooms[roomId].joinRoom(player)
                console.log(`Player ${player.username} joined room ${roomId}`)
                // socket.emit('roomJoined', {roomId, player})
            }

        } else {
            // create new room
            let room = new Room(roomId, 2)
            rooms[roomId] = room
            rooms[roomId].joinRoom(player)
            console.log(`Room ${roomId} created by ${player.username}`)
            // socket.emit('roomCreated', {roomId})
        }

        if (rooms[roomId].players.length === rooms[roomId].maxPlayers){
            rooms[roomId].startGame()
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
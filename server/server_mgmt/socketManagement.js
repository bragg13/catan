import { Room } from "./Room.js"
import { Player } from "../server_mgmt/Player.js"
const rooms = {}  // on redis later

export const onConnection = socket => {
    console.log(`user connected: ${socket.id}`)

    socket.on('join_room', data => {
        const { username, roomId } = data
        const player = new Player(socket.id, username, true)

        // room exists
        if (roomId in rooms) {
            // room is full
            // if (rooms[roomId].isFull()) {
            //     console.log(`room ${roomId} is full`)
            //     socket.emit('msg_from_server', {
            //         message: `Room ${roomId} is full`,
            //     })

            // } else {
            // push player to room
            rooms[roomId].newPlayerJoined(player, socket)
            console.log(`player ${player.username} pushed to room ${roomId}`)

            // }
        } else {
            // create new room
            let room = new Room(roomId, 2, `ROOM-${roomId}`)
            rooms[roomId] = room
            rooms[roomId].newPlayerJoined(player, socket)
            console.log(`player ${player.username} pushed to (new) room ${roomId}`)

        }

        // // check if game ready
        rooms[roomId].checkIsReady()

    })

    socket.on('disconnecting', () => {
        // get roomId
        const _rooms = [...socket.rooms]
        const roomId = _rooms.filter(el => el !== socket.id)

        console.log(`user disconnecting ${socket.id} from ${roomId}`)

        // rooms[roomId].playerLeft(socket.id)

    })

} 
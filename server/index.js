import express from "express"
import http from 'http'
import cors from 'cors'
import { Server } from "socket.io"
import { onConnection } from "./server_mgmt/socketManagement.js"

const app = express()
app.use(cors());

// HTTP server req handler
// app.get('/ciao', (req, res) => {
//     res.send('ciao!')
// })

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

const port = process.env.PORT || 4000

io.on('connection', socket => onConnection(socket))

server.listen(port, () => console.log('Server is running on port 4000'));

export {
    io,
    server
}
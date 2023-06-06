import { useEffect, useState } from "react";
import { Paper, Box, Typography, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function LobbyPage({ socket }) {
    const [players, setPlayers] = useState([])
    const [roomInfo, setRoomInfo] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        socket.on('msg_from_server', (data) => {
            console.log(data)
            if (data.event === 'NEW_PLAYER') {
                console.log('new player')
                setPlayers(data.room.players)
                if (roomInfo === undefined)
                    setRoomInfo({
                        roomId: data.room.roomId,
                        maxPlayers: data.room.maxPlayers
                    })
            }

            if (data.event === 'GAME_STARTED') {
                console.log('game started')
                navigate('/play')

            }
        });

    }, [socket]);


    return (
        <>
            {roomInfo === undefined
                ? (
                    <Box alignSelf={'center'} textAlign={'center'}>
                        <h1>Loading...</h1>
                        <CircularProgress />
                    </Box>
                )
                : (
                    <Paper elevation={3} sx={{ margin: 'auto', marginTop: '50px', width: '50%' }}>
                        <Typography textAlign={'center'} variant={'h5'}>
                            ROOM-{roomInfo.roomId}
                        </Typography>
                        <Typography textAlign={'center'} >
                            Waiting for {roomInfo.maxPlayers - players.length} more players to connect...
                        </Typography>
                        <Box>
                            <ul>
                                {players.map(el => {
                                    console.log(el)
                                    return (
                                        <li>
                                            <Typography>{el.username}</Typography>
                                        </li>
                                    )
                                })}

                            </ul>
                        </Box>
                    </Paper>
                )
            }
        </>
    );
}
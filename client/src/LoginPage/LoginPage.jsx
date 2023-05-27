import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom'

export default function LoginPage({ socket }) {
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();

    // controls over username and roomId
    socket.emit('join_room', {
      username,
      roomId
    })

    navigate('/lobby', { replace: true })

  };



  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="roomId"
            label="Room ID"
            type="roomId"
            id="roomId"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Play
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
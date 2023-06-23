import { useEffect, useState } from "react";
import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LobbyPage({ socket }) {
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState(null)
  const [roomInfo, setRoomInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // display lobby waiting info
    socket.on("roomJoined", (data) => {
      setRoomInfo((prev) => ({
        maxPlayers: data.roomMaxPlayers,
        id: data.roomId,
      }));
      setPlayers((prev) => [...data.players]);
    });

    // set player's info
    socket.on("playerInfo", (data) => {
        setPlayer({...data})
      });

    // when the game starts
    socket.on("gameInitialised", (data) => {
        navigate('/play', {state: {initialGameState: data}})
      });
      
  }, [socket]);

  return (
    <>
      {roomInfo !== null && (
        <Paper
          elevation={3}
          sx={{ margin: "auto", marginTop: "50px", width: "50%" }}
        >
          <h1 style={{textAlign: 'center'}}>Hey! Aspetta qui! c:</h1>
          <Typography textAlign={"center"} variant={"h5"}>
            ROOM-{roomInfo.id}
          </Typography>
          <Typography textAlign={"center"}>
            Waiting for {roomInfo.maxPlayers - players.length} more player
            {roomInfo.maxPlayers - players.length === 1 ? "" : "s"} to
            connect...
          </Typography>
          <Box>
            <Typography>Players currently in the lobby:</Typography>
            <ul>
              {players.map((el) => {
                return (
                  <li key={crypto.randomUUID()}>
                    <Typography fontWeight={(el.username===player.username) ? 'bold': ''} >{el.username}</Typography>
                  </li>
                );
              })}
            </ul>
          </Box>
        </Paper>
      )}
    </>
  );
}

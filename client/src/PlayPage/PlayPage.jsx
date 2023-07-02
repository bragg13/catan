import { useEffect, useRef, useState } from "react";
import { World } from "../GameComponents/World";
import { useLocation } from "react-router-dom";
import { MainContainer } from "../GUI";
import { Button } from "@mui/material";
import { inventory } from "../helpers/GUI_helpers";

export default function PlayPage({ socket }) {
  const world = useRef(null);
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [turn, setTurn] = useState(null);
  const [availableActions, setAvailableActions] = useState([]);

  useEffect(() => {
    const initialGameState = location.state.initialGameState;

    // initialize the world
    world.current = new World("three-js-canvas", socket);
    world.current.initialize(initialGameState);

    // initialize the GUI
    setPlayers(initialGameState.players);
    setTurn(initialGameState.turn);
    setCurrentPlayer(initialGameState.players[socket.id]);
    setLoaded(true);
  }, [location.state.initialGameState, socket]);

  // listen to server updates
  useEffect(() => {
    if (loaded) {
      socket.on("earlyGameUpdate", (updateData) =>
        processEarlyGameUpdate(updateData)
      );
      socket.on("gameUpdate", (updateData) => processGameUpdate(updateData));
    }
  }, [socket, loaded]);

  const processEarlyGameUpdate = (gameUpdate) => {
    console.log("gameUpdate", gameUpdate);

    // update the board
    world.current.updateScene({
      ...gameUpdate.updatedBoard,
    });

    // update the GUI - TODO: might just use setState
    setTurn(gameUpdate.turn);
    setPlayers((prevPlayers) => {
      return { ...prevPlayers, ...gameUpdate.players };
    });
    setCurrentPlayer((prevPlayer) => {
      return { ...prevPlayer, ...gameUpdate.players[socket.id] };
    });

    // play the turn (if it is mine)
    if (gameUpdate.turn.player === socket.id && gameUpdate.turn.round !== 0) {
      world.current.handleEarlyGame(currentPlayer, { ...gameUpdate });
    }
  };

  const processGameUpdate = (gameUpdate) => {
    console.log(gameUpdate);

    // update the board
    world.current.updateScene({ ...gameUpdate.updatedBoard });

    // update the GUI - TODO: might just use setState
    setTurn(gameUpdate.turn);
    setPlayers((prevPlayers) => {
      return { ...prevPlayers, ...gameUpdate.players };
    });
    setCurrentPlayer((prevPlayer) => {
      return {
        ...prevPlayer,
        ...gameUpdate.players[socket.id],
        inventory: {
          ...gameUpdate.players[socket.id].inventory,
        },
      };
    });
    setAvailableActions((prevActions) => {
      return [...prevActions, ...gameUpdate.availableActions];
    });

    console.log("currentPlayer", currentPlayer);

    // play the turn (if it is mine)
    if (gameUpdate.turn.player === socket.id) {
      world.current.handleGame(currentPlayer, { ...gameUpdate });
    }
  };

  const handleCrafting = () => {
    world.current.handleCrafting();
  };

  const handleDiceRoll = () => {
    world.current.handleDiceRoll();
  };

  const handlePassTurn = () => {
    world.current.handlePassTurn();
  };

  return (
    <div id="container">
      <canvas id="three-js-canvas" />
      <MainContainer
        handleCrafting={handleCrafting}
        handleDiceRoll={handleDiceRoll}
        handlePassTurn={handlePassTurn}
        players={players}
        currentPlayer={
          availableActions.length > 0
            ? {
                ...currentPlayer,
                availableActions: availableActions,
              }
            : {
                ...currentPlayer
              }
        }
        turn={turn}
      />
    </div>
  );
}

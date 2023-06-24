import { useEffect, useRef, useState } from "react";
import { World } from "./World";
import { useLocation } from "react-router-dom";
import { MainContainer } from "../GUI";

export default function PlayPage({ socket }) {
  const world = useRef(null);
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [turn, setTurn] = useState(null);

  // component initialisation
  useEffect(() => {
    world.current = new World("three-js-canvas", socket);
    const initialGameState = location.state.initialGameState;

    const server_info = {
      server_board: initialGameState.server_board,
      server_turn: initialGameState.server_turn,
      server_players: initialGameState.server_players,
    };

    world.current.initialize(server_info);
    world.current.animate();

    // GUI handling
    setPlayers(initialGameState.server_players);
    setCurrentPlayer(
      initialGameState.server_players.filter((el) => el.id === socket.id)[0]
    );
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      socket.on("serverUpdate", (updateData) =>
        processServerUpdate(updateData)
      );
      socket.on("earlyGameUpdate", (updateData) =>
        processEarlyGameUpdate(updateData)
      );
    }
  }, [socket, loaded]);

  const processEarlyGameUpdate = (serverData) => {
    console.log(serverData);
    
    // who is playing this turn
    setTurn(serverData.turnPlayer);

    if (serverData.turnPlayer === currentPlayer.id) {
      console.log("my turn!");

      // propagate to world
      world.current.earlyGame(
        serverData.turnPlayer, // send also color?
        serverData.availableSpots,
        serverData.availableRoads
      );

      // propagate to GUI
      // ?
    } else {
      console.log("not my turn");
    }
  };

  const processServerUpdate = (updateData) => {
    console.log(updateData);

    const data = {
      // scomporre questo oggetto è inutile?
      server_board: updateData.server_board,
      server_turn: updateData.server_turn,
      server_players: updateData.server_players,
    };

    // mid game
    world.current.updateScene(data);
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
        currentPlayer={currentPlayer}
        turn={turn}
      />
    </div>
  );
}

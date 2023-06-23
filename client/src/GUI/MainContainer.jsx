import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Dice, MainMenu, Players, PassTurn } from ".";

export default function MainContainer({
  handleCrafting,
  handleDiceRoll,
  handlePassTurn,
  players,
  currentPlayer,
  turn,
}) {
  return (
    <>
      <Box height="100%" width="100%">
        <MainMenu handleCrafting={handleCrafting} />
        <Players players={players} currentPlayer={currentPlayer} />
        <Dice
          handleDiceRoll={handleDiceRoll}
          isEnabled={turn===null ? false : (turn.player === currentPlayer.id)}
        />
        <PassTurn
          handlePassTurn={handlePassTurn}
          isEnabled={turn===null ? false : (turn.player === currentPlayer.id)}
        />
      </Box>
    </>
  );
}

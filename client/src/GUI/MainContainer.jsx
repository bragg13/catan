import React from "react";
import { Box } from "@mui/material";
import { Dice, MainMenu, Players, PassTurn} from ".";

export default function MainContainer({
  handleCrafting,
  handleDiceRoll,
  handlePassTurn,
  players,
  currentPlayer,
  children,
}) {
  return (
    <>
      <Box height="100%" width="100%">
        <MainMenu handleCrafting={handleCrafting}/>
        <Players players={players} currentPlayer={currentPlayer}/>
        <Dice handleDiceRoll={handleDiceRoll} isEnabled={currentPlayer===null ? false : currentPlayer.isTurn}/>
        <PassTurn handlePassTurn={handlePassTurn} isEnabled={currentPlayer===null ? false : currentPlayer.isTurn}/>
      </Box>
      {children}
    </>
  );
}

import React from "react";
import { Box } from "@mui/material";
import { Dice, MainMenu, Players } from ".";

export default function MainContainer({
  handleCrafting,
  handleDiceRoll,
  handlePassTurn,
  players,
  children,
}) {
  return (
    <>
      <Box height="100%" width="100%">
        <Dice handleDiceRoll={handleDiceRoll} />
        <MainMenu handleCrafting={handleCrafting} />
        <Players players={players} />
      </Box>
      {children}
    </>
  );
}

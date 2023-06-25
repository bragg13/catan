import React, { useEffect, useState } from "react";
import { Alert, Box, Slide, Snackbar, Typography } from "@mui/material";
import { Dice, MainMenu, Players, PassTurn } from ".";

export default function MainContainer({
  handleCrafting,
  handleDiceRoll,
  handlePassTurn,
  players,
  currentPlayer,
  turn,
}) {

  const [openSnackbar, setOpenSnackbar] = useState(true)

  const handleClose = () => {setOpenSnackbar(false)}
  const vertical = 'top'
  const horizontal = 'center'

  function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
  }

  return (
    <>
      <Box height="100%" width="100%">
      {/* SNACKBAR */}
      {
        turn !== null &&
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openSnackbar}
            key={vertical + horizontal}
            TransitionComponent={SlideTransition}
          >
            <Alert sx={{textAlign: 'center', width: '100%'}} severity={(currentPlayer.id === turn.id) ? 'success' : 'info'}>
            {(currentPlayer.id === turn.id) 
              ? <Typography>È il <strong>tuo</strong> turno!</Typography> 
              : <Typography>È il turno di <strong>{turn.username}</strong>!</Typography>
              }
            </Alert>

            </Snackbar>
      }

      {/* GUI */}
        <MainMenu handleCrafting={handleCrafting} />
        <Players players={players} currentPlayer={currentPlayer} />
        <Dice
          handleDiceRoll={handleDiceRoll}
          isEnabled={turn === null ? false : turn.id === currentPlayer.id}
        />
        <PassTurn
          handlePassTurn={handlePassTurn}
          isEnabled={turn === null ? false : turn.id === currentPlayer.id}
        />
      </Box>
    </>
  );
}

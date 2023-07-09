import React, { useEffect, useState } from "react";
import { Alert, Box, Slide, Snackbar, Typography } from "@mui/material";
import { MainMenu, Players, PassTurn, DiceContainer } from ".";

export default function MainContainer({
  handleCrafting,
  handleDiceRoll,
  handlePassTurn,
  players,
  currentPlayer,
  turn,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const verticalTop = "top";
  const verticalBottom = "bottom";
  const horizontal = "center";

  function SlideTransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }
  function SlideTransitionUp(props) {
    return <Slide {...props} direction="up" />;
  }

  function whoseTurn() {
    return currentPlayer.id === turn.player
      ? `È il tuo turno!`
      : `È il turno di ${players[turn.player].username}!`;
  }

  function whatAction() {
    let msg = "";

    // what to do
    switch (turn.action) {
      case "town_1":
        msg += `Dove costruirai il tuo primo villaggio?`;
        break;
      case "town_2":
        msg += `Ora scegli dove costruire il secondo villaggio!`;
        break;
      case "road_1":
        msg += `Bene! E la tua prima strada?`;
        break;
      case "road_2":
        msg += `È tempo di realizzare la tua seconda strada!`;
        break;
      case "diceRoll":
        msg += `Tira i dadi!`;
        break;
      case "robber":
        msg += `Sposta il ladro!`;
        break;
      case "harvest":
        msg += `Seleziona un villaggio da cui raccogliere le prime risorse!`;
        break;
      default:
        break;
    }
    return msg;
  }

  return (
    <>
      <Box height="100%" width="100%">
        {/* SNACKBAR */}
        {turn !== null && (
          <>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={openSnackbar}
              key={verticalTop + horizontal}
              TransitionComponent={SlideTransitionDown}
            >
              <Alert
                sx={{ textAlign: "center", width: "100%" }}
                severity={currentPlayer.id === turn.player ? "success" : "info"}
              >
                {whoseTurn()}
              </Alert>
            </Snackbar>
            {currentPlayer.id === turn.player && (
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={openSnackbar}
                key={verticalBottom + horizontal}
                TransitionComponent={SlideTransitionUp}
              >
                <Alert
                  sx={{ textAlign: "center", width: "100%" }}
                  severity={
                    currentPlayer.id === turn.player ? "success" : "info"
                  }
                >
                  {whatAction()}
                </Alert>
              </Snackbar>
            )}
          </>
        )}

        {/* GUI */}
        <MainMenu
          currentPlayer={currentPlayer}
          handleCrafting={handleCrafting}
        />
        <Players players={players} currentPlayer={currentPlayer} />
        <DiceContainer
          handleDiceRoll={handleDiceRoll}
          currentPlayer={currentPlayer}
        />
        <PassTurn
          handlePassTurn={handlePassTurn}
          isEnabled={turn === null ? false : turn.id === currentPlayer.id}
        />
      </Box>
    </>
  );
}

import React from "react";
import CasinoIcon from "@mui/icons-material/Casino";

export default function Dice({handleDiceClick}) {
  return (
    <div style={{
        display: "flex",
        position: "absolute",
        zIndex: 10,
        right: "3%",
        bottom: "3%",
    }}
    onClick={handleDiceClick}
    >
      <CasinoIcon sx={{fontSize: 75}}/>
      <CasinoIcon sx={{fontSize: 75}}/>
    </div>
  );
}

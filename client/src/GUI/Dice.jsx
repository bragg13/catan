import React from "react";
import { Box, Container } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";

export default function Dice() {
  return (
    <div style={{
        display: "flex",
        position: "absolute",
        zIndex: 10,
        right: "3%",
        bottom: "3%",
    }}>
      <CasinoIcon sx={{fontSize: 100}}/>
      <CasinoIcon sx={{fontSize: 100}}/>
    </div>
  );
}

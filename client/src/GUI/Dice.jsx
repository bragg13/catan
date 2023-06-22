import React from "react";
import CasinoIcon from "@mui/icons-material/Casino";
import './GUIStyle.css'

export default function Dice({handleDiceRoll, isEnabled}) {
  return (
    <div className={`Dice-div ${isEnabled && ".GUI-disabled"}`}
    onClick={isEnabled ? handleDiceRoll : ''}
    
    >
      <CasinoIcon className="IconGUI-big" />
      <CasinoIcon className="IconGUI-big" />
    </div>
  );
}

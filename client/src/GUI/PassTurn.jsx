import React from "react";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import "./GUIStyle.css";

export default function PassTurn({ handlePassTurn, isEnabled }) {
  return (
    <div
      className={`PassTurn-div ${isEnabled ? "Clickable" : ''}`}
      onClick={isEnabled ? handlePassTurn : null}
    >
      <SkipNextIcon className={`IconGUI-big ${isEnabled ? 'Icon-animate' : ''}`} />
    </div>
  );
}

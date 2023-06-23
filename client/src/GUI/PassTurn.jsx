import React from "react";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import "./GUIStyle.css";

export default function PassTurn({ handlePassTurn, isEnabled }) {
  return (
    <div
      className={`PassTurn-div ${isEnabled && ".GUI-disabled"}`}
      onClick={isEnabled ? handlePassTurn : null}
    >
      <SkipNextIcon className="IconGUI-big" />
    </div>
  );
}

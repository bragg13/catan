import React, { useEffect } from "react";
import "./Dice.css";
import Dice from "./Dice";

export default function DiceContainer({ handleDiceRoll, currentPlayer }) {
  const [isEnabled, setIsEnabled] = React.useState(false);

  useEffect(() => {
    if (
      currentPlayer.hasOwnProperty('availableActions') &&
      currentPlayer.availableActions[0] === "diceRoll"
    )
      setIsEnabled(true);
  }, [currentPlayer]);

  return (
    <div
      className={`Dice-div`}
      onClick={isEnabled ? handleDiceRoll : null}
    >
      <Dice value={2} />
      <Dice value={2} />
    </div>
  );
}

import React, { useEffect } from "react";
import "./Dice.css";
import Dice from "./Dice";

export default function DiceContainer({ handleDiceRoll, currentPlayer }) {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [values, setValues] = React.useState({ value1: 1, value2: 1 });

  useEffect(() => {
    if (
      currentPlayer.hasOwnProperty('availableActions') &&
      currentPlayer.availableActions[0] === "diceRoll"
    )
      setIsEnabled(true);
  }, [currentPlayer]);

  const diceRolled = () => {
    setIsEnabled(false);
    const value1 = Math.floor(Math.random() * 6) + 1;
    const value2 = Math.floor(Math.random() * 6) + 1;

    handleDiceRoll(value1, value2);
    setValues({ value1, value2 })
  };

  return (
    <div
      className={`Dice-div`}
      onClick={isEnabled ? diceRolled : null}
    >
      <Dice isEnabled={isEnabled} value={values.value1} />
      <Dice isEnabled={isEnabled} value={values.value2} />
    </div>
  );
}

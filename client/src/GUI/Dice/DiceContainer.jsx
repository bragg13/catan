import React, { useEffect } from "react";
import "./Dice.css";
import Dice from "./Dice";

export default function DiceContainer({ handleDiceRoll, currentPlayer, dice }) {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [values, setValues] = React.useState(dice);

  useEffect(() => {
    setValues(dice)
    if (
      dice !== null &&        // not loading
      currentPlayer.playing &&  // player is playing
      currentPlayer.hasOwnProperty('availableActions') &&
      "diceRoll" in currentPlayer.availableActions 
    )
      setIsEnabled(true);
  }, [currentPlayer, dice]);

  const diceRolled = () => {
    setIsEnabled(false);
    const value1 = Math.floor(Math.random() * 6) + 1;
    const value2 = Math.floor(Math.random() * 6) + 1;

    handleDiceRoll(value1, value2);
    setValues({ value1, value2 });
  };

  if (values === null) return null;
  return (
    <div
      className={`Dice-div ${isEnabled ? 'Clickable' : ''}`}
      onClick={isEnabled ? diceRolled : null}
    >
      <Dice isEnabled={isEnabled} value={values.value1} />
      <Dice isEnabled={isEnabled} value={values.value2} />
    </div>
  );
}

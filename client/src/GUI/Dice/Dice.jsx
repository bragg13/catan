// Dice.js
import React, { useState } from 'react';
import './Dice.css';

import Dice1 from './src/Dice1.svg';
import Dice2 from './src/Dice2.svg';
import Dice3 from './src/Dice3.svg';
import Dice4 from './src/Dice4.svg';
import Dice5 from './src/Dice5.svg';
import Dice6 from './src/Dice6.svg';

export default function Dice ({value}) { // For simplicity, I'll assume that value prop is always between 1 and 6
  const [animate, setAnimate] = useState(true);

  const handleClick = () => {
    setAnimate(false);
  }

  /* Map value prop to corresponding SVG. */
  function diceFace(value) {
    switch(value){
      case 1:
        return Dice1;
      case 2:
        return Dice2;
      case 3:
        return Dice3;
      case 4:
        return Dice4;
      case 5:
        return Dice5;
      case 6:
        return Dice6;
      default:
        break;
    }
  }

  return (
    <img
      src={diceFace(value)}
      className={`svg-icon ${animate ? 'Animated' : ''}`}
      alt="dice face"
      onClick={handleClick}
    />
  );
}

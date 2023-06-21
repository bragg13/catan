import React from 'react';
import { Box } from '@mui/material';
import { Dice, MainMenu, Players } from '.';

export default function MainContainer () {
  const players = [
    {
      color: '#f44336',
      username: 'cicio',
      roads: 2,
      towns: 2,
      cities: 0,
      dev: 3
    },
    {
      color: '#3f51b5',
      username: 'brombe',
      roads: 5,
      towns: 3,
      cities: 0,
      dev: 0
    },
    {
      color: '#4CAF50',
      username: 'toni',
      roads: 7,
      towns: 2,
      cities: 1,
      dev: 0
    },
    {
      color: '#ff5722',
      username: 'coco',
      roads: 4,
      towns: 2,
      cities: 1,
      dev: 1
    }
  ]
  const handleDiceClick = () => {
    console.log('dice rolled')
  }

  const handleCrafting = (building) => {
    console.log(`Want to craft a ${building}`)
  }

  return (
    <Box height="100%" width="100%">
        <Dice handleDiceClick={handleDiceClick}/>
        <MainMenu handleCrafting={handleCrafting} />
        <Players players={players} />
    </Box>
  );
};
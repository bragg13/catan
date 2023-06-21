import React from 'react';
import { Box } from '@mui/material';
import { Dice, MainMenu, Players } from '.';

export default function MainContainer () {

  const handleDiceClick = () => {
    console.log('dice rolled')
  }

  return (
    <Box height="100%" width="100%">
        <Dice handleDiceClick={handleDiceClick}/>
        <MainMenu />
        <Players />
    </Box>
  );
};
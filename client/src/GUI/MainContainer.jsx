import React from 'react';
import { Box } from '@mui/material';
import { Dice, MainMenu, Players } from '.';

export default function MainContainer () {
  return (
    <Box height="100%" width="100%">
        <Dice />
        <MainMenu />
        <Players />
    </Box>
  );
};
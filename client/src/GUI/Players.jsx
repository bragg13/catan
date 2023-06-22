import React from "react";
import { Paper, Typography, Box, Avatar, Stack, Badge, SvgIcon } from "@mui/material";
import { PeopleOutlineRounded } from "@mui/icons-material";
import { crafting, CityIcon, DevelopmentIcon, RoadIcon, TownIcon } from "../helpers/GUI_helpers";
import './GUIStyle.css'

export default function Players({players, currentPlayer}) {
  const getPlayerUI = (player) => {
    return (
      <Stack
        className="Players-player"
        direction={"column"}
        gap={1}
      >
        <Avatar
          src={<PeopleOutlineRounded />}
          sx={{ backgroundColor: player.color }}
        />
        <Typography fontWeight={(player.id === currentPlayer.id) ? 'bold' : ''} variant="h6">
          {player.username} {player.isTurn ? '(playing)' : ''}
        </Typography>
        <Stack direction={'row'} gap={2}>
            <Badge badgeContent={player.roads.length} color="info">
              <SvgIcon
                component={RoadIcon} 
                className="IconGUI-small"
                inheritViewBox
                />
            </Badge>
          <Badge badgeContent={player.towns.length} color="info">
            <SvgIcon 
              component={TownIcon} 
              className="IconGUI-small"
              inheritViewBox
              />
          </Badge>
          <Badge badgeContent={player.cities.length} color="info">
            <SvgIcon 
              component={CityIcon} 
              className="IconGUI-small"
              inheritViewBox
              />
          </Badge>
          <Badge badgeContent={player.dev.length} color="info">
            <SvgIcon 
              component={DevelopmentIcon} 
              className="IconGUI-small"
              inheritViewBox
              />
          </Badge>
        </Stack>
      </Stack>
    );
  };

  if (players===undefined) return null
  return (
    <Paper
      component={Stack}
      direction={"column"}
      gap={2}
      elevation={3}
      className="Players-container"
    >
      {players.map((el) => 
        <Paper>
        {getPlayerUI(el)}
        </Paper>
        )}
    </Paper>
  );
}

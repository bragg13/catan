import React from "react";
import { Paper, Typography, Box, Avatar, Stack, Badge, SvgIcon } from "@mui/material";
import { PeopleOutlineRounded } from "@mui/icons-material";
import { crafting, CityIcon, DevelopmentIcon, RoadIcon, TownIcon } from "../helpers/GUI_helpers";

export default function Players({players}) {
  const getPlayerUI = (player) => {
    return (
      <Stack
        padding={1}
        borderBottom={1}
        direction={"column"}
        gap={1}
        display="flex"
        alignItems="center"
      >
        <Avatar
          src={<PeopleOutlineRounded />}
          sx={{ backgroundColor: player.color }}
        />
        <Typography variant="h6">
          {player.username}
        </Typography>
        <Stack direction={'row'} gap={2}>
            <Badge badgeContent={player.roads} color="info">
              <SvgIcon
                component={RoadIcon} 
                sx={{fontSize: '4vmin'}}
                inheritViewBox
                />
            </Badge>
          <Badge badgeContent={player.towns} color="info">
            <SvgIcon 
              component={TownIcon} 
              sx={{fontSize: '4vmin'}}
              inheritViewBox
              />
          </Badge>
          <Badge badgeContent={player.cities} color="info">
            <SvgIcon 
              component={CityIcon} 
              sx={{fontSize: '4vmin'}}
              inheritViewBox
              />
          </Badge>
          <Badge badgeContent={player.dev} color="info">
            <SvgIcon 
              component={DevelopmentIcon} 
              sx={{fontSize: '4vmin'}}
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
      elevation={3}
      sx={{
        padding: 1,
        width: "fit-content",
        display: "flex",
        position: "absolute",
        zIndex: 10,
        right: "3%",
        top: "10%",
      }}
    >
      {players.map((el) => getPlayerUI(el))}
    </Paper>
  );
}

import React from "react";
import { Paper, Typography, Box, Avatar, Stack } from "@mui/material";
import { PeopleOutlineRounded } from "@mui/icons-material";
import BackpackIcon from "@mui/icons-material/Backpack";

export default function Players() {
  const getPlayerUI = (player) => {
    return (
      <Stack
        padding={1}
        borderBottom={player.username.includes("4") ? 0 : 1}
        direction={"column"}
        gap={1}
        display="flex"
        alignItems="center"
      >
        <Avatar
          src={<PeopleOutlineRounded />}
          sx={{ backgroundColor: "#ff000095" }}
        />
        <Typography variant="h6">
          Player: ID2168513215
        </Typography>
        <Box>
          <BackpackIcon />
          <BackpackIcon />
          <BackpackIcon />
          <BackpackIcon />
        </Box>
      </Stack>
    );
  };

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
      {[
        { username: "ciccio1" },
        { username: "ciccio2" },
        { username: "ciccio3" },
        { username: "ciccio4" },
      ].map((el) => getPlayerUI(el))}
    </Paper>
  );
}

import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  SvgIcon,
  Stack,
  Badge,
} from "@mui/material";
import BackpackIcon from "@mui/icons-material/Backpack";
import ConstructionIcon from "@mui/icons-material/Construction";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import "./style.css";
import {inventory, crafting} from "../helpers/GUI_helpers"

export default function MainMenu() {
  const [activeMenu, setActiveMenu] = useState(null);

  const renderCraftingItems = (items) => {
    return crafting.map((res) => (
      <Stack
        sx={{ padding: "1vh" }}
        gap={3}
        direction={"row"}
      >
        <SvgIcon
          sx={{ fontSize: "5vmin" }}
          component={res.icon}
          inheritViewBox
        />
        <Typography alignSelf={"center"}>
          {items[res.name]}x {res.name}
        </Typography>
      </Stack>
    ));
  };

  const renderInventoryItems = (items) => {
    return inventory.map((res) => (
      <Stack
        sx={{ padding: "1vh" }}
        gap={3}
        direction={"row"}
      >
        <SvgIcon
          sx={{ fontSize: "5vmin" }}
          component={res.icon}
          inheritViewBox
        />
        <Typography alignSelf={"center"}>
          {items[res.name]}x {res.name}
        </Typography>
      </Stack>
    ));
  };

  const menus = [
    {
      id: "build_menu",
      title: "Crafting",
      buttonIcon: (
        <ConstructionIcon
          sx={{
            fontSize: "4vmin",
          }}
        />
      ),
      color: "success",
      disabled: false,
      items: {
        town: 0,
        city: 0,
        road: 0,
        development: 0,
      },
    },
    {
      id: "inventory_menu",
      title: "Inventario",
      buttonIcon: (
        <BackpackIcon
          sx={{
            fontSize: "4vmin",
          }}
        />
      ),
      color: "warning",
      disabled: false,
      items: {
        sheep: 0,
        wood: 0,
        wheat: 0,
        clay: 0,
        rocks: 0,
      },
    },
    {
      id: "trade_menu",
      title: "Scambi",
      buttonIcon: (
        <CurrencyExchangeIcon
          sx={{
            fontSize: "4vmin",
          }}
        />
      ),
      color: "error",
      disabled: true,
    },
  ];

  return (
    <>
      <Paper
        sx={{
          visibility: activeMenu !== null ? "visible" : "hidden",
          left: "3vw",
          bottom: "15vh",
          position: "absolute",
          zIndex: 10,
          height: "fitContent",
          width: "15vw",
          // animation: (activeMenu !== null) ? 'appear 1s' : 'appear 1s reverse'
        }}
      >
        {activeMenu !== null && (
          <>
            {" "}
            <DialogTitle>{activeMenu.title}</DialogTitle>
            <DialogContent>
              {activeMenu.id === "inventory_menu"
                ? renderInventoryItems(activeMenu.items)
                : renderCraftingItems(activeMenu.items)
              }
            </DialogContent>
          </>
        )}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          width: "15vw",
          display: "flex",
          position: "absolute",
          justifyContent: "space-around",
          zIndex: 10,
          left: "3vw",
          bottom: "3vh",
        }}
      >
        {menus.map((menu) => (
          <div key={menu.id}>
            <IconButton
              sx={{
                borderRadius: 2,
                margin: 1,
                scale: 1.5,
              }}
              color={menu.color}
              disabled={menu.disabled}
              onClick={(event) => {
                if (activeMenu === null)
                  setActiveMenu(menus.filter((el) => el.id === menu.id)[0]);
                else if (activeMenu.id !== menu.id)
                  setActiveMenu(menus.filter((el) => el.id === menu.id)[0]);
                else setActiveMenu(null);
              }}
            >
              {menu.buttonIcon}
            </IconButton>
          </div>
        ))}
      </Paper>
    </>
  );
}

import React, { useState } from "react";
import {
  Paper,
  IconButton,
  DialogTitle,
  DialogContent,
  Typography,
  SvgIcon,
  Stack,
  Badge,
} from "@mui/material";
import { inventory, crafting, menus } from "../helpers/GUI_helpers";
import "./GUIStyle.css";

export default function MainMenu({ handleCrafting }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const renderCraftingItems = (items) => {
    return crafting.map((res) => (
      <Stack
      className="MainMenu-item"
        gap={3}
        direction={"row"}
        onClick={() => {
          handleCrafting(res.name);
        }}
      >
        <SvgIcon
          className="IconGUI-medium"
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
      className="MainMenu-item"
      gap={3} direction={"row"}>
        <SvgIcon
          className="IconGUI-medium"
          component={res.icon}
          inheritViewBox
        />
        <Typography alignSelf={"center"}>
          {items[res.name]}x {res.name}
        </Typography>
      </Stack>
    ));
  };

  return (
    <>
      <Paper
        className={`MainMenu-dialog ${activeMenu !== null && "GUI-visible"}`}
      >
        {activeMenu !== null && (
          <>
            {" "}
            <DialogTitle>{activeMenu.title}</DialogTitle>
            <DialogContent>
              {activeMenu.id === "inventory_menu"
                ? renderInventoryItems(activeMenu.items)
                : renderCraftingItems(activeMenu.items)}
            </DialogContent>
          </>
        )}
      </Paper>

      <Paper
        elevation={3}
        className="MainMenu-container"
      >
        {menus.map((menu) => (
          <div key={menu.id}>
            <IconButton
              className="MainMenu-button"
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

import React, { useEffect, useRef, useState } from "react";
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

export default function MainMenu({ currentPlayer, handleCrafting }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const oldPlayer = useRef(currentPlayer);
  const [newItems, setNewItems] = useState({});

  // update player information
  useEffect(() => {
    // on component mount, update the news
    let newItems = {};

    if (currentPlayer !== null && oldPlayer.current !== null) {
      for (let item of Object.keys(currentPlayer.inventory)) {
        console.log(
          item,
          currentPlayer.inventory[item],
          oldPlayer.current.inventory[item]
        );
        if (
          currentPlayer.inventory[item] !== oldPlayer.current.inventory[item]
        ) {
          newItems[item] =
            currentPlayer.inventory[item] - oldPlayer.current.inventory[item];
        }
      }
    }

    setNewItems(newItems);

    // on component unmount, set oldPlayer to currentPlayer
    return () => {
      oldPlayer.current = currentPlayer;
    };
  }, [currentPlayer, oldPlayer.current]);

  const renderHarvest = () => {
    if (newItems === {}) return null;
    return Object.keys(newItems).map(
      (item) =>
        newItems[item] > 0 && (
          <SvgIcon
            key={crypto.randomUUID()}
            className="IconGUI-medium"
            component={[item].icon}
            inheritViewBox
          />
        )
    );
  };
  const renderCraftingItems = (items) => {
    return crafting.map((res) => (
      <Stack
        key={crypto.randomUUID()}
        className="MainMenu-item"
        gap={3}
        direction={"row"}
        onClick={() => {
          handleCrafting(res.name);
        }}
      >
        <Badge
          badgeContent={
            currentPlayer.availableActions !== undefined &&
            res.name in currentPlayer.availableActions
              ? 1
              : 0
          }
          color="primary"
        >
          <SvgIcon
            className="IconGUI-medium"
            component={res.icon}
            inheritViewBox
          />
        </Badge>
        <Typography alignSelf={"center"}>
          {items[res.name]}x {res.name}
        </Typography>
      </Stack>
    ));
  };

  const renderInventoryItems = () => {
    const items = currentPlayer.inventory;
    return inventory.map((res) => (
      <Stack
        key={crypto.randomUUID()}
        className="MainMenu-item"
        gap={3}
        direction={"row"}
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

      <Paper className={`MainMenu-harvest`}>
        <Typography variant={"h6"}>Raccolto</Typography>
        <Stack direction={"column"} gap={3}>
          {renderHarvest()}
        </Stack>
      </Paper>

      <Paper elevation={3} className="MainMenu-container">
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

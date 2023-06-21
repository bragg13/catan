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
} from "@mui/material";
import BackpackIcon from "@mui/icons-material/Backpack";
import ConstructionIcon from "@mui/icons-material/Construction";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import './style.css'

export default function MainMenu() {
  const [activeMenu, setActiveMenu] = useState(null);

  const renderMenuItems = (items) => {
    return <></>
    // items.map((item, index) => (
    //   <MenuItem key={index} onClick={handleClose}>
    //     <ListItemIcon>{item.icon}</ListItemIcon>
    //     <ListItemText primary={item.text} />
    //   </MenuItem>
    // ));
  };

  const menus = [
    {
      id: "build_menu",
      title: "Crafting",
      buttonIcon: <ConstructionIcon sx={{ 
        fontSize: '4vmin',
        // transition: (activeMenu!==null && activeMenu.id === 'build_menu')
      }} />,
      color: "success",
      disabled: false,
      items: [
        { icon: <ConstructionIcon />, text: "Item 1" },
        { icon: <ConstructionIcon />, text: "Item 2" },
      ],
    },
    {
      id: "inventory_menu",
      title: "Inventario",
      buttonIcon: <BackpackIcon sx={{ 
        fontSize: '4vmin',
        // transition: (activeMenu!==null && activeMenu.id === 'inventory_menu')
      }} />,
      color: "warning",
      disabled: false,
      items: [
        { icon: <BackpackIcon />, text: "Item 3" },
        { icon: <BackpackIcon />, text: "Item 4" },
      ],
    },
    {
      id: "trade_menu",
      title: "Scambi",
      buttonIcon: <CurrencyExchangeIcon sx={{ 
        fontSize: '4vmin',
        // transition: (activeMenu!==null && activeMenu.id === 'trade_menu')
      }} />,
      color: "error",
      disabled: true,
      items: [
        { icon: <CurrencyExchangeIcon />, text: "Item 5" },
        { icon: <CurrencyExchangeIcon />, text: "Item 6" },
      ],
    },
  ];

  return (
    <>
      <Paper sx={{
        visibility: (activeMenu !== null) ? 'visible' : 'hidden',
        left: '3vw',
        bottom: '15vh',
        position:'absolute',
        zIndex: 10,
        height: "40vh",
        width: "15vw",
        // animation: (activeMenu !== null) ? 'appear 1s' : 'appear 1s reverse'
      }}
      >
        {activeMenu !== null && (
          <>
            {" "}
            <DialogTitle>{activeMenu.title}</DialogTitle>
            <DialogContent>
              <Menu>{renderMenuItems(activeMenu.items)}</Menu>
            </DialogContent>
          </>
        )}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          width: "15vw",
          display: 'flex',
          position: "absolute",
          justifyContent: 'space-around',
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
                scale: 1.5 
                }}
              color={menu.color}
              disabled={menu.disabled}
              onClick={(event) => {
                if (activeMenu === null) 
                  setActiveMenu(menus.filter(el => el.id === menu.id)[0]);
                else if (activeMenu.id !== menu.id)
                  setActiveMenu(menus.filter(el => el.id === menu.id)[0]);
                else
                  setActiveMenu(null);
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

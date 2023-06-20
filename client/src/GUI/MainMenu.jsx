import React, { useState } from 'react';
import { Button, Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import HammerIcon from '@mui/icons-material/Build';
import BackpackIcon from '@mui/icons-material/Backpack';
import MoneyIcon from '@mui/icons-material/AttachMoney';

export default function MainMenu (){
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenu, setActiveMenu] = useState('');

  const handleClick = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menu);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveMenu('');
  };

  const renderMenuItems = (items) => {
    return items.map((item, index) => (
      <MenuItem key={index} onClick={handleClose}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </MenuItem>
    ));
  };

  const menus = [
    {
      id: 'menu1',
      buttonIcon: <HammerIcon />,
      items: [
        { icon: <HammerIcon />, text: 'Item 1' },
        { icon: <HammerIcon />, text: 'Item 2' }
      ]
    },
    {
      id: 'menu2',
      buttonIcon: <BackpackIcon />,
      items: [
        { icon: <BackpackIcon />, text: 'Item 3' },
        { icon: <BackpackIcon />, text: 'Item 4' }
      ]
    },
    {
      id: 'menu3',
      buttonIcon: <MoneyIcon />,
      items: [
        { icon: <MoneyIcon />, text: 'Item 5' },
        { icon: <MoneyIcon />, text: 'Item 6' }
      ]
    }
  ];

  return (
    <Box>
      {menus.map((menu) => (
        <React.Fragment key={menu.id}>
          <Button
            variant="contained"
            sx={{ borderRadius: 2, margin: 1 }}
            startIcon={menu.buttonIcon}
            onClick={(event) => handleClick(event, menu.id)}
          />
          <Menu
            anchorEl={anchorEl}
            open={activeMenu === menu.id}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          >
            {renderMenuItems(menu.items)}
          </Menu>
        </React.Fragment>
      ))}
    </Box>
  );
};

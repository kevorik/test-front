import * as React from 'react';
import { List, ListItem, ListItemText, Drawer, CssBaseline, Toolbar, AppBar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar() {
  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            CRM Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        style={{ width: drawerWidth, flexShrink: 0 }}
        PaperProps={{ style: { width: drawerWidth } }}
      >
        <Toolbar />
        <div style={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/schools">
              <ListItemText primary="Schools" />
            </ListItem>
            <ListItem button component={Link} to="/classes">
              <ListItemText primary="Classes" />
            </ListItem>
            <ListItem button component={Link} to="/students">
              <ListItemText primary="Students" />
            </ListItem>
            <ListItem button component={Link} to="/subjects">
              <ListItemText primary="Subjects" />
            </ListItem>
            <ListItem button component={Link} to="/teachers">
              <ListItemText primary="Teachers" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}

import React from 'react'
import {
    List,
    ListItem,
    ListItemText,
    Drawer,
    CssBaseline,
    Toolbar,
    AppBar,
    Typography,
    Button,
} from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../services/api'

const drawerWidth = 240

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()

    const menuItems = [
        { text: 'Schools', path: '/schools' },
        { text: 'Classes', path: '/classes' },
        { text: 'Students', path: '/students' },
        { text: 'Subjects', path: '/subjects' },
        { text: 'Teachers', path: '/teachers' },
    ]

    const handleLogout = async () => {
        try {
            await logout()
            localStorage.removeItem('token')
            navigate('/login')
        } catch (err) {
            console.error('Error during logout:', err)
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" style={{ zIndex: 1201 }}>
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap>
                        CRM Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
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
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                component={Link}
                                to={item.path}
                                key={item.text}
                                selected={location.pathname === item.path}
                            >
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    )
}

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MonitorIcon from '@mui/icons-material/Monitor';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ isMobile, mobileOpen, setMobileOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [feedbackMenuOpen, setFeedbackMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/adminhome')}
            cursor="pointer"
          >
            ChildCare
          </Typography>
        </Toolbar>
        <Divider />
        <List>
        {/* Dashboard */}
        <ListItem
          button
          onClick={() => navigate('/adminhome')}
          selected={location.pathname === '/adminhome'}
          sx={{
            cursor: 'pointer',
            ...(location.pathname === '/adminhome' && {
              backgroundColor: '#ffc2d1',
              '&:hover': {
                backgroundColor: '#ffb3c6',
              },
            }),
          }}
        >
          <ListItemIcon sx={{ color: 'black' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText sx={{cursor:'pointer'}} primary="Dashboard" />
        </ListItem>

        {/* User Management Dropdown */}
        <ListItem
          button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          sx={{
            cursor: 'pointer',
            ...(location.pathname === '/parentapprove' ||
              location.pathname === '/pediatricianapprove') && {
              backgroundColor: '#ffc2d1',
              '&:hover': {
                backgroundColor: '#ffb3c6',
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: 'black' }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText sx={{cursor:'pointer'}} primary="User Management" />
          {userMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={userMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{
                cursor: 'pointer',
                pl: 4,
                ...(location.pathname === '/parentapprove' && {
                  backgroundColor: '#ffc2d1',
                  '&:hover': {
                    backgroundColor: '#ffb3c6',
                  },
                }),
              }}
              onClick={() => navigate('/parentapprove')}
              selected={location.pathname === '/parentapprove'}
            >
              <ListItemText primary="Parent" />
            </ListItem>
            <ListItem
              button
              sx={{
                cursor: 'pointer',
                pl: 4,
                ...(location.pathname === '/pediatricianapprove' && {
                  backgroundColor: '#ffc2d1',
                  '&:hover': {
                    backgroundColor: '#ffb3c6',
                  },
                }),
              }}
              onClick={() => navigate('/pediatricianapprove')}
              selected={location.pathname === '/pediatricianapprove'}
            >
              <ListItemText primary="Pediatrician" />
            </ListItem>
          </List>
        </Collapse>


        {/* Activity Monitoring */}
        <ListItem
          button
          onClick={() => navigate('/activity')}
          selected={location.pathname === '/activity'}
          sx={{
            cursor: 'pointer',
            ...(location.pathname === '/activity' && {
              backgroundColor: '#ffc2d1',
              '&:hover': {
                backgroundColor: '#ffb3c6',
              },
            }),
          }}
        >
          <ListItemIcon sx={{ color: 'black' }}>
            <MonitorIcon />
          </ListItemIcon>
          <ListItemText primary="Activity Monitoring" />
        </ListItem>
        {/* Feedback Dropdown */}
        <ListItem
          button
          onClick={() => setFeedbackMenuOpen(!feedbackMenuOpen)}
          sx={{
            cursor: 'pointer',
            ...(location.pathname === '/parentfeedback' ||
              location.pathname === '/pediatricianfeedback') && {
              backgroundColor: '#ffc2d1',
              '&:hover': {
                backgroundColor: '#ffb3c6',
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: 'black' }}>
            <FeedbackIcon />
          </ListItemIcon>
          <ListItemText sx={{cursor:'pointer'}} primary="Feedback" />
          {feedbackMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={feedbackMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{
                cursor: 'pointer',
                pl: 4,
                ...(location.pathname === '/parentfeedback' && {
                  backgroundColor: '#ffc2d1',
                  '&:hover': {
                    backgroundColor: '#ffb3c6',
                  },
                }),
              }}
              onClick={() => navigate('/parentfeedback')}
              selected={location.pathname === '/parentfeedback'}
            >
              <ListItemText primary="Parent Feedback" />
            </ListItem>
            <ListItem
              button
              sx={{
                cursor: 'pointer',
                pl: 4,
                ...(location.pathname === '/pediatricianfeedback' && {
                  backgroundColor: '#ffc2d1',
                  '&:hover': {
                    backgroundColor: '#ffb3c6',
                  },
                }),
              }}
              onClick={() => navigate('/pediatricianfeedback')}
              selected={location.pathname === '/pediatricianfeedback'}
            >
              <ListItemText primary="Pediatrician Feedback" />
            </ListItem>
          </List>
        </Collapse>

      </List>

      </Box>

      {/* Logout at Bottom */}
      <Box
        className="logout-btn"
        sx={{
          mt: 'auto',
          p: 2,
          mx: 2,
          mb: 2,
          textAlign: 'center',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 77, 109, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: '#ff4d6d',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          '&:hover': {
            transform: 'translateY(-3px)',
            background: 'rgba(255, 77, 109, 0.3)',
            boxShadow: '0 12px 24px rgba(255, 77, 109, 0.3)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 4px 12px rgba(255, 77, 109, 0.2)',
          },
        }}
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      >
        LOGOUT
      </Box>


    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: '#ffe6ee',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: '#ffe6ee',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;

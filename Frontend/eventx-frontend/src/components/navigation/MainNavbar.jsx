import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event,
  AccountCircle,
  Notifications,
  Search,
  Home,
  Dashboard,
  ConfirmationNumber as Ticket,
  Person,
  Settings,
  Logout,
  Login,
  PersonAdd,
  AdminPanelSettings
} from '@mui/icons-material';

const MainNavbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const pages = [
    { name: 'Home', path: '/', icon: <Home /> },
    { name: 'Events', path: '/events', icon: <Event /> },
    { name: 'About', path: '/about', icon: <Person /> },
    { name: 'Contact', path: '/contact', icon: <Person /> }
  ];

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Dashboard />, show: isAuthenticated },
    { name: 'My Tickets', path: '/tickets', icon: <Ticket />, show: isAuthenticated },
    { name: 'Profile', path: '/profile', icon: <Person />, show: isAuthenticated },
    { name: 'Settings', path: '/settings', icon: <Settings />, show: isAuthenticated },
    { name: 'Admin Panel', path: '/admin/dashboard', icon: <AdminPanelSettings />, show: isAuthenticated && user?.role === 'admin' }
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleCloseUserMenu();
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      {/* Logo */}
      <Box sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          EventX Studio
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Links */}
      <List sx={{ pt: 2 }}>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(page.path)}
              selected={isActiveRoute(page.path)}
              sx={{
                mx: 2,
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActiveRoute(page.path) ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                color: isActiveRoute(page.path) ? '#667eea' : 'inherit',
                '&:hover': {
                  backgroundColor: isActiveRoute(page.path) 
                    ? 'rgba(102, 126, 234, 0.15)' 
                    : 'rgba(0, 0, 0, 0.04)'
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea'
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: isActiveRoute(page.path) ? '#667eea' : 'inherit',
                minWidth: 40 
              }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User Menu Items */}
      {isAuthenticated && (
        <List>
          {userMenuItems.filter(item => item.show).map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActiveRoute(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActiveRoute(item.path) ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  color: isActiveRoute(item.path) ? '#667eea' : 'inherit',
                  '&:hover': {
                    backgroundColor: isActiveRoute(page.path) 
                      ? 'rgba(102, 126, 234, 0.15)' 
                      : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActiveRoute(item.path) ? '#667eea' : 'inherit',
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: '#1a237e',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              EventX Studio
            </Typography>

            {/* Mobile Menu Button */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                sx={{ color: '#1a237e' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo - Mobile */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: '#1a237e',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              EventX Studio
            </Typography>

            {/* Navigation Menu - Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleNavigation(page.path)}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: isActiveRoute(page.path) ? '#667eea' : '#1a237e',
                    fontWeight: isActiveRoute(page.path) ? 600 : 400,
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                    '&::after': isActiveRoute(page.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '2px',
                      backgroundColor: '#667eea',
                      borderRadius: '1px'
                    } : {}
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Right Side Icons */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search Icon */}
              <Tooltip title="Search">
                <IconButton sx={{ color: '#1a237e' }}>
                  <Search />
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              {isAuthenticated && (
                <Tooltip title="Notifications">
                  <IconButton sx={{ color: '#1a237e' }}>
                    <Badge badgeContent={3} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar 
                        alt={user?.name} 
                        src={user?.profileImage}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: '#667eea',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        {user?.name?.charAt(0)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {/* User Info */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                      {user?.role === 'admin' && (
                        <Chip 
                          label="Admin" 
                          size="small" 
                          color="primary" 
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>

                    {/* Menu Items */}
                    {userMenuItems.filter(item => item.show).map((item) => (
                      <MenuItem 
                        key={item.name} 
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          mb: 0.5,
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.1)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: '#667eea' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}

                    <Divider sx={{ my: 1 }} />

                    {/* Logout */}
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        color: '#d32f2f',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.1)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: '#d32f2f' }}>
                        <Logout />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                /* Auth Buttons */
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Login />}
                    onClick={() => handleNavigation('/login')}
                    sx={{
                      color: '#667eea',
                      borderColor: '#667eea',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#5a6fd8',
                        backgroundColor: 'rgba(102, 126, 234, 0.04)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => handleNavigation('/register')}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            border: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default MainNavbar;

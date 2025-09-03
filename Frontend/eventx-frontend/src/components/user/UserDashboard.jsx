import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Avatar, 
  Tabs, 
  Tab, 
  TextField, 
  InputAdornment,
  IconButton,
  Badge,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  MenuItem,
  Alert
} from '@mui/material';
// Using regular Grid component
import { 
  Search, 
  FilterList, 
  Event, 
  ConfirmationNumber as Ticket, 
  Person, 
  LocationOn, 
  CalendarToday,
  AccessTime,
  AttachMoney,
  Star,
  Notifications,
  Settings,
  Bookmark,
  Share
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with API calls
  const mockEvents = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      description: 'Join us for the biggest tech conference of the year',
      date: '2024-03-15',
      startTime: '09:00',
      endTime: '17:00',
      venue: { name: 'Convention Center', city: 'Colombo' },
      price: 2500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      category: 'Technology',
      status: 'upcoming',
      popularity: 'High',
      availableSeats: 150
    },
    {
      id: 2,
      title: 'Music Festival',
      description: 'A night of amazing music and entertainment',
      date: '2024-03-20',
      startTime: '18:00',
      endTime: '23:00',
      venue: { name: 'Open Air Arena', city: 'Galle' },
      price: 1500,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      category: 'Music',
      status: 'upcoming',
      popularity: 'Very High',
      availableSeats: 500
    },
    {
      id: 3,
      title: 'Business Networking',
      description: 'Connect with industry leaders and entrepreneurs',
      date: '2024-03-25',
      startTime: '19:00',
      endTime: '22:00',
      venue: { name: 'Business Center', city: 'Kandy' },
      price: 3000,
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
      category: 'Business',
      status: 'upcoming',
      popularity: 'Medium',
      availableSeats: 80
    }
  ];

  const mockTickets = [
    {
      id: 1,
      event: mockEvents[0],
      seatNumber: 'A001',
      purchaseDate: '2024-02-15',
      status: 'active',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
    setUserTickets(mockTickets);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Technology', 'Music', 'Business', 'Sports', 'Arts', 'Education'];

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'primary',
      active: 'success',
      completed: 'default',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getPopularityColor = (popularity) => {
    const colors = {
      'Low': 'default',
      'Medium': 'warning',
      'High': 'success',
      'Very High': 'error'
    };
    return colors[popularity] || 'default';
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ p: 3 }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid>
              <Avatar 
                sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)' }}
                src={user?.profileImage}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Discover amazing events and manage your tickets
              </Typography>
            </Grid>
            <Grid>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="inherit" size="large">
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" size="large">
                  <Settings />
                </IconButton>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Logout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
  <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Quick Stats
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#667eea' }}>
                      <Event />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Events Attended" 
                    secondary={userTickets.filter(t => t.status === 'used').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#764ba2' }}>
                      <Ticket />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Active Tickets" 
                    secondary={userTickets.filter(t => t.status === 'active').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#f093fb' }}>
                      <Star />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Favorite Category" 
                    secondary={user?.interests?.[0] || 'Not set'}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Upcoming Events
              </Typography>
              <List>
                {events.slice(0, 3).map((event) => (
                  <ListItem key={event.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.date} • ${event.venue.city}`}
                      primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '12px' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3 }}>
                  <Tab label="Discover Events" icon={<Event />} iconPosition="start" />
                  <Tab label="My Tickets" icon={<Ticket />} iconPosition="start" />
                  <Tab label="Profile" icon={<Person />} iconPosition="start" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ p: 3 }}>
                {/* Discover Events Tab */}
                {activeTab === 0 && (
                  <Box>
                    {/* Search and Filter */}
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search />
                                </InputAdornment>
                              )
                            }}
                            sx={{ borderRadius: 2 }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            select
                            fullWidth
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Category"
                            sx={{ borderRadius: 2 }}
                          >
                            {categories.map((category) => (
                              <MenuItem key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Events Grid */}
                    <Grid container spacing={3}>
                      {filteredEvents.map((event) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={event.id}>
                          <Card 
                            elevation={3}
                            sx={{ 
                              borderRadius: 3, 
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                              }
                            }}
                            onClick={() => handleEventClick(event.id)}
                          >
                            <CardMedia
                              component="img"
                              height="200"
                              image={event.image}
                              alt={event.title}
                            />
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Chip 
                                  label={event.status} 
                                  color={getStatusColor(event.status)}
                                  size="small"
                                />
                                <Chip 
                                  label={event.popularity} 
                                  color={getPopularityColor(event.popularity)}
                                  size="small"
                                />
                              </Box>
                              
                              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                                {event.title}
                              </Typography>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {event.description}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(event.date).toLocaleDateString()}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {event.startTime} - {event.endTime}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {event.venue.name}, {event.venue.city}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                                    {event.price.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {event.availableSeats} seats left
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button 
                                  variant="contained" 
                                  fullWidth
                                  sx={{ 
                                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                    borderRadius: 2
                                  }}
                                >
                                  Book Now
                                </Button>
                                <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                                  <Bookmark />
                                </IconButton>
                                <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                                  <Share />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {filteredEvents.length === 0 && (
                      <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                          No events found matching your criteria
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* My Tickets Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                      My Tickets
                    </Typography>
                    
                    {userTickets.length === 0 ? (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        You haven't purchased any tickets yet. Start exploring events to book your first ticket!
                      </Alert>
                    ) : (
                      <Grid container spacing={3}>
                        {userTickets.map((ticket) => (
                          <Grid size={{ xs: 12, md: 6 }} key={ticket.id}>
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                              <CardMedia
                                component="img"
                                height="200"
                                image={ticket.event.image}
                                alt={ticket.event.title}
                              />
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                  <Chip 
                                    label={ticket.status} 
                                    color={ticket.status === 'active' ? 'success' : 'default'}
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    Seat: {ticket.seatNumber}
                                  </Typography>
                                </Box>

                                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                                  {ticket.event.title}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(ticket.event.date).toLocaleDateString()}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {ticket.event.venue.name}, {ticket.event.venue.city}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                  <Button 
                                    variant="outlined" 
                                    startIcon={<Ticket />}
                                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                                  >
                                    View Ticket
                                  </Button>
                                  <Typography variant="body2" color="text.secondary">
                                    Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}

                {/* Profile Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                      Profile Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Personal Details
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Name</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {user?.name || 'Not provided'}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Email</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {user?.email || 'Not provided'}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Phone</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {user?.phone || 'Not provided'}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Location</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {user?.city && user?.country ? `${user.city}, ${user.country}` : 'Not provided'}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Interests
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {user?.interests?.map((interest, index) => (
                              <Chip key={index} label={interest} color="primary" />
                            )) || (
                              <Typography variant="body2" color="text.secondary">
                                No interests selected
                              </Typography>
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
  </Grid>
      </Box>
    </Box>
  );
};

export default UserDashboard;

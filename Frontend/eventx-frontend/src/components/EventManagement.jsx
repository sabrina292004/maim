import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  IconButton,
  Chip,
  Avatar,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  ConfirmationNumber as TicketIcon,
  AttachMoney as MoneyIcon,
  Chair as SeatIcon,
  MoreVert as MoreIcon,
  ArrowForward as ArrowIcon,
  Mic as MicIcon,
  CarRental as CarIcon,
  Laptop as LaptopIcon,
  MusicNote as MusicIcon,
  Restaurant as FoodIcon,
  SportsEsports as GameIcon,
  Celebration as FireworkIcon,
  Palette as ArtIcon,
  Celebration as NewYearIcon
} from '@mui/icons-material';
import { eventsAPI } from '../api/events';

const EventManagement = () => {
  const [events, setEvents] = useState({
    upcoming: [],
    pending: [],
    closed: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('status');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAllEvents();
      setEvents(response.eventsByStatus || {
        upcoming: [],
        pending: [],
        closed: []
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock event data based on Figma design
  const mockEvents = {
    upcoming: [
      {
        id: 1,
        title: 'Colombo Music Festival',
        icon: 'mic',
        price: 5000,
        ticketsSold: 2500,
        seats: 1800,
        venue: 'Open Air Theater, Colombo',
        date: '12 April 2025',
        time: '09.00PM to 11.30PM',
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Galle Literary Fair',
        icon: 'group',
        price: 2000,
        ticketsSold: 1500,
        seats: 600,
        venue: 'Open Air Theater, Galle',
        date: '14 April 2025',
        time: '09.00AM to 12.00PM',
        status: 'upcoming'
      },
      {
        id: 3,
        title: 'Tech Lanka Expo 2025',
        icon: 'laptop',
        price: 1000,
        ticketsSold: 800,
        seats: 400,
        venue: 'Open Air Theater, Colombo',
        date: '18 April 2025',
        time: '10.00AM to 01.30PM',
        status: 'upcoming'
      },
      {
        id: 4,
        title: 'Jaffna Music Festival',
        icon: 'music',
        price: 3000,
        ticketsSold: 1200,
        seats: 800,
        venue: 'Open Air Theater, Jaffna',
        date: '20 April 2025',
        time: '07.00PM to 10.00PM',
        status: 'upcoming'
      }
    ],
    pending: [
      {
        id: 5,
        title: 'Lanka Supercar Show',
        icon: 'car',
        price: 3000,
        ticketsSold: 2500,
        seats: 0,
        venue: 'Lanka Supercar Show',
        date: '15 April 2025',
        time: '09.00PM to 11.30PM',
        status: 'pending'
      },
      {
        id: 6,
        title: 'Kandy Art Exhibition',
        icon: 'art',
        price: 4000,
        ticketsSold: 750,
        seats: 0,
        venue: 'Open Air Theater, Colombo',
        date: '19 April 2025',
        time: '09.00PM to 11.30PM',
        status: 'pending'
      },
      {
        id: 7,
        title: 'New Year\'s Eve Fireworks',
        icon: 'firework',
        price: 1500,
        ticketsSold: 1500,
        seats: 0,
        venue: 'Open Air Theater, Colombo',
        date: '24 April 2025',
        time: '09.00PM to 11.30PM',
        status: 'pending'
      },
      {
        id: 8,
        title: 'Matara Car Show',
        icon: 'car',
        price: 2500,
        ticketsSold: 1800,
        seats: 200,
        venue: 'Open Air Theater, Matara',
        date: '25 April 2025',
        time: '06.00PM to 09.00PM',
        status: 'pending'
      }
    ],
    closed: [
      {
        id: 9,
        title: 'Rock & Roll Night',
        icon: 'music',
        price: 3000,
        ticketsSold: 1500,
        seats: 1500,
        venue: 'Open Air Theater, Colombo',
        date: '03 March 2025',
        time: '09.00PM to 11.30PM',
        status: 'closed'
      },
      {
        id: 10,
        title: 'Sri Lanka Food Fest',
        icon: 'food',
        price: 2000,
        ticketsSold: 700,
        seats: 600,
        venue: 'Open Air Theater, Colombo',
        date: '02 March 2025',
        time: '09.00PM to 11.30PM',
        status: 'closed'
      },
      {
        id: 11,
        title: 'Colombo Music Festival',
        icon: 'mic',
        price: 5000,
        ticketsSold: 1500,
        seats: 1100,
        venue: 'Open Air Theater, Colombo',
        date: '24 February 2025',
        time: '09.00PM to 11.30PM',
        status: 'closed'
      },
      {
        id: 12,
        title: 'Cricket Festival',
        icon: 'game',
        price: 1000,
        ticketsSold: 800,
        seats: 400,
        venue: 'Open Air Theater, Colombo',
        date: '20 February 2025',
        time: '02.00PM to 06.00PM',
        status: 'closed'
      }
    ]
  };

  const getEventIcon = (iconType) => {
    const iconMap = {
      mic: <MicIcon />,
      group: <EventIcon />,
      laptop: <LaptopIcon />,
      music: <MusicIcon />,
      car: <CarIcon />,
      art: <ArtIcon />,
      firework: <FireworkIcon />,
      food: <FoodIcon />,
      game: <GameIcon />
    };
    return iconMap[iconType] || <EventIcon />;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      upcoming: 'blue',
      pending: 'green',
      closed: 'red'
    };
    return colorMap[status] || 'grey';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      upcoming: 'Up-Coming Events',
      pending: 'Pending Events',
      closed: 'Closed Events'
    };
    return labelMap[status] || status;
  };

  const EventCard = ({ event }) => (
    <Card sx={{ 
      mb: 2, 
      bgcolor: 'white', 
      borderRadius: 2,
      '&:hover': { boxShadow: 3 }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'primary.100', 
              color: 'primary.600',
              width: 32,
              height: 32,
              mr: 1
            }}>
              {getEventIcon(event.icon)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              {event.title}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Metrics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MoneyIcon sx={{ color: 'green.600', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: 'green.600', fontWeight: 'bold' }}>
              {event.price.toLocaleString()}LKR
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TicketIcon sx={{ color: 'red.600', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: 'red.600', fontWeight: 'bold' }}>
              {event.ticketsSold.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SeatIcon sx={{ color: 'purple.600', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: 'purple.600', fontWeight: 'bold' }}>
              {event.seats.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Event Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'grey.600', mb: 0.5 }}>
            Venue: {event.venue}
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.600', mb: 0.5 }}>
            Date: {event.date}
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            Time: {event.time}
          </Typography>
        </Box>

        {/* Action Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton 
            size="small" 
            sx={{ 
              bgcolor: 'primary.100',
              color: 'primary.600',
              '&:hover': { bgcolor: 'primary.200' }
            }}
          >
            <ArrowIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading Events...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Left Sidebar */}
      <Box sx={{ 
        width: 280, 
        bgcolor: 'grey.900', 
        color: 'white',
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: 'green.500', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              EX
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            EventX
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'grey.400', mb: 3 }}>
          studio
        </Typography>

        {/* Add Quick Event Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ 
            bgcolor: 'green.500', 
            color: 'white',
            mb: 3,
            '&:hover': { bgcolor: 'green.600' }
          }}
        >
          Add Quick Event
        </Button>

        {/* Navigation */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 1 }}>
            Main Navigation
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1,
              bgcolor: 'grey.800'
            }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Events</Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 1 }}>
              Main Navigation
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1,
              bgcolor: 'green.500'
            }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Dashboard</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1
            }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Manage Events</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1
            }}>
              <TicketIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Booking & Tickets</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1
            }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Attendee Insights</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1
            }}>
              <EventIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Analytics & Reports</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Event Management Section
          </Typography>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: 'blue.600' }}
            >
              New Event
            </Button>
            <Button
              variant="contained"
              startIcon={<EventIcon />}
              sx={{ bgcolor: 'orange.600' }}
            >
              Attendee Insights
            </Button>
          </Box>

          {/* Filters and Search */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              endIcon={<FilterIcon />}
            >
              Filter
            </Button>
            
            <TextField
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'grey.500', mr: 1 }} />
              }}
              sx={{ minWidth: 300 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="tickets">Tickets Sold</MenuItem>
              </Select>
            </FormControl>
            
            <IconButton>
              <CalendarIcon />
            </IconButton>
            
            <Button variant="outlined">
              Pick Date
            </Button>
          </Box>
        </Box>

        {/* Kanban Board */}
        <Grid container spacing={3}>
          {/* Upcoming Events */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: 'blue.500', 
                  borderRadius: '50%',
                  mr: 1
                }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {getStatusLabel('upcoming')}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {mockEvents.upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Box>
          </Grid>

          {/* Pending Events */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: 'green.500', 
                  borderRadius: '50%',
                  mr: 1
                }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {getStatusLabel('pending')}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {mockEvents.pending.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Box>
          </Grid>

          {/* Closed Events */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: 'red.500', 
                  borderRadius: '50%',
                  mr: 1
                }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {getStatusLabel('closed')}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {mockEvents.closed.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EventManagement;

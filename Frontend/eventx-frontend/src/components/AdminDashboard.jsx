import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  ConfirmationNumber as TicketIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  Campaign as MarketingIcon,
  Folder as CategoryIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { adminAPI } from '../api/admin';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, salesData, engagementData] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getPaymentAnalytics({ period: selectedPeriod }),
        adminAPI.getPaymentAnalytics()
      ]);
      
      setDashboardData({
        stats,
        salesData,
        engagementData
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (replace with real data from API)
  const netSalesData = [
    { name: '01', revenue: 35000, percentage: 17.3 },
    { name: '02', revenue: 22000, percentage: 10.9 },
    { name: '03', revenue: 15000, percentage: 7.4 },
    { name: '04', revenue: 28000, percentage: 13.8 },
    { name: '05', revenue: 34000, percentage: 16.8 },
    { name: '06', revenue: 22500, percentage: 11.1 }
  ];

  const customerEngagementData = [
    { name: 'Event-A', value: 450, percentage: 29.4, color: '#9C27B0' },
    { name: 'Event-B', value: 250, percentage: 16.2, color: '#2196F3' },
    { name: 'Event-C', value: 170, percentage: 11.1, color: '#FF9800' },
    { name: 'Event-D', value: 370, percentage: 24.2, color: '#4CAF50' },
    { name: 'Event-E', value: 290, percentage: 9.0, color: '#F44336' }
  ];

  const upcomingEvents = [
    { name: 'Cynosure Festival', date: '24 March 2025', image: '/event1.jpg' },
    { name: 'Nightor Festival', date: '30 March 2025', image: '/event2.jpg' },
    { name: 'Cyndrex Festival', date: '03 April 2025', image: '/event3.jpg' },
    { name: 'Hyper Festival', date: '10 April 2025', image: '/event4.jpg' },
    { name: 'EDM Festival', date: '15 April 2025', image: '/event5.jpg' }
  ];

  const notifications = [
    { message: 'Paycheck released for artists @Wayo Event', type: 'payment', icon: 'document' },
    { message: 'Total revenue has been transferred to bank', type: 'finance', icon: 'dollar' },
    { message: '@Alan Walker Event in 3 days', type: 'reminder', icon: 'clock' },
    { message: 'Paycheck released for artists @Cynderex Event', type: 'payment', icon: 'document' },
    { message: 'Paycheck released for artists @Get Together Event', type: 'payment', icon: 'document' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading Dashboard...</Typography>
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
          <List dense>
            <ListItem button sx={{ bgcolor: 'green.500', borderRadius: 1, mb: 1 }}>
              <ListItemAvatar>
                <DashboardIcon />
              </ListItemAvatar>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <EventIcon />
              </ListItemAvatar>
              <ListItemText primary="Manage Events" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <TicketIcon />
              </ListItemAvatar>
              <ListItemText primary="Booking & Tickets" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <GroupIcon />
              </ListItemAvatar>
              <ListItemText primary="Attendee Insights" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <TrendingUpIcon />
              </ListItemAvatar>
              <ListItemText primary="Analytics & Reports" />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 1, mt: 3 }}>
            Support & Management
          </Typography>
          <List dense>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <PersonIcon />
              </ListItemAvatar>
              <ListItemText primary="Contact Support" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <NotificationsIcon />
              </ListItemAvatar>
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <SettingsIcon />
              </ListItemAvatar>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 1, mt: 3 }}>
            Additional Features
          </Typography>
          <List dense>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <MarketingIcon />
              </ListItemAvatar>
              <ListItemText primary="Marketing" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <CategoryIcon />
              </ListItemAvatar>
              <ListItemText primary="Event Categories" />
            </ListItem>
          </List>

          <Typography variant="subtitle2" sx={{ color: 'grey.400', mb: 1, mt: 3 }}>
            Account Management
          </Typography>
          <List dense>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <GroupIcon />
              </ListItemAvatar>
              <ListItemText primary="Manage Users" />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemAvatar>
                <LogoutIcon />
              </ListItemAvatar>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome Rusiru De Silva
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.600' }}>
              System Administrator
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <input
                placeholder="Search..."
                style={{
                  padding: '12px 40px 12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  width: '300px',
                  fontSize: '14px'
                }}
              />
              <SearchIcon sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'grey.500' }} />
            </Box>
            
            <IconButton>
              <NotificationsIcon />
            </IconButton>
            <IconButton>
              <CalendarIcon />
            </IconButton>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Top Row - Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'blue.100', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <EventIcon sx={{ color: 'blue.600', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>
                      EVENTS
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {dashboardData?.stats?.totalEvents || 28} Events
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'green.100', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <TicketIcon sx={{ color: 'green.600', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>
                      BOOKINGS
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {dashboardData?.stats?.totalTicketsSold || '2,759'} Tickets
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'orange.100', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <RevenueIcon sx={{ color: 'orange.600', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>
                      REVENUE
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {dashboardData?.stats?.totalRevenue?.toLocaleString() || '623,500'} LKR
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Middle Row - Charts and Upcoming Events */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Net Sales Chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, height: 400 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    NET SALES
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<FilterIcon />}
                    >
                      Filter: Weekly
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>Total Revenue</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>156,500 LKR</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>Total Tickets</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2438 Tickets</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'grey.600' }}>Total Events</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>32 Events</Typography>
                  </Box>
                </Box>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={netSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#2196F3" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Engagement */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, height: 400 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Customer Engagement
                </Typography>
                
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={customerEngagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {customerEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <Box sx={{ mt: 2 }}>
                  {customerEngagementData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: item.color, 
                        borderRadius: '50%',
                        mr: 1
                      }} />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.name}: {item.value} ({item.percentage}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Row - Upcoming Events and Notifications */}
        <Grid container spacing={3}>
          {/* Upcoming Events */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    UPCOMING EVENTS
                  </Typography>
                  <IconButton size="small">
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
                
                <List dense>
                  {upcomingEvents.map((event, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={event.image} sx={{ width: 40, height: 40 }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.name}
                        secondary={event.date}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 1 }}
                >
                  See All
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    NOTIFICATIONS
                  </Typography>
                  <IconButton size="small">
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
                
                <List dense>
                  {notifications.map((notification, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: notification.type === 'payment' ? 'green.100' : 
                                   notification.type === 'finance' ? 'blue.100' : 'orange.100'
                        }}>
                          {notification.icon === 'document' && <EventIcon sx={{ fontSize: 16 }} />}
                          {notification.icon === 'dollar' && <RevenueIcon sx={{ fontSize: 16 }} />}
                          {notification.icon === 'clock' && <CalendarIcon sx={{ fontSize: 16 }} />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.message}
                        secondary={notification.type}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 1 }}
                >
                  See All
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

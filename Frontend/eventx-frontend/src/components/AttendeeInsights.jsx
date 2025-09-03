import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  IconButton,
  Grid,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Interests as InterestsIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  QrCode as QrCodeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  ComposedChart,
  Area
} from 'recharts';
import { adminAPI } from '../api/admin';

const AttendeeInsights = () => {
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('Colombo Music Festival 2025');

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      const [demographics, eventAnalytics] = await Promise.all([
        adminAPI.getAttendeeDemographics(),
        adminAPI.getEventAnalytics('mock-event-id')
      ]);
      
      setInsightsData({
        demographics,
        eventAnalytics
      });
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data based on Figma design
  const attendeeAgeData = [
    { time: '01', '18-24': 20, '25-34': 28, '35-44': 38, '45+': 47 },
    { time: '02', '18-24': 25, '25-34': 32, '35-44': 42, '45+': 51 },
    { time: '03', '18-24': 30, '25-34': 35, '35-44': 45, '45+': 55 },
    { time: '04', '18-24': 35, '25-34': 38, '35-44': 48, '45+': 58 },
    { time: '05', '18-24': 40, '25-34': 42, '35-44': 52, '45+': 62 },
    { time: '06', '18-24': 45, '25-34': 45, '35-44': 55, '45+': 65 },
    { time: '07', '18-24': 50, '25-34': 48, '35-44': 58, '45+': 68 },
    { time: '08', '18-24': 55, '25-34': 52, '35-44': 62, '45+': 72 },
    { time: '09', '18-24': 60, '25-34': 55, '35-44': 65, '45+': 75 },
    { time: '10', '18-24': 65, '25-34': 58, '35-44': 68, '45+': 78 },
    { time: '11', '18-24': 70, '25-34': 62, '35-44': 72, '45+': 82 },
    { time: '12', '18-24': 75, '25-34': 65, '35-44': 75, '45+': 85 },
    { time: '13', '18-24': 80, '25-34': 68, '35-44': 78, '45+': 88 },
    { time: '14', '18-24': 85, '25-34': 72, '35-44': 82, '45+': 92 },
    { time: '15', '18-24': 90, '25-34': 75, '35-44': 85, '45+': 95 }
  ];

  const socialMediaData = [
    { platform: 'Instagram Mentions', count: 5200, icon: 'instagram' },
    { platform: 'Facebook Shares', count: 3800, icon: 'facebook' },
    { platform: 'Twitter Tweets', count: 1200, icon: 'twitter' },
    { platform: 'Event Check-ins (QR scans)', count: 9500, icon: 'qr' }
  ];

  const interestsData = [
    { name: 'Live Music', value: 50, percentage: 34.5, color: '#2196F3' },
    { name: 'Innovation', value: 35, percentage: 24.1, color: '#4CAF50' },
    { name: 'EDM Music', value: 25, percentage: 17.2, color: '#F44336' },
    { name: 'Food Festivals', value: 35, percentage: 24.1, color: '#FF9800' }
  ];

  const locationData = [
    { location: 'Colombo', count: 227, percentage: 36.9, color: '#2196F3' },
    { location: 'Kandy', count: 123, percentage: 20.0, color: '#F44336' },
    { location: 'Galle', count: 52, percentage: 8.5, color: '#4CAF50' },
    { location: 'Jaffna', count: 70, percentage: 11.4, color: '#FF9800' },
    { location: 'International', count: 143, percentage: 23.3, color: '#9C27B0' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getSocialIcon = (platform) => {
    const iconMap = {
      instagram: <InstagramIcon sx={{ color: '#E4405F' }} />,
      facebook: <FacebookIcon sx={{ color: '#1877F2' }} />,
      twitter: <TwitterIcon sx={{ color: '#1DA1F2' }} />,
      qr: <QrCodeIcon sx={{ color: '#4CAF50' }} />
    };
    return iconMap[platform] || <GroupIcon />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading Attendee Insights...</Typography>
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
          startIcon={<GroupIcon />}
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
              mb: 1
            }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Dashboard</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1
            }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Manage Events</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1
            }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Booking & Tickets</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1,
              bgcolor: 'green.500'
            }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Attendee Insights</Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              borderRadius: 1, 
              mb: 1
            }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Analytics & Reports</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Attendee Insights - {selectedEvent}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, color: 'grey.600' }}>
              <Typography variant="body1">
                Event Venue: Viharamahadevi Open Air Theater, Colombo
              </Typography>
              <Typography variant="body1">
                Event Date: April 12, 2025
              </Typography>
              <Typography variant="body1">
                Event Time: 6.00PM - 10.30PM
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon />
              <Typography variant="h6">Attendees: 523</Typography>
            </Box>
            
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
          </Box>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Attendee Age Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, height: 400 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  ATTENDEE AGE
                </Typography>
                
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={attendeeAgeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="18-24" stackId="1" fill="#2196F3" stroke="#2196F3" />
                    <Area type="monotone" dataKey="25-34" stackId="1" fill="#FF9800" stroke="#FF9800" />
                    <Area type="monotone" dataKey="35-44" stackId="1" fill="#F44336" stroke="#F44336" />
                    <Area type="monotone" dataKey="45+" stackId="1" fill="#4CAF50" stroke="#4CAF50" />
                  </ComposedChart>
                </ResponsiveContainer>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#2196F3', borderRadius: '50%' }} />
                    <Typography variant="body2">18-24</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#FF9800', borderRadius: '50%' }} />
                    <Typography variant="body2">25-34</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#F44336', borderRadius: '50%' }} />
                    <Typography variant="body2">35-44</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#4CAF50', borderRadius: '50%' }} />
                    <Typography variant="body2">45+</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Engagement & Social Media */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, height: 400 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Engagement & Social Media Reach
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.600', mb: 3 }}>
                  How attendees engaged with the event.
                </Typography>
                
                <List>
                  {socialMediaData.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'grey.100' }}>
                          {getSocialIcon(item.icon)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.platform}
                        secondary={`${item.count.toLocaleString()} engagements`}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    TOTAL COUNT: 19,700
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Attendee Interests */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, height: 350 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  ATTENDEE INTERESTS
                </Typography>
                
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={interestsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {interestsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <Box sx={{ mt: 2 }}>
                  {interestsData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: item.color, 
                        borderRadius: '50%',
                        mr: 1
                      }} />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.name} ({item.percentage}%)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Attendee Locations */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, height: 350 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  ATTENDEE LOCATIONS
                </Typography>
                
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                
                <Box sx={{ mt: 2 }}>
                  {locationData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: item.color, 
                        borderRadius: '50%',
                        mr: 1
                      }} />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.location}: {item.count} ({item.percentage}%)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Location Table */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, height: 350 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  ATTENDEE LOCATIONS
                </Typography>
                
                <Box sx={{ overflow: 'auto', maxHeight: 250 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                          Location
                        </th>
                        <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationData.map((item, index) => (
                        <tr key={index}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                bgcolor: item.color, 
                                borderRadius: '50%',
                                mr: 1
                              }} />
                              {item.location}
                            </Box>
                          </td>
                          <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                            {item.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AttendeeInsights;

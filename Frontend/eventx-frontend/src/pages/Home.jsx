// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'background.default',
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 560, mx: { xs: 'auto', md: 0 } }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 800, lineHeight: 1.1, color: 'text.primary', mb: 1 }}>
              Plan, Promote, and Sell Tickets
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
              Everything you need for events — in one place
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create stunning events, track performance, and delight attendees with a seamless booking experience.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {currentUser ? (
                <Button
                  component={Link}
                  to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  variant="contained"
                  size="large"
                  sx={{
                    px: 3,
                    py: 1.25,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 3,
                      py: 1.25,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                    }}
                  >
                    Get started
                  </Button>
                  <Button
                    component={Link}
                    to="/events"
                    variant="outlined"
                    size="large"
                    sx={{ px: 3, py: 1.25, borderRadius: 2, borderColor: 'primary.main', color: 'primary.main' }}
                  >
                    Browse Events
                  </Button>
                </>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
              No credit card required • Free plan available
            </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden', maxWidth: 560, mx: { xs: 'auto', md: 0 } }}>
              <img
                src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=60"
                alt="Event celebration"
                style={{ width: '100%', height: 360, objectFit: 'cover' }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

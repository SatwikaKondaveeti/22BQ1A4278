import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Link as LinkIcon, Analytics } from '@mui/icons-material';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import RedirectHandler from './components/RedirectHandler';
import logger from './logger';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function Navigation() {
  const location = useLocation();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<LinkIcon />}
          sx={{ 
            mr: 2,
            backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          }}
        >
          Shorten URLs
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/statistics"
          startIcon={<Analytics />}
          sx={{ 
            backgroundColor: location.pathname === '/statistics' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          }}
        >
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
}

// Custom Link component for Material-UI Button
const Link = React.forwardRef((props, ref) => {
  const { to, ...other } = props;
  return <a href={to} {...other} ref={ref} />;
});

function App() {
  logger.info('Application started', {
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<UrlShortener />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/:shortCode" element={<RedirectHandler />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
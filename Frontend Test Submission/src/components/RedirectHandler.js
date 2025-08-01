import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Link as LinkIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import urlService from '../services/urlService';
import logger from '../logger';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, expired, not-found
  const [urlData, setUrlData] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    logger.logUserAction('Short URL Accessed', { shortCode });
    
    try {
      const data = urlService.getUrlByShortCode(shortCode);
      
      if (data) {
        setUrlData(data);
        setStatus('success');
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              // Redirect to the original URL
              window.location.href = data.originalUrl;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        setStatus('not-found');
        logger.warn('Short URL not found', { shortCode });
      }
    } catch (error) {
      if (error.message.includes('expired')) {
        setStatus('expired');
        logger.warn('Short URL expired', { shortCode });
      } else {
        setStatus('not-found');
        logger.error('Error accessing short URL', { shortCode, error: error.message });
      }
    }
  }, [shortCode]);

  const handleRedirect = () => {
    if (urlData) {
      window.location.href = urlData.originalUrl;
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we redirect you to your destination.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (status === 'not-found') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Link Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The short link you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGoHome}
            startIcon={<LinkIcon />}
          >
            Create New Short Link
          </Button>
        </Paper>
      </Container>
    );
  }

  if (status === 'expired') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <AccessTimeIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Link Expired
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This short link has expired and is no longer available.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGoHome}
            startIcon={<LinkIcon />}
          >
            Create New Short Link
          </Button>
        </Paper>
      </Container>
    );
  }

  if (status === 'success' && urlData) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <LinkIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Redirecting...
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 3, mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Destination URL
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
                {urlData.originalUrl}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Redirecting in {countdown} seconds...
              </Typography>
            </CardContent>
          </Card>
          
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={handleRedirect}
              startIcon={<LinkIcon />}
            >
              Go Now
            </Button>
            <Button
              variant="outlined"
              onClick={handleGoHome}
            >
              Cancel
            </Button>
          </Stack>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              You will be automatically redirected to the destination URL.
              If you don't want to proceed, click Cancel.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    );
  }

  return null;
};

export default RedirectHandler; 
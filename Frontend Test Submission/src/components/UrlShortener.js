import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  ContentCopy,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';
import urlService from '../services/urlService';
import logger from '../logger';

const UrlShortener = () => {
  const [urls, setUrls] = useState([
    { id: 1, originalUrl: '', customShortCode: '', validityMinutes: 30 }
  ]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateShortCode = (shortCode) => {
    if (!shortCode) return true; // Optional field
    return /^[a-zA-Z0-9]{3,20}$/.test(shortCode);
  };

  const validateValidityMinutes = (minutes) => {
    const num = parseInt(minutes);
    return num >= 1 && num <= 10080; // 1 minute to 1 week
  };

  const validateForm = () => {
    const newErrors = {};
    
    urls.forEach((url, index) => {
      if (!url.originalUrl.trim()) {
        newErrors[`url${index}`] = 'Original URL is required';
      } else if (!validateUrl(url.originalUrl)) {
        newErrors[`url${index}`] = 'Please enter a valid URL (e.g., https://example.com)';
      }
      
      if (url.customShortCode && !validateShortCode(url.customShortCode)) {
        newErrors[`shortCode${index}`] = 'Shortcode must be 3-20 characters, letters and numbers only';
      }
      
      if (!validateValidityMinutes(url.validityMinutes)) {
        newErrors[`validity${index}`] = 'Validity must be between 1 minute and 1 week (10080 minutes)';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
    
    // Clear error for this field
    if (errors[`${field}${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${field}${index}`];
      setErrors(newErrors);
    }
    
    logger.debug('URL form input changed', { index, field, value });
  };

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, {
        id: Date.now(),
        originalUrl: '',
        customShortCode: '',
        validityMinutes: 30
      }]);
      logger.logUserAction('Add URL Field');
    }
  };

  const removeUrl = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      
      // Clear results for removed URL
      const newResults = results.filter((_, i) => i !== index);
      setResults(newResults);
      
      logger.logUserAction('Remove URL Field', { index });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      logger.warn('Form validation failed', { errors });
      return;
    }

    setLoading(true);
    setResults([]);
    
    logger.logUserAction('URL Shortening Attempt', { 
      urlCount: urls.length,
      urls: urls.map(u => ({ originalUrl: u.originalUrl, customShortCode: u.customShortCode }))
    });

    try {
      const newResults = [];
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        if (url.originalUrl.trim()) {
          const urlData = urlService.createShortUrl(
            url.originalUrl,
            url.customShortCode || null,
            parseInt(url.validityMinutes)
          );
          newResults.push(urlData);
        }
      }
      
      setResults(newResults);
      
      // Reset form
      setUrls([{ id: 1, originalUrl: '', customShortCode: '', validityMinutes: 30 }]);
      
      logger.info('URLs shortened successfully', { 
        count: newResults.length,
        shortCodes: newResults.map(r => r.shortCode)
      });

    } catch (err) {
      logger.error('URL shortening failed', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      logger.logUserAction('Copy to Clipboard', { text });
    } catch (err) {
      logger.error('Failed to copy to clipboard', { error: err.message });
    }
  };

  const getShortUrl = (shortCode) => {
    return `${window.location.origin}/${shortCode}`;
  };

  const formatExpiryTime = (expiresAt) => {
    return format(new Date(expiresAt), 'MMM dd, yyyy HH:mm');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Shorten Your URLs
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Create up to 5 short, shareable links with custom expiration times
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {urls.map((url, index) => (
            <Card key={url.id} sx={{ mb: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      URL {index + 1}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Original URL *"
                      placeholder="https://example.com/very-long-url"
                      value={url.originalUrl}
                      onChange={(e) => handleUrlChange(index, 'originalUrl', e.target.value)}
                      error={!!errors[`url${index}`]}
                      helperText={errors[`url${index}`]}
                      required
                    />
                  </Grid>

                  {showAdvanced && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Custom Shortcode (Optional)"
                          placeholder="my-custom-link"
                          value={url.customShortCode}
                          onChange={(e) => handleUrlChange(index, 'customShortCode', e.target.value)}
                          error={!!errors[`shortCode${index}`]}
                          helperText={errors[`shortCode${index}`] || "3-20 characters, letters and numbers only"}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Validity Period (minutes)"
                          type="number"
                          value={url.validityMinutes}
                          onChange={(e) => handleUrlChange(index, 'validityMinutes', e.target.value)}
                          error={!!errors[`validity${index}`]}
                          helperText={errors[`validity${index}`] || "Default: 30 minutes. Maximum: 1 week (10080 minutes)"}
                          inputProps={{ min: 1, max: 10080 }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
              
              {urls.length > 1 && (
                <CardActions>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => removeUrl(index)}
                  >
                    Remove URL
                  </Button>
                </CardActions>
              )}
            </Card>
          ))}

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addUrl}
              disabled={urls.length >= 5}
            >
              Add Another URL
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={<LinkIcon />}
          >
            {loading ? 'Creating Short URLs...' : `Shorten ${urls.length} URL${urls.length > 1 ? 's' : ''}`}
          </Button>
        </Box>
      </Paper>

      {/* Results Section */}
      {results.length > 0 && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="success.main">
            <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
            URLs Shortened Successfully!
          </Typography>
          
          <Grid container spacing={3}>
            {results.map((result, index) => (
              <Grid item xs={12} key={result.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Result {index + 1}
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Short URL:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <TextField
                            fullWidth
                            value={getShortUrl(result.shortCode)}
                            InputProps={{ readOnly: true }}
                            size="small"
                          />
                          <Tooltip title="Copy to clipboard">
                            <IconButton
                              onClick={() => copyToClipboard(getShortUrl(result.shortCode))}
                              color="primary"
                            >
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Original URL:
                          </Typography>
                          <Typography variant="body2" sx={{ wordBreak: 'break-all', mt: 0.5 }}>
                            {result.originalUrl}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Expires:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatExpiryTime(result.expiresAt)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          href={getShortUrl(result.shortCode)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Test Link
                        </Button>
                        <Chip
                          label={`${result.validityMinutes} minutes`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* How it works section */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          How it works
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" color="primary" gutterBottom>
                1
              </Typography>
              <Typography variant="h6" gutterBottom>
                Enter URLs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paste up to 5 long URLs in the input fields above
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" color="primary" gutterBottom>
                2
              </Typography>
              <Typography variant="h6" gutterBottom>
                Customize
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optionally add custom shortcodes and set expiration times
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" color="primary" gutterBottom>
                3
              </Typography>
              <Typography variant="h6" gutterBottom>
                Share
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Copy and share your short links with others
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UrlShortener; 
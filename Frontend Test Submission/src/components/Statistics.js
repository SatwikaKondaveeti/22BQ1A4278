import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Refresh,
  FileDownload,
  FileUpload,
  Delete,
  ContentCopy,
  Link,
  AccessTime,
  TrendingUp,
  Visibility,
  Schedule,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';
import urlService from '../services/urlService';
import logger from '../logger';

const Statistics = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [exportData, setExportData] = useState('');

  useEffect(() => {
    loadData();
    logger.logUserAction('Statistics Page Visited');
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const allUrls = urlService.getAllUrls();
      const statistics = urlService.getStatistics();
      
      setUrls(allUrls);
      setStats(statistics);
      
      logger.info('Statistics data loaded', { 
        urlCount: allUrls.length,
        totalClicks: statistics.totalClicks 
      });
    } catch (error) {
      logger.error('Failed to load statistics', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      const success = urlService.deleteUrl(id);
      if (success) {
        loadData();
        logger.logUserAction('URL Deleted', { urlId: id });
      }
    }
  };

  const handleExport = () => {
    const data = urlService.exportData();
    setExportData(data);
    setShowExport(true);
    logger.logUserAction('Data Export Requested');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = urlService.importData(e.target.result);
        if (success) {
          loadData();
          alert('Data imported successfully!');
          logger.logUserAction('Data Imported Successfully');
        } else {
          alert('Failed to import data. Please check the file format.');
          logger.error('Data import failed');
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const getStatusIcon = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return <Error color="error" />;
    if (diff < 1000 * 60 * 60) return <Warning color="warning" />;
    return <CheckCircle color="success" />;
  };

  const getStatusColor = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'error';
    if (diff < 1000 * 60 * 60) return 'warning';
    return 'success';
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      logger.logUserAction('Copy to Clipboard', { text });
    } catch (err) {
      logger.error('Failed to copy to clipboard', { error: err.message });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          Loading statistics...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          URL Statistics & Analytics
        </Typography>
        
        {/* Summary Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  {stats.totalUrls}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="secondary" gutterBottom>
                  {stats.totalClicks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" gutterBottom>
                  {stats.activeUrls}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="info.main" gutterBottom>
                  {stats.averageClicks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg. Clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
          >
            Refresh Data
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExport}
          >
            Export Data
          </Button>
          <Button
            variant="outlined"
            component="label"
            startIcon={<FileUpload />}
          >
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </Button>
        </Stack>

        {/* URLs List */}
        {urls.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              No URLs Found
            </Typography>
            <Typography variant="body2">
              Create your first shortened URL to see statistics here.
            </Typography>
          </Alert>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              Recent URLs
            </Typography>
            <Grid container spacing={3}>
              {urls.map((url) => (
                <Grid item xs={12} key={url.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Short Code: {url.shortCode}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(url.expiresAt)}
                            label={getTimeRemaining(url.expiresAt)}
                            color={getStatusColor(url.expiresAt)}
                            size="small"
                          />
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(url.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Original URL:
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
                        {url.originalUrl}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Created:</strong> {formatDate(url.createdAt)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Expires:</strong> {formatDate(url.expiresAt)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Visibility fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Clicks:</strong> {url.accessCount}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {url.lastAccessed && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Last Accessed:</strong> {formatDate(url.lastAccessed)}
                        </Typography>
                      )}
                      
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          href={`${window.location.origin}/${url.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<Link />}
                        >
                          Test Link
                        </Button>
                        <Tooltip title="Copy short URL">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`)}
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Export Dialog */}
      <Dialog
        open={showExport}
        onClose={() => setShowExport(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Copy the JSON data below to backup your URLs:
          </Typography>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={exportData}
            InputProps={{ readOnly: true }}
            variant="outlined"
            sx={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              copyToClipboard(exportData);
              alert('Data copied to clipboard!');
            }}
            startIcon={<ContentCopy />}
          >
            Copy to Clipboard
          </Button>
          <Button onClick={() => setShowExport(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Statistics; 
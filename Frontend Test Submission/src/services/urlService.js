import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';

class UrlService {
  constructor() {
    this.storageKey = 'url_shortener_data';
    this.loadUrls();
  }

  loadUrls() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.urls = stored ? JSON.parse(stored) : [];
      logger.info('URLs loaded from storage', { count: this.urls.length });
    } catch (error) {
      logger.error('Failed to load URLs from storage', { error: error.message });
      this.urls = [];
    }
  }

  saveUrls() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.urls));
      logger.debug('URLs saved to storage', { count: this.urls.length });
    } catch (error) {
      logger.error('Failed to save URLs to storage', { error: error.message });
    }
  }

  generateShortCode() {
    // Generate a 6-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  isShortCodeUnique(shortCode) {
    return !this.urls.some(url => url.shortCode === shortCode);
  }

  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  validateShortCode(shortCode) {
    // Alphanumeric, 3-20 characters
    const regex = /^[a-zA-Z0-9]{3,20}$/;
    return regex.test(shortCode);
  }

  createShortUrl(originalUrl, customShortCode = null, validityMinutes = 30) {
    logger.info('Creating short URL', { 
      originalUrl, 
      customShortCode, 
      validityMinutes 
    });

    // Validate original URL
    if (!this.validateUrl(originalUrl)) {
      logger.error('Invalid URL provided', { originalUrl });
      throw new Error('Please enter a valid URL');
    }

    // Handle custom shortcode
    let shortCode;
    if (customShortCode) {
      if (!this.validateShortCode(customShortCode)) {
        logger.error('Invalid custom shortcode', { customShortCode });
        throw new Error('Custom shortcode must be 3-20 characters long and contain only letters and numbers');
      }
      
      if (!this.isShortCodeUnique(customShortCode)) {
        logger.error('Custom shortcode already exists', { customShortCode });
        throw new Error('This custom shortcode is already in use. Please choose a different one.');
      }
      
      shortCode = customShortCode;
    } else {
      // Generate unique shortcode
      do {
        shortCode = this.generateShortCode();
      } while (!this.isShortCodeUnique(shortCode));
    }

    // Calculate expiration time
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60 * 1000);

    const urlData = {
      id: uuidv4(),
      originalUrl,
      shortCode,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      validityMinutes,
      accessCount: 0,
      lastAccessed: null
    };

    this.urls.push(urlData);
    this.saveUrls();

    logger.logUrlShortened(originalUrl, shortCode, validityMinutes);

    return urlData;
  }

  getUrlByShortCode(shortCode) {
    const url = this.urls.find(u => u.shortCode === shortCode);
    
    if (!url) {
      logger.error('URL not found', { shortCode });
      return null;
    }

    // Check if URL has expired
    const now = new Date();
    const expiresAt = new Date(url.expiresAt);
    
    if (now > expiresAt) {
      logger.logUrlExpired(shortCode, url.originalUrl);
      return null;
    }

    // Update access statistics
    url.accessCount++;
    url.lastAccessed = now.toISOString();
    this.saveUrls();

    logger.logUrlAccessed(shortCode, url.originalUrl, true);

    return url;
  }

  getAllUrls() {
    const now = new Date();
    
    // Filter out expired URLs
    const activeUrls = this.urls.filter(url => {
      const expiresAt = new Date(url.expiresAt);
      return now <= expiresAt;
    });

    // Remove expired URLs from storage
    if (activeUrls.length !== this.urls.length) {
      this.urls = activeUrls;
      this.saveUrls();
      logger.info('Expired URLs cleaned up', { 
        removed: this.urls.length - activeUrls.length 
      });
    }

    return activeUrls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  deleteUrl(id) {
    const index = this.urls.findIndex(url => url.id === id);
    if (index !== -1) {
      const deletedUrl = this.urls[index];
      this.urls.splice(index, 1);
      this.saveUrls();
      
      logger.info('URL deleted', { 
        id, 
        shortCode: deletedUrl.shortCode,
        originalUrl: deletedUrl.originalUrl 
      });
      
      return true;
    }
    return false;
  }

  getStatistics() {
    const urls = this.getAllUrls();
    const now = new Date();
    
    const stats = {
      totalUrls: urls.length,
      totalClicks: urls.reduce((sum, url) => sum + url.accessCount, 0),
      activeUrls: urls.filter(url => new Date(url.expiresAt) > now).length,
      expiredUrls: this.urls.length - urls.length,
      averageClicks: urls.length > 0 ? Math.round(urls.reduce((sum, url) => sum + url.accessCount, 0) / urls.length) : 0
    };

    logger.info('Statistics calculated', stats);
    return stats;
  }

  getRecentUrls(limit = 10) {
    return this.getAllUrls().slice(0, limit);
  }

  getMostClickedUrls(limit = 5) {
    return this.getAllUrls()
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  // Export data for backup
  exportData() {
    const data = {
      urls: this.urls,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    logger.info('Data exported', { urlCount: this.urls.length });
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data.urls && Array.isArray(data.urls)) {
        this.urls = data.urls;
        this.saveUrls();
        
        logger.info('Data imported successfully', { 
          urlCount: this.urls.length,
          importedAt: data.exportedAt 
        });
        
        return true;
      }
      throw new Error('Invalid data format');
    } catch (error) {
      logger.error('Failed to import data', { error: error.message });
      return false;
    }
  }
}

// Create and export a singleton instance
const urlService = new UrlService();

export default urlService; 
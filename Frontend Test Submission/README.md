# URL Shortener Web Application

A modern, user-friendly URL shortening application built with React that provides core URL shortening functionality and displays analytical insights.

## Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Shortcodes**: Optionally provide custom shortcodes (3-20 characters, alphanumeric)
- **Expiration Management**: Set custom validity periods (default: 30 minutes, max: 1 week)
- **Client-side Routing**: Handle short URL redirection within the React application
- **Unique Link Management**: Ensures all generated short links are unique

### Analytics & Insights
- **Click Tracking**: Monitor how many times each link is accessed
- **Statistics Dashboard**: View comprehensive analytics including total URLs, clicks, and averages
- **URL Management**: View, delete, and manage all your shortened URLs
- **Export/Import**: Backup and restore your URL data

### User Experience
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **Real-time Validation**: Instant feedback on URL format and custom shortcodes
- **Copy to Clipboard**: Easy one-click copying of shortened URLs
- **Mobile Responsive**: Works seamlessly on all device sizes

### Logging Integration
- **Comprehensive Logging**: All user actions, API calls, and system events are logged
- **Performance Monitoring**: Track response times and user interactions
- **Error Tracking**: Detailed error logging for debugging
- **Analytics Logging**: URL creation, access, and expiration events

## Technical Requirements

### Dependencies
- React 18.2.0
- React Router DOM 6.8.0
- UUID 9.0.0 (for unique ID generation)
- Date-fns 2.29.3 (for date formatting)

### Browser Support
- Modern browsers with ES6+ support
- LocalStorage for data persistence
- Clipboard API for copy functionality

## Installation & Setup

1. **Navigate to the project directory**:
   ```bash
   cd "Frontend Test Submission"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Creating Short URLs
1. Enter a valid URL in the input field
2. (Optional) Click "Show Advanced Options" to customize:
   - Custom shortcode (3-20 characters, alphanumeric)
   - Validity period in minutes (1-10080 minutes)
3. Click "Shorten URL" to generate your link
4. Copy the generated short URL and share it

### Viewing Statistics
1. Navigate to the "Statistics" page
2. View summary statistics (total URLs, clicks, etc.)
3. Browse your recent URLs with detailed information
4. Export/import your data for backup

### URL Redirection
- When someone visits a short URL (e.g., `http://localhost:3000/abc123`), they will be automatically redirected to the original URL
- Expired or invalid URLs show appropriate error messages

## Architecture

### Components
- **App.js**: Main application with routing
- **UrlShortener.js**: URL creation form and result display
- **Statistics.js**: Analytics dashboard and URL management
- **RedirectHandler.js**: Handles short URL redirection

### Services
- **urlService.js**: Core business logic for URL management
- **logger.js**: Comprehensive logging middleware

### Data Storage
- Uses browser localStorage for data persistence
- Automatic cleanup of expired URLs
- Export/import functionality for data backup

## Logging Features

The application extensively uses the custom Logging Middleware for:
- User action tracking
- URL creation and access logging
- Error monitoring
- Performance tracking
- System event logging

All logs include timestamps, user agent information, and detailed context data.

## Compliance

This application is designed to comply with the "Campus Hiring Evaluation - Pre-Test Setup" requirements:
- ✅ Mandatory Logging Middleware integration
- ✅ React application architecture
- ✅ No authentication required (pre-authorized users)
- ✅ Unique short link management
- ✅ Default 30-minute validity
- ✅ Custom shortcode support
- ✅ Client-side routing and redirection

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

### Project Structure
```
Frontend Test Submission/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UrlShortener.js
│   │   ├── Statistics.js
│   │   └── RedirectHandler.js
│   ├── services/
│   │   └── urlService.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## License

This project is created for evaluation purposes by Afford Medical Technologies Private Limited. 
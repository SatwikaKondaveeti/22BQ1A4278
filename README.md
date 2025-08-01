# URL Shortener Project

This repository contains a complete React URL Shortener Web Application developed for the Campus Hiring Evaluation - Pre-Test Setup.

## Project Structure

```
22BQ1A4278/
├── Logging Middleware/
│   └── logger.js                    # Comprehensive logging middleware
├── Frontend Test Submission/
│   ├── public/
│   │   ├── index.html              # Main HTML file
│   │   └── manifest.json           # Web app manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── UrlShortener.js    # Main URL shortening component
│   │   │   ├── Statistics.js       # Analytics dashboard
│   │   │   └── RedirectHandler.js  # URL redirection handler
│   │   ├── services/
│   │   │   └── urlService.js       # Core business logic
│   │   ├── App.js                  # Main React application
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Dependencies and scripts
│   └── README.md                   # Detailed project documentation
└── README.md                       # This file
```

## Key Features

### ✅ Mandatory Requirements Met
- **Logging Middleware Integration**: Extensive use of custom logging throughout the application
- **React Architecture**: Built entirely with React and modern JavaScript
- **No Authentication**: Pre-authorized users as specified
- **Unique Short Links**: All generated shortcodes are guaranteed unique
- **Default 30-minute Validity**: URLs expire after 30 minutes by default
- **Custom Shortcodes**: Optional custom shortcodes (3-20 characters, alphanumeric)
- **Client-side Routing**: Handles URL redirection within the React application

### 🚀 Additional Features
- **Modern UI/UX**: Beautiful gradient design with responsive layout
- **Analytics Dashboard**: Comprehensive statistics and insights
- **Data Export/Import**: Backup and restore functionality
- **Mobile Responsive**: Works perfectly on all device sizes
- **Real-time Validation**: Instant feedback on form inputs
- **Copy to Clipboard**: Easy sharing of shortened URLs

## Quick Start

1. **Navigate to the Frontend directory**:
   ```bash
   cd "Frontend Test Submission"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

4. **Open your browser** to `http://localhost:3000`

## Technology Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **Styling**: Custom CSS with modern design
- **Data Storage**: Browser localStorage
- **Logging**: Custom logging middleware
- **Utilities**: UUID for unique IDs, date-fns for date formatting

## Compliance Verification

This application fully complies with the evaluation requirements:

- ✅ **Mandatory Logging Integration**: All user actions, system events, and errors are logged
- ✅ **React Application**: Built entirely with React components and hooks
- ✅ **Authentication**: No login/registration required (pre-authorized users)
- ✅ **Short Link Uniqueness**: Guaranteed unique shortcodes with collision detection
- ✅ **Default Validity**: 30-minute default expiration time
- ✅ **Custom Shortcodes**: Optional custom shortcodes with validation
- ✅ **Redirection**: Client-side routing handles all URL redirections

## Logging Features

The application extensively uses the custom Logging Middleware for:
- User action tracking (navigation, form submissions, clicks)
- URL lifecycle events (creation, access, expiration)
- Error monitoring and debugging
- Performance tracking
- System event logging

All logs include detailed context, timestamps, and user agent information.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

The application is ready for immediate use and can be extended with:
- Additional analytics features
- User authentication (if needed)
- Database integration
- API endpoints for backend services

---

**Created for Campus Hiring Evaluation by Afford Medical Technologies Private Limited**
class Logger {
    constructor() {
        this.logs = [];
        this.logLevels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
        this.currentLevel = this.logLevels.INFO;
    }

    setLogLevel(level) {
        if (this.logLevels[level] !== undefined) {
            this.currentLevel = this.logLevels[level];
        }
    }

    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
            component: this.getCallerInfo()
        };
        return logEntry;
    }

    getCallerInfo() {
        const stack = new Error().stack;
        const lines = stack.split('\n');
        // Skip the first 3 lines (Error, Logger method, calling method)
        const callerLine = lines[3] || '';
        const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (match) {
            return {
                function: match[1],
                file: match[2].split('/').pop(),
                line: match[3],
                column: match[4]
            };
        }
        return { function: 'unknown', file: 'unknown', line: 'unknown', column: 'unknown' };
    }

    log(level, message, data = null) {
        if (this.logLevels[level] <= this.currentLevel) {
            const logEntry = this.formatMessage(level, message, data);
            this.logs.push(logEntry);
            
            // Console output for development
            const consoleMessage = `[${level}] ${message}`;
            switch (level) {
                case 'ERROR':
                    console.error(consoleMessage, data);
                    break;
                case 'WARN':
                    console.warn(consoleMessage, data);
                    break;
                case 'INFO':
                    console.info(consoleMessage, data);
                    break;
                case 'DEBUG':
                    console.debug(consoleMessage, data);
                    break;
                default:
                    console.log(consoleMessage, data);
            }
        }
    }

    error(message, data = null) {
        this.log('ERROR', message, data);
    }

    warn(message, data = null) {
        this.log('WARN', message, data);
    }

    info(message, data = null) {
        this.log('INFO', message, data);
    }

    debug(message, data = null) {
        this.log('DEBUG', message, data);
    }

    getLogs(level = null, limit = null) {
        let filteredLogs = this.logs;
        
        if (level) {
            filteredLogs = this.logs.filter(log => log.level === level);
        }
        
        if (limit) {
            filteredLogs = filteredLogs.slice(-limit);
        }
        
        return filteredLogs;
    }

    clearLogs() {
        this.logs = [];
    }

    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    // Performance logging
    time(label) {
        console.time(label);
        this.info(`Timer started: ${label}`);
    }

    timeEnd(label) {
        console.timeEnd(label);
        this.info(`Timer ended: ${label}`);
    }

    // User action logging
    logUserAction(action, details = {}) {
        this.info(`User Action: ${action}`, {
            action,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }

    // API call logging
    logApiCall(method, url, status, responseTime = null) {
        this.info(`API Call: ${method} ${url}`, {
            method,
            url,
            status,
            responseTime,
            timestamp: new Date().toISOString()
        });
    }

    // URL shortening specific logging
    logUrlShortened(originalUrl, shortCode, validityMinutes) {
        this.info(`URL Shortened`, {
            originalUrl,
            shortCode,
            validityMinutes,
            timestamp: new Date().toISOString()
        });
    }

    logUrlAccessed(shortCode, originalUrl, success) {
        this.info(`URL Accessed`, {
            shortCode,
            originalUrl,
            success,
            timestamp: new Date().toISOString()
        });
    }

    logUrlExpired(shortCode, originalUrl) {
        this.warn(`URL Expired`, {
            shortCode,
            originalUrl,
            timestamp: new Date().toISOString()
        });
    }
}

// Create and export a singleton instance
const logger = new Logger();

export default logger; 
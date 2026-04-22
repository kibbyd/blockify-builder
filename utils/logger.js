/**
 * Server-side Logger Utility
 * Provides consistent logging with timestamps and levels
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.enableDebug = this.isDevelopment;
  }

  _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  error(message, error = null) {
    console.error(this._formatMessage(LOG_LEVELS.ERROR, message));
    if (error && error.stack) {
      console.error(error.stack);
    }
  }

  warn(message) {
    console.warn(this._formatMessage(LOG_LEVELS.WARN, message));
  }

  info(message) {
    console.log(this._formatMessage(LOG_LEVELS.INFO, message));
  }

  debug(message) {
    if (this.enableDebug) {
      console.log(this._formatMessage(LOG_LEVELS.DEBUG, message));
    }
  }

  request(req) {
    if (this.enableDebug) {
      console.log(this._formatMessage(LOG_LEVELS.DEBUG, `${req.method} ${req.path}`));
    }
  }
}

module.exports = new Logger();

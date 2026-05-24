// API environment config
// Set window.API_ENV to 'development' or 'production' before loading common.js, or set here
window.API_ENV = window.API_ENV || 'development';

window.API_CONFIG = {
  development: {
    BASE_API_URL: 'http://localhost:5106/api/Contact'
  },
  production: {
    BASE_API_URL: 'https://ex.bakerly.co.za/api/Contact'
  }
};

window.BASE_API_URL = window.API_CONFIG[window.API_ENV].BASE_API_URL;

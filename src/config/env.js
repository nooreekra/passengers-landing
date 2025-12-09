// Environment configuration for IMS Frontend integration
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'https://app-ims-api-test-neu.azurewebsites.net',
  AUTH_ENDPOINT: import.meta.env.VITE_AUTH_ENDPOINT || '/api/auth/login',
  REFRESH_ENDPOINT: import.meta.env.VITE_REFRESH_ENDPOINT || '/api/auth/refresh',
  LOGOUT_ENDPOINT: import.meta.env.VITE_LOGOUT_ENDPOINT || '/api/auth/logout',
  IDLE_TIMEOUT_MIN: import.meta.env.VITE_IDLE_TIMEOUT_MIN || 30,
  LOGOUT_PATH: import.meta.env.VITE_LOGOUT_PATH || '/',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Dashboard URLs for different environments
  DASHBOARD_URL_DEV: import.meta.env.VITE_DASHBOARD_URL_DEV || 'https://app-ims-web-test-neu.azurewebsites.net/passenger',
  DASHBOARD_URL_PROD: import.meta.env.VITE_DASHBOARD_URL_PROD || 'https://imssavvy.co.uk/passenger',
  
  // Get the correct dashboard URL based on environment
  get DASHBOARD_URL() {
    return this.NODE_ENV === 'production' ? this.DASHBOARD_URL_PROD : this.DASHBOARD_URL_DEV
  }
}

// Debug: Log environment variables in development
if (import.meta.env.DEV) {
  console.log('🔧 Environment variables loaded:', {
    API_URL: config.API_URL,
    AUTH_ENDPOINT: config.AUTH_ENDPOINT,
    DASHBOARD_URL: config.DASHBOARD_URL,
    DASHBOARD_URL_DEV: config.DASHBOARD_URL_DEV,
    DASHBOARD_URL_PROD: config.DASHBOARD_URL_PROD,
    NODE_ENV: config.NODE_ENV,
    IDLE_TIMEOUT_MIN: config.IDLE_TIMEOUT_MIN
  })
  console.log('🔧 Raw env vars:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
    VITE_DASHBOARD_URL_DEV: import.meta.env.VITE_DASHBOARD_URL_DEV,
    VITE_DASHBOARD_URL_PROD: import.meta.env.VITE_DASHBOARD_URL_PROD
  })
}

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${config.API_URL}${endpoint}`
}

// Helper function to get auth headers
export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
}

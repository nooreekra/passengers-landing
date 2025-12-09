import { getApiUrl, getAuthHeaders, config } from '../config/env'

class AuthService {
  constructor() {
    this.baseURL = getApiUrl('')
  }

  // Login user with email and password
  async login(credentials) {
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Store tokens and user data (API returns accessToken, not access_token)
      if (data.accessToken) {
        localStorage.setItem('access_token', data.accessToken)
      }
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken)
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      if (data.accessTokenExpiresAt) {
        // Convert ISO string to timestamp
        const expiresAt = new Date(data.accessTokenExpiresAt).getTime()
        localStorage.setItem('token_expires_at', expiresAt)
      }

      // Create session if user data is available (like in ims-frontend)
      if (data.accessToken && data.user) {
        await this.createSession(data.accessToken, data.user.role?.type || 'Partnership')
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(getApiUrl('/api/auth/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
      if (data.expires_in) {
        localStorage.setItem('token_expires_at', Date.now() + (data.expires_in * 1000))
      }

      return data
    } catch (error) {
      console.error('Token refresh error:', error)
      this.logout()
      throw error
    }
  }

  // Logout user
  async logout() {
    try {
      const accessToken = localStorage.getItem('access_token')
      
      if (accessToken) {
        await fetch(getApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: getAuthHeaders(accessToken)
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all stored data
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      localStorage.removeItem('token_expires_at')
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token')
    const expiresAt = localStorage.getItem('token_expires_at')
    
    if (!token) return false
    
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
      this.logout()
      return false
    }
    
    return true
  }

  // Get current user data
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem('access_token')
  }

  // Create session on dashboard (similar to ims-frontend)
  // For cross-domain scenarios, we redirect with token in URL for automatic auth
  async createSession(accessToken, role) {
    try {
      // Check if dashboard is on the same origin
      const dashboardUrl = config.DASHBOARD_URL
      const currentOrigin = window.location.origin
      const dashboardOrigin = new URL(dashboardUrl).origin
      
      if (currentOrigin === dashboardOrigin) {
        // Same origin - create session via API route (like in ims-frontend)
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, role }),
          credentials: 'include',
        })
      }
      // For different origins, token will be passed via URL parameter
      // Dashboard will automatically authenticate using the token
    } catch (error) {
      console.warn('Session creation skipped (dashboard is on different domain):', error)
      // This is expected for cross-domain scenarios
    }
  }

  // Redirect to dashboard with token for automatic authentication
  redirectToDashboard(accessToken, role) {
    const dashboardUrl = new URL(config.DASHBOARD_URL)
    
    // Add token and role as URL parameters for automatic authentication
    dashboardUrl.searchParams.set('token', accessToken)
    dashboardUrl.searchParams.set('role', role)
    dashboardUrl.searchParams.set('autoAuth', 'true')
    
    // Redirect to dashboard - it will automatically authenticate using the token
    window.location.href = dashboardUrl.toString()
  }

  // Register new user
  async register(userData) {
    try {
      // Определяем язык из браузера или используем значение по умолчанию
      const language = navigator.language || 'en-US'
      
      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      // Если статус 204 No Content, возвращаем пустой объект
      if (response.status === 204) {
        return {}
      }

      // Проверяем, есть ли тело ответа перед парсингом JSON
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        if (text) {
          return JSON.parse(text)
        }
      }
      
      return {}
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Confirm email with code
  async confirmEmail(email, code) {
    try {
      // Определяем язык из браузера или используем значение по умолчанию
      const language = navigator.language || 'en-US'
      
      const response = await fetch(getApiUrl('/api/auth/confirm'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify({
          email: email,
          code: code
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      // Если статус 204 No Content, возвращаем пустой объект
      if (response.status === 204) {
        return {}
      }

      // Проверяем, есть ли тело ответа перед парсингом JSON
      const contentType = response.headers.get('content-type')
      let data = {}
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        if (text) {
          data = JSON.parse(text)
        }
      }
      
      // Store tokens and user data if provided
      if (data.accessToken) {
        localStorage.setItem('access_token', data.accessToken)
      }
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken)
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      if (data.accessTokenExpiresAt) {
        const expiresAt = new Date(data.accessTokenExpiresAt).getTime()
        localStorage.setItem('token_expires_at', expiresAt)
      }

      // Create session if user data is available (like in ims-frontend)
      if (data.accessToken && data.user) {
        await this.createSession(data.accessToken, data.user.role?.type || 'Partnership')
      }

      return data
    } catch (error) {
      console.error('Email confirmation error:', error)
      throw error
    }
  }
}

export default new AuthService()

import React, { useState, useEffect } from 'react'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'
import ConfirmForm from './ConfirmForm'
import AgreementsModal from './AgreementsModal'
import authService from '../services/authService'
import { config } from '../config/env'

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showAgreements, setShowAgreements] = useState(false)

  // Закрытие модалки по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Блокировка скролла при открытой модалке
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLogin = async (credentials) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await authService.login(credentials)
      
      if (response && response.accessToken) {
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          window.location.href = config.DASHBOARD_URL
        }, 1000)
      } else {
        setError('Authorization error. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Invalid email or password')
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('Access denied. Contact administrator')
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        setError('Server error. Please try later')
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Network error. Check your internet connection')
      } else {
        setError(err.message || 'An error occurred during login. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (userData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await authService.register(userData)
      setRegistrationEmail(userData.email)
      setShowConfirm(true)
      setSuccess('Registration successful! Check your email for the confirmation code.')
      
      // Автоматически скрываем сообщение об успехе через 5 секунд
      setTimeout(() => {
        setSuccess('')
      }, 5000)
    } catch (err) {
      console.error('Registration error:', err)
      
      if (err.message.includes('400') || err.message.includes('Bad Request')) {
        setError('Check the correctness of the entered data')
      } else if (err.message.includes('409') || err.message.includes('Conflict')) {
        setError('User with this email already exists')
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        setError('Server error. Please try later')
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Network error. Check your internet connection')
      } else {
        setError(err.message || 'An error occurred during registration. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async (confirmData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await authService.confirmEmail(confirmData.email, confirmData.code)
      
      if (response && response.accessToken) {
        setSuccess('Email successfully confirmed! Redirecting...')
        setTimeout(() => {
          window.location.href = config.DASHBOARD_URL
        }, 1500)
      } else {
        setSuccess('Email successfully confirmed!')
        setTimeout(() => {
          setShowConfirm(false)
          setMode('login')
        }, 2000)
      }
    } catch (err) {
      console.error('Confirmation error:', err)
      
      if (err.message.includes('400') || err.message.includes('Bad Request')) {
        setError('Invalid confirmation code')
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Confirmation code not found or expired')
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        setError('Server error. Please try later')
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Network error. Check your internet connection')
      } else {
        setError(err.message || 'An error occurred during confirmation. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToRegistration = () => {
    setShowConfirm(false)
    setError('')
    setSuccess('')
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setError('')
    setSuccess('')
    setShowConfirm(false)
    setShowAgreements(false)
    setRegistrationEmail('')
    
    // Если переключаемся на регистрацию, показываем модалку соглашений
    if (newMode === 'register') {
      setShowAgreements(true)
    }
  }

  const handleAgreementsAccept = () => {
    setShowAgreements(false)
    // После принятия соглашений показываем форму регистрации
  }

  const handleClose = () => {
    setMode('login')
    setError('')
    setSuccess('')
    setShowConfirm(false)
    setShowAgreements(false)
    setRegistrationEmail('')
    onClose()
  }

  if (!isOpen) return null

  // Если нужно показать модалку соглашений, показываем её
  if (showAgreements && mode === 'register') {
    return (
      <AgreementsModal
        isOpen={true}
        onClose={() => {
          setShowAgreements(false)
          setMode('login')
        }}
        onAccept={handleAgreementsAccept}
        entityType="Business"
      />
    )
  }

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">Welcome</h2>
          <p className="auth-modal-subtitle">
            {showConfirm 
              ? 'Confirm your email' 
              : mode === 'login'
                ? 'Sign in to your account'
                : 'Sign up'}
          </p>
        </div>

        {!showConfirm && (
          <div className="tabs-container">
            <button
              className={`tab-button ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleModeChange('login')}
              disabled={isLoading}
            >
              Sign In
            </button>
            <button
              className={`tab-button ${mode === 'register' ? 'active' : ''}`}
              onClick={() => handleModeChange('register')}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        {showConfirm ? (
          <ConfirmForm
            email={registrationEmail}
            onSubmit={handleConfirm}
            isLoading={isLoading}
            onBack={handleBackToRegistration}
          />
        ) : mode === 'login' ? (
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        ) : (
          <RegistrationForm
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

export default AuthModal








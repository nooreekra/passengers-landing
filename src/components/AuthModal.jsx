import React, { useState, useEffect } from 'react'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'
import ConfirmForm from './ConfirmForm'
import authService from '../services/authService'
import { config } from '../config/env'

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

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
        setSuccess('Успешный вход! Перенаправление...')
        setTimeout(() => {
          window.location.href = config.DASHBOARD_URL
        }, 1000)
      } else {
        setError('Ошибка авторизации. Попробуйте еще раз.')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Неверный email или пароль')
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        setError('Доступ запрещен. Обратитесь к администратору')
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        setError('Ошибка сервера. Попробуйте позже')
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Ошибка сети. Проверьте подключение к интернету')
      } else {
        setError(err.message || 'Произошла ошибка при входе. Попробуйте еще раз.')
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
      setSuccess('Регистрация успешна! Проверьте email для получения кода подтверждения.')
    } catch (err) {
      console.error('Registration error:', err)
      
      if (err.message.includes('400') || err.message.includes('Bad Request')) {
        setError('Проверьте правильность введенных данных')
      } else if (err.message.includes('409') || err.message.includes('Conflict')) {
        setError('Пользователь с таким email уже существует')
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        setError('Ошибка сервера. Попробуйте позже')
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Ошибка сети. Проверьте подключение к интернету')
      } else {
        setError(err.message || 'Произошла ошибка при регистрации. Попробуйте еще раз.')
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
        setSuccess('Email успешно подтвержден! Перенаправление...')
        setTimeout(() => {
          window.location.href = config.DASHBOARD_URL
        }, 1500)
      } else {
        setSuccess('Email успешно подтвержден!')
        setTimeout(() => {
          setShowConfirm(false)
          setMode('login')
        }, 2000)
      }
    } catch (err) {
      console.error('Confirmation error:', err)
      
      if (err.message.includes('400') || err.message.includes('Bad Request')) {
        setError('Неверный код подтверждения')
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Код подтверждения не найден или истек')
      } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
        setError('Ошибка сервера. Попробуйте позже')
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError('Ошибка сети. Проверьте подключение к интернету')
      } else {
        setError(err.message || 'Произошла ошибка при подтверждении. Попробуйте еще раз.')
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
    setRegistrationEmail('')
  }

  const handleClose = () => {
    setMode('login')
    setError('')
    setSuccess('')
    setShowConfirm(false)
    setRegistrationEmail('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">Добро пожаловать</h2>
          <p className="auth-modal-subtitle">
            {showConfirm 
              ? 'Подтвердите ваш email' 
              : mode === 'login'
                ? 'Войдите в свой аккаунт'
                : 'Зарегистрируйтесь'}
          </p>
        </div>

        {!showConfirm && (
          <div className="tabs-container">
            <button
              className={`tab-button ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleModeChange('login')}
              disabled={isLoading}
            >
              Вход
            </button>
            <button
              className={`tab-button ${mode === 'register' ? 'active' : ''}`}
              onClick={() => handleModeChange('register')}
              disabled={isLoading}
            >
              Регистрация
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




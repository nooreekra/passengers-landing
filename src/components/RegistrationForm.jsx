"use client"

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('auth.registrationForm.errors.firstNameRequired')
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('auth.registrationForm.errors.lastNameRequired')
    }
    
    if (!formData.email) {
      newErrors.email = t('auth.registrationForm.errors.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.registrationForm.errors.emailInvalid')
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.registrationForm.errors.passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.registrationForm.errors.passwordMinLength')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="firstName" className="form-label">
          {t('auth.registrationForm.firstName')}
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={`form-input ${errors.firstName ? 'error' : ''}`}
          placeholder={t('auth.registrationForm.enterFirstName')}
          disabled={isLoading}
        />
        {errors.firstName && (
          <div className="field-error">{errors.firstName}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="lastName" className="form-label">
          {t('auth.registrationForm.lastName')}
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={`form-input ${errors.lastName ? 'error' : ''}`}
          placeholder={t('auth.registrationForm.enterLastName')}
          disabled={isLoading}
        />
        {errors.lastName && (
          <div className="field-error">{errors.lastName}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          {t('auth.registrationForm.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder={t('auth.registrationForm.enterEmail')}
          disabled={isLoading}
        />
        {errors.email && (
          <div className="field-error">{errors.email}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          {t('auth.registrationForm.password')}
        </label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder={t('auth.registrationForm.enterPassword')}
            disabled={isLoading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            disabled={isLoading}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && (
          <div className="field-error">{errors.password}</div>
        )}
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            {t('auth.registrationForm.registering')}
          </> 
        ) : (
          t('auth.registrationForm.signUp')
        )}
      </button>
    </form>
  )
}

export default RegistrationForm










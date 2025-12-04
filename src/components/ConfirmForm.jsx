import React, { useState } from 'react'

const ConfirmForm = ({ email, onSubmit, isLoading, onBack }) => {
  const [formData, setFormData] = useState({
    code: ''
  })
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
    
    if (!formData.code.trim()) {
      newErrors.code = 'Код подтверждения обязателен'
    } else if (formData.code.trim().length < 4) {
      newErrors.code = 'Код должен содержать минимум 4 символа'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        email: email,
        code: formData.code.trim()
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="code" className="form-label">
          Код подтверждения
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className={`form-input ${errors.code ? 'error' : ''}`}
          placeholder="Введите код из email"
          disabled={isLoading}
          maxLength="10"
        />
        {errors.code && (
          <div className="field-error">{errors.code}</div>
        )}
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#718096' }}>
          Код отправлен на {email}
        </div>
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            Подтверждение...
          </>
        ) : (
          'Подтвердить'
        )}
      </button>

      {onBack && (
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          disabled={isLoading}
        >
          Назад
        </button>
      )}
    </form>
  )
}

export default ConfirmForm






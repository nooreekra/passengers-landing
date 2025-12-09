import React, { useState, useEffect } from 'react'
import agreementsService from '../services/agreementsService'

const AgreementsModal = ({ isOpen, onClose, onAccept, entityType = 'Business' }) => {
  const [agreements, setAgreements] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [readAgreements, setReadAgreements] = useState(new Set())
  const [currentAgreementIndex, setCurrentAgreementIndex] = useState(0)

  // Загрузка соглашений при открытии модалки
  useEffect(() => {
    if (isOpen) {
      loadAgreements()
    }
  }, [isOpen, entityType])

  const loadAgreements = async () => {
    setIsLoading(true)
    setError('')
    setReadAgreements(new Set())
    setCurrentAgreementIndex(0)
    
    try {
      const data = await agreementsService.getAgreements(entityType)
      setAgreements(data || [])
    } catch (err) {
      console.error('Error loading agreements:', err)
      setError('Failed to load agreements. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    // Отмечаем текущее соглашение как прочитанное
    setReadAgreements(prev => new Set([...prev, currentAgreementIndex]))
    
    if (currentAgreementIndex < agreements.length - 1) {
      setCurrentAgreementIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentAgreementIndex > 0) {
      setCurrentAgreementIndex(prev => prev - 1)
    }
  }

  const handleAccept = () => {
    // Проверяем, что все соглашения прочитаны
    const allRead = agreements.every((_, index) => readAgreements.has(index))
    if (allRead && agreements.length > 0) {
      onAccept()
    } else if (agreements.length === 0) {
      // Если соглашений нет, разрешаем регистрацию
      onAccept()
    }
  }

  const allAgreementsRead = agreements.length > 0 
    ? agreements.every((_, index) => readAgreements.has(index))
    : true

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

  // Автоматически отмечаем последний документ как прочитанный при его просмотре
  useEffect(() => {
    if (agreements.length > 0 && currentAgreementIndex === agreements.length - 1) {
      // Если это последний документ, отмечаем его как прочитанный
      setReadAgreements(prev => {
        const newSet = new Set(prev)
        newSet.add(currentAgreementIndex)
        return newSet
      })
    }
  }, [currentAgreementIndex, agreements.length])

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

  if (!isOpen) return null

  const currentAgreement = agreements[currentAgreementIndex]

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content agreements-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">Agreements</h2>
          <p className="auth-modal-subtitle">
            Please review the agreements before registration
          </p>
        </div>

        {isLoading ? (
          <div className="agreements-loading">
            <span className="loading-spinner"></span>
            <p>Loading agreements...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : agreements.length === 0 ? (
          <div className="agreements-empty">
            <p>No agreements found</p>
            <button
              className="login-button"
              onClick={handleAccept}
            >
              Continue Registration
            </button>
          </div>
        ) : (
          <>
            <div className="agreements-counter">
              Document {currentAgreementIndex + 1} of {agreements.length}
            </div>

            <div className="agreements-navigation">
              <button
                className="agreement-nav-button"
                onClick={handlePrevious}
                disabled={currentAgreementIndex === 0}
              >
                ← Previous
              </button>
              <button
                className="agreement-nav-button"
                onClick={handleNext}
                disabled={currentAgreementIndex === agreements.length - 1}
              >
                {currentAgreementIndex === agreements.length - 1 ? 'All documents viewed' : 'Next →'}
              </button>
            </div>

            <div 
              className="agreement-content"
            >
              <div className="agreement-item">
                <h3 className="agreement-title">{currentAgreement.title}</h3>
                <div className="agreement-meta">
                  <span>Version: {currentAgreement.version}</span>
                  <span>Updated: {new Date(currentAgreement.updatedAt).toLocaleDateString('en-US')}</span>
                </div>
                <div 
                  className="agreement-text"
                  dangerouslySetInnerHTML={{ __html: currentAgreement.content }}
                />
                <div className="agreement-status">
                  {readAgreements.has(currentAgreementIndex) ? (
                    <span className="agreement-read">✓ Read</span>
                  ) : (
                    <span className="agreement-unread">Click "Next" to continue</span>
                  )}
                </div>
              </div>
            </div>

            <div className="agreements-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(readAgreements.size / agreements.length) * 100}%` }}
                />
              </div>
              <p className="progress-text">
                Read: {readAgreements.size} of {agreements.length}
              </p>
            </div>

            <button
              className="login-button"
              onClick={handleAccept}
              disabled={!allAgreementsRead}
            >
              {allAgreementsRead ? 'Accept and Continue Registration' : 'Please read all agreements'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default AgreementsModal


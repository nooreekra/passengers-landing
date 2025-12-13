"use client"

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import agreementsService from '../services/agreementsService'

const AgreementsModal = ({ isOpen, onClose, onAccept, entityType = 'Business' }) => {
  const { t } = useTranslation()
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
      setError(t('auth.agreementsModal.loadError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // Считаем соглашение прочитанным, если прокручено более 90%
    if (scrollPercentage >= 0.9) {
      setReadAgreements(prev => new Set([...prev, currentAgreementIndex]))
    }
  }

  const handleNext = () => {
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
          <h2 className="auth-modal-title">{t('auth.agreementsModal.title')}</h2>
          <p className="auth-modal-subtitle">
            {t('auth.agreementsModal.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="agreements-loading">
            <span className="loading-spinner"></span>
            <p>{t('auth.agreementsModal.loading')}</p>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : agreements.length === 0 ? (
          <div className="agreements-empty">
            <p>{t('auth.agreementsModal.noAgreements')}</p>
            <button
              className="login-button"
              onClick={handleAccept}
            >
              {t('auth.agreementsModal.continueRegistration')}
            </button>
          </div>
        ) : (
          <>
            <div className="agreements-counter">
              {t('auth.agreementsModal.document')} {currentAgreementIndex + 1} {t('auth.agreementsModal.of')} {agreements.length}
            </div>

            <div className="agreements-navigation">
              <button
                className="agreement-nav-button"
                onClick={handlePrevious}
                disabled={currentAgreementIndex === 0}
              >
                ← {t('auth.agreementsModal.previous')}
              </button>
              <button
                className="agreement-nav-button"
                onClick={handleNext}
                disabled={currentAgreementIndex === agreements.length - 1}
              >
                {t('auth.agreementsModal.next')} →
              </button>
            </div>

            <div 
              className="agreement-content"
              onScroll={handleScroll}
            >
              <div className="agreement-item">
                <h3 className="agreement-title">{currentAgreement.title}</h3>
                <div className="agreement-meta">
                  <span>{t('auth.agreementsModal.version')}: {currentAgreement.version}</span>
                  <span>{t('auth.agreementsModal.updated')}: {new Date(currentAgreement.updatedAt).toLocaleDateString()}</span>
                </div>
                <div 
                  className="agreement-text"
                  dangerouslySetInnerHTML={{ __html: currentAgreement.content }}
                />
                <div className="agreement-status">
                  {readAgreements.has(currentAgreementIndex) ? (
                    <span className="agreement-read">✓ {t('auth.agreementsModal.read')}</span>
                  ) : (
                    <span className="agreement-unread">{t('auth.agreementsModal.scrollToEnd')}</span>
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
                {t('auth.agreementsModal.readProgress')}: {readAgreements.size} {t('auth.agreementsModal.of')} {agreements.length}
              </p>
            </div>

            <button
              className="login-button"
              onClick={handleAccept}
              disabled={!allAgreementsRead}
            >
              {allAgreementsRead ? t('auth.agreementsModal.acceptAndContinue') : t('auth.agreementsModal.pleaseReadAll')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default AgreementsModal


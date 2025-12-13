"use client"

import React, { useState, useEffect } from 'react'
import AuthModal from './AuthModal'
import { useTranslation } from 'react-i18next'
import i18n from '../shared/i18n'

const Header = () => {
  const { t } = useTranslation()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')

  const handleSignInClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionClass) => {
    const section = document.querySelector(`.${sectionClass}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      closeMenu()
    }
  }

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    setCurrentLanguage(langCode)
  }

  // Слушаем изменения языка
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng)
    }
    
    i18n.on('languageChanged', handleLanguageChanged)
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.burger-menu') && !event.target.closest('.burger-button')) {
        closeMenu()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <header className="landing-header">
        <div className="header-container">
          <div className="header-logo">
            <img src="/images/landing/logo.png" alt="Logo" />
          </div>
          
          <div className="header-actions">
            <button 
              className="sign-in-button"
              onClick={handleSignInClick}
            >
              {t('landing.header.signIn')}
            </button>
            <button 
              className={`burger-button ${isMenuOpen ? 'active' : ''}`}
              aria-label="Menu"
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Burger Menu */}
      <div className={`burger-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="burger-menu-content">
          <nav className="burger-menu-nav">
            <button 
              className="burger-menu-item"
              onClick={() => scrollToSection('collect-section')}
            >
              {t('landing.header.menu.collectMiles')}
            </button>
            <button 
              className="burger-menu-item"
              onClick={() => scrollToSection('spend-section')}
            >
              {t('landing.header.menu.spendMiles')}
            </button>
            <button 
              className="burger-menu-item"
              onClick={() => scrollToSection('status-section')}
            >
              {t('landing.header.menu.membership')}
            </button>
          </nav>
          
          <div className="burger-menu-language">
            <div className="language-switcher">
              <button
                className={`language-button ${currentLanguage === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                EN
              </button>
              <button
                className={`language-button ${currentLanguage === 'ru' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('ru')}
              >
                RU
              </button>
              <button
                className={`language-button ${currentLanguage === 'kk' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('kk')}
              >
                KZ
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </>
  )
}

export default Header


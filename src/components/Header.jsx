"use client"

import React, { useState, useEffect } from 'react'
import AuthModal from './AuthModal'
import LanguageModal from './LanguageModal'
import { useTranslation } from 'react-i18next'
import i18n from '../shared/i18n'
import { Globe, X } from 'lucide-react'

const Header = () => {
  const { t } = useTranslation()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
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

  const handleLanguageModalOpen = () => {
    setIsLanguageModalOpen(true)
  }

  const handleLanguageModalClose = () => {
    setIsLanguageModalOpen(false)
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
      // Не закрываем меню если клик на элементы внутри меню, на кнопку бургера, или на переключатель языков
      if (
        isMenuOpen && 
        !event.target.closest('.burger-menu') && 
        !event.target.closest('.burger-button') &&
        !event.target.closest('.header-language-button') &&
        !event.target.closest('.language-modal-overlay') &&
        !event.target.closest('.language-modal-content')
      ) {
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
            {isMenuOpen ? (
              <button 
                className="header-language-button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLanguageModalOpen()
                }}
                aria-label="Select language"
              >
                <Globe size={24} strokeWidth={2.5} />
              </button>
            ) : (
              <img src="/images/landing/logo.png" alt="Logo" />
            )}
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
        <div className="burger-menu-header">
          <div className="burger-menu-header-spacer"></div>
          <button 
            className="burger-menu-close-button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
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
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />

      <LanguageModal 
        isOpen={isLanguageModalOpen} 
        onClose={handleLanguageModalClose} 
      />
    </>
  )
}

export default Header


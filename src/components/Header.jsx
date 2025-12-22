"use client"

import React, { useState, useEffect, useRef } from 'react'
import AuthModal from './AuthModal'
import LanguageModal from './LanguageModal'
import { useTranslation } from 'react-i18next'
import i18n from '../shared/i18n'
import { Globe, X, ChevronLeft } from 'lucide-react'

const Header = () => {
  const { t } = useTranslation()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const burgerMenuRef = useRef(null)
  const burgerButtonRef = useRef(null)
  const clickOutsideHandlerRef = useRef(null)
  const isClickingInsideMenuRef = useRef(false)

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
    setActiveSubmenu(null)
  }

  const openSubmenu = (submenuKey) => {
    isClickingInsideMenuRef.current = true
    setActiveSubmenu(submenuKey)
    // Сбрасываем флаг через небольшую задержку
    setTimeout(() => {
      isClickingInsideMenuRef.current = false
    }, 300)
  }

  const closeSubmenu = (e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    // Устанавливаем флаг, чтобы предотвратить закрытие меню
    isClickingInsideMenuRef.current = true
    setActiveSubmenu(null)
    // Сбрасываем флаг через небольшую задержку
    setTimeout(() => {
      isClickingInsideMenuRef.current = false
    }, 300)
  }

  const scrollToSection = (sectionClass) => {
    const section = document.querySelector(`.${sectionClass}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      closeMenu()
    }
  }

  // Структура подменю
  const submenus = {
    collect: {
      title: t('landing.header.menu.collectMiles'),
      items: [
        { label: 'Unified miles', action: () => scrollToSection('collect-section') },
        { label: 'Wishlist', action: () => scrollToSection('collect-section') },
        { label: 'Airlines', action: () => scrollToSection('collect-section') },
        { label: 'Hotels', action: () => scrollToSection('collect-section') },
        { label: 'Banks', action: () => scrollToSection('collect-section') },
        { label: 'Restaurants', action: () => scrollToSection('collect-section') },
        { label: 'Coffee shops', action: () => scrollToSection('collect-section') },
        { label: 'Gyms', action: () => scrollToSection('collect-section') },
        { label: 'Gas stations', action: () => scrollToSection('collect-section') },
      ]
    },
    spend: {
      title: t('landing.header.menu.spendMiles'),
      items: [
        { label: 'Flights', action: () => scrollToSection('spend-section') },
        { label: 'Hotels', action: () => scrollToSection('spend-section') },
      ]
    },
    membership: {
      title: t('landing.header.menu.membership'),
      items: [
        { label: 'Bronze', action: () => scrollToSection('status-section') },
        { label: 'Silver', action: () => scrollToSection('status-section') },
        { label: 'Gold', action: () => scrollToSection('status-section') },
      ]
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
    if (!isMenuOpen) {
      // Удаляем обработчик при закрытии меню
      if (clickOutsideHandlerRef.current) {
        document.removeEventListener('mousedown', clickOutsideHandlerRef.current)
        clickOutsideHandlerRef.current = null
      }
      return
    }

    const handleClickOutside = (event) => {
      // Не закрываем меню, если только что был клик внутри меню
      if (isClickingInsideMenuRef.current) {
        return
      }
      
      // Проверяем, что клик произошел вне меню
      if (!burgerMenuRef.current) return
      
      const isClickInsideMenu = burgerMenuRef.current.contains(event.target)
      const isClickOnBurgerButton = burgerButtonRef.current && burgerButtonRef.current.contains(event.target)
      const isClickOnLanguageButton = event.target.closest('.header-language-button')
      const isClickOnLanguageModal = event.target.closest('.language-modal-overlay') || 
                                     event.target.closest('.language-modal-content')
      
      // Не закрываем меню, если клик внутри меню или на связанных элементах
      if (
        isClickInsideMenu || 
        isClickOnBurgerButton ||
        isClickOnLanguageButton ||
        isClickOnLanguageModal
      ) {
        return
      }
      
      // Закрываем меню только если клик действительно вне его
      closeMenu()
    }

    // Сохраняем ссылку на обработчик
    clickOutsideHandlerRef.current = handleClickOutside

    // Используем задержку, чтобы React успел обработать клик на кнопке внутри меню
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      if (clickOutsideHandlerRef.current) {
        document.removeEventListener('click', clickOutsideHandlerRef.current)
        clickOutsideHandlerRef.current = null
      }
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
              ref={burgerButtonRef}
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
      <div 
        ref={burgerMenuRef}
        className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
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
        <div 
          className="burger-menu-content"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {!activeSubmenu ? (
            <nav className="burger-menu-nav">
              <button 
                className="burger-menu-item"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openSubmenu('collect')
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {t('landing.header.menu.collectMiles')}
              </button>
              <button 
                className="burger-menu-item"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openSubmenu('spend')
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {t('landing.header.menu.spendMiles')}
              </button>
              <button 
                className="burger-menu-item"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openSubmenu('membership')
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {t('landing.header.menu.membership')}
              </button>
            </nav>
          ) : (
            <nav className="burger-menu-nav">
              <div className="burger-submenu-title">
                <span>{submenus[activeSubmenu]?.title}</span>
                <button 
                  className="burger-menu-back-button-inline"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    closeSubmenu()
                  }}
                  aria-label="Back"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              {submenus[activeSubmenu]?.items.map((item, index) => (
                <button 
                  key={index}
                  className="burger-menu-item burger-submenu-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    item.action()
                    closeMenu()
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
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


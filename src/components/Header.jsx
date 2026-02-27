"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AuthModal from './AuthModal'
import LanguageModal from './LanguageModal'
import { useTranslation } from 'react-i18next'
import i18n from '../shared/i18n'
import { Globe, X, ChevronLeft } from 'lucide-react'

const Header = ({ autoOpenAuth = false }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [visibleCards, setVisibleCards] = useState({})
  const [animatedPercentages, setAnimatedPercentages] = useState({})
  const burgerMenuRef = useRef(null)
  const burgerButtonRef = useRef(null)
  const clickOutsideHandlerRef = useRef(null)
  const isClickingInsideMenuRef = useRef(false)
  const cardRefs = useRef({})

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

  const navigateToPage = (path) => {
    router.push(path)
    closeMenu()
  }

  // Данные для карточек статусов в меню
  const getMembershipStatusData = (label) => {
    // Сопоставляем английские названия с переводами
    const statusKeyMap = {
      'Bronze': 'bronze',
      'Silver': 'silver',
      'Gold': 'gold',
      'Platinum': 'platinum',
      // Русские названия
      [t('landing.statusBenefits.statuses.bronze.name')]: 'bronze',
      [t('landing.statusBenefits.statuses.silver.name')]: 'silver',
      [t('landing.statusBenefits.statuses.gold.name')]: 'gold',
      [t('landing.statusBenefits.statuses.platinum.name')]: 'platinum',
    }
    
    const statusKey = statusKeyMap[label] || 'bronze'
    
    const statusData = {
      bronze: {
        type: 'bronze',
        percent: '0',
        coversText: t('landing.statusBenefits.statuses.bronze.coversText'),
        youPayText: t('landing.statusBenefits.statuses.bronze.youPayText'),
        benefits: [
          t('landing.statusBenefits.statuses.bronze.benefit1'),
          t('landing.statusBenefits.statuses.bronze.benefit2'),
          t('landing.statusBenefits.statuses.bronze.benefit3'),
        ]
      },
      silver: {
        type: 'silver',
        percent: '15',
        coversText: t('landing.statusBenefits.statuses.silver.coversText'),
        youPayText: t('landing.statusBenefits.statuses.silver.youPayText'),
        benefits: [
          t('landing.statusBenefits.statuses.silver.benefit1'),
          t('landing.statusBenefits.statuses.silver.benefit2'),
          t('landing.statusBenefits.statuses.silver.benefit3'),
          t('landing.statusBenefits.statuses.silver.benefit4'),
          t('landing.statusBenefits.statuses.silver.benefit5'),
        ]
      },
      gold: {
        type: 'gold',
        percent: '25',
        coversText: t('landing.statusBenefits.statuses.gold.coversText'),
        youPayText: t('landing.statusBenefits.statuses.gold.youPayText'),
        benefits: [
          t('landing.statusBenefits.statuses.gold.benefit1'),
          t('landing.statusBenefits.statuses.gold.benefit2'),
          t('landing.statusBenefits.statuses.gold.benefit3'),
          t('landing.statusBenefits.statuses.gold.benefit4'),
          t('landing.statusBenefits.statuses.gold.benefit5'),
          t('landing.statusBenefits.statuses.gold.benefit6'),
          t('landing.statusBenefits.statuses.gold.benefit7'),
        ]
      },
      platinum: {
        type: 'platinum',
        percent: '35',
        coversText: t('landing.statusBenefits.statuses.platinum.coversText'),
        youPayText: t('landing.statusBenefits.statuses.platinum.youPayText'),
        benefits: [
          t('landing.statusBenefits.statuses.platinum.benefit1'),
          t('landing.statusBenefits.statuses.platinum.benefit2'),
          t('landing.statusBenefits.statuses.platinum.benefit3'),
          t('landing.statusBenefits.statuses.platinum.benefit4'),
          t('landing.statusBenefits.statuses.platinum.benefit5'),
          t('landing.statusBenefits.statuses.platinum.benefit6'),
          t('landing.statusBenefits.statuses.platinum.benefit7'),
          t('landing.statusBenefits.statuses.platinum.benefit8'),
        ]
      }
    }
    
    return statusData[statusKey] || statusData.bronze
  }

  // Структура подменю
  const submenus = {
    collect: {
      title: t('landing.header.menu.collectMiles'),
      items: [
        { label: 'Unified miles', action: () => navigateToPage('/collect-miles/unified-miles') },
        { label: 'Wishlist', action: () => navigateToPage('/collect-miles/wishlist') },
        { label: 'Airlines', action: () => navigateToPage('/collect-miles/airlines') },
        { label: 'Hotels', action: () => navigateToPage('/collect-miles/hotels') },
        { label: 'Banks', action: () => navigateToPage('/collect-miles/banks') },
        { label: 'Restaurants', action: () => navigateToPage('/collect-miles/restaurants') },
        { label: 'Coffee shops', action: () => navigateToPage('/collect-miles/coffee-shops') },
        { label: 'Gyms', action: () => navigateToPage('/collect-miles/gyms') },
        { label: 'Gas stations', action: () => navigateToPage('/collect-miles/gas-stations') },
      ]
    },
    spend: {
      title: t('landing.header.menu.spendMiles'),
      items: [
        { label: 'Flights', action: () => navigateToPage('/spend-miles/flights') },
        { label: 'Hotels', action: () => navigateToPage('/spend-miles/hotels') },
      ]
    },
    membership: {
      title: t('landing.header.menu.membership'),
      items: [
        { label: t('landing.statusBenefits.statuses.bronze.name'), action: () => navigateToPage('/membership/bronze') },
        { label: t('landing.statusBenefits.statuses.silver.name'), action: () => navigateToPage('/membership/silver') },
        { label: t('landing.statusBenefits.statuses.gold.name'), action: () => navigateToPage('/membership/gold') },
        { label: t('landing.statusBenefits.statuses.platinum.name'), action: () => navigateToPage('/membership/platinum') },
      ]
    }
  }

  const handleLanguageModalOpen = () => {
    setIsLanguageModalOpen(true)
  }

  const handleLanguageModalClose = () => {
    setIsLanguageModalOpen(false)
  }

  // Анимация процентов покрытия
  const animatePercentage = (cardId, targetPercent) => {
    const duration = 800 // 0.8 секунды
    const steps = 60
    const stepTime = duration / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const currentPercent = Math.floor(targetPercent * progress)
      
      setAnimatedPercentages((prev) => ({
        ...prev,
        [cardId]: currentPercent
      }))

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedPercentages((prev) => ({
          ...prev,
          [cardId]: targetPercent
        }))
      }
    }, stepTime)
  }

  // Отслеживание видимости карточек для анимации
  useEffect(() => {
    if (activeSubmenu !== 'membership') {
      return
    }

    const observers = []
    const visibleSet = new Set()

    // Небольшая задержка для того, чтобы карточки успели отрендериться
    const timeoutId = setTimeout(() => {
      Object.keys(cardRefs.current).forEach((cardId) => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !visibleSet.has(cardId)) {
                visibleSet.add(cardId)
                setVisibleCards((prev) => ({ ...prev, [cardId]: true }))
                
                // Анимация процентов
                const index = parseInt(cardId.split('-')[2])
                const item = submenus.membership.items[index]
                if (item) {
                  const statusData = getMembershipStatusData(item.label)
                  const targetPercent = parseInt(statusData.percent)
                  animatePercentage(cardId, targetPercent)
                }
              }
            })
          },
          {
            threshold: 0.2,
          }
        )

        if (cardRefs.current[cardId]) {
          observer.observe(cardRefs.current[cardId])
          observers.push({ observer, element: cardRefs.current[cardId] })
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observers.forEach(({ observer, element }) => {
        observer.unobserve(element)
      })
      // Сбрасываем состояние при закрытии подменю
      setVisibleCards({})
      setAnimatedPercentages({})
    }
  }, [activeSubmenu])

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

  // Автоматическое открытие модалки авторизации при загрузке страницы через QR
  useEffect(() => {
    if (autoOpenAuth) {
      setIsAuthModalOpen(true)
    }
  }, [autoOpenAuth])

  return (
    <>
      <header className="landing-header">
        <div className="header-container">
          <div 
            className="header-logo"
            onClick={() => {
              if (!isMenuOpen) {
                router.push('/')
              }
            }}
            style={{ cursor: isMenuOpen ? 'default' : 'pointer' }}
          >
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
              {activeSubmenu === 'membership' ? (
                <div className="burger-membership-section">
                  <h1 className="burger-membership-title">
                    {t('landing.statusBenefits.title')}
                  </h1>
                  <p className="burger-membership-subtitle">
                    {t('landing.statusBenefits.subtitle')}
                  </p>
                  <div className="burger-membership-cards">
                    {submenus[activeSubmenu]?.items.map((item, index) => {
                    const statusData = getMembershipStatusData(item.label)
                    const cardId = `membership-card-${index}`
                    const isVisible = visibleCards[cardId] || false
                    const animatedPercent = animatedPercentages[cardId] || 0
                    
                    return (
                      <div
                        key={index}
                        ref={(el) => (cardRefs.current[cardId] = el)}
                        className={`burger-membership-card burger-membership-card-${statusData.type} ${isVisible ? 'burger-membership-card-visible' : ''}`}
                      >
                        <div className="burger-membership-card-header">
                          <h3 className="burger-membership-card-title">{item.label}</h3>
                          <div className="burger-membership-coverage">
                            <span className="burger-membership-coverage-text">
                              {statusData.coversText.split(statusData.percent + '%')[0]}
                            </span>
                            <span className="burger-membership-coverage-percent">
                              {animatedPercent}%
                            </span>
                            <span className="burger-membership-coverage-text">
                              {statusData.coversText.split(statusData.percent + '%')[1] || ''}
                            </span>
                          </div>
                          <div className="burger-membership-pay">
                            {statusData.youPayText}
                          </div>
                        </div>
                        <div className="burger-membership-benefits">
                          <ul className="burger-membership-benefits-list">
                            {statusData.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="burger-membership-benefit-item">
                                <span className="burger-membership-benefit-check">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                  </div>
                </div>
              ) : (
                submenus[activeSubmenu]?.items.map((item, index) => (
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
                ))
              )}
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


import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import AuthModal from './AuthModal'

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleSignInClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <>
      <header className="landing-header">
        <div className="header-container">
          <div className="header-logo">
            <img src={logo} alt="Logo" />
          </div>
          
          <div className="header-actions">
            <button 
              className="sign-in-button"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
            <button 
              className="burger-button"
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </>
  )
}

export default Header


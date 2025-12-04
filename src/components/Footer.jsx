import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-copyright">
            © {currentYear} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


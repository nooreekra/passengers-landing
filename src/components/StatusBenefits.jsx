import React, { useState, useEffect, useRef } from 'react'
import silverImage from '../assets/images/silver.jpg'
import goldImage from '../assets/images/gold.jpg'
import platinumImage from '../assets/images/platinum.jpg'

const StatusBenefits = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.2,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const statuses = [
    {
      id: 1,
      name: 'Silver',
      discount: '-15%',
      description: 'collect just 85% of the trip price to book your flight/hotel',
      image: silverImage
    },
    {
      id: 2,
      name: 'Gold',
      discount: '-25%',
      description: 'collect just 75% of the trip to book your flight/hotel',
      image: goldImage
    },
    {
      id: 3,
      name: 'Platinum',
      discount: '-35%',
      description: 'collect just 65% of the trip cost to book your hotel/flight',
      image: platinumImage
    },
  ]

  return (
    <div className="status-benefits-section" ref={sectionRef}>
        <div className="status-benefits-section-title">
            <p className="section-title">status benefits</p>
        </div>
      <h2 className="section-subtitle">IMS Savvy pays part of the trip on your behalf</h2>
      <div className="status-cards-container">
        {statuses.map((status, index) => (
          <div 
            key={status.id} 
            className={`status-card ${isVisible ? 'flip-card' : ''}`}
            style={{
              animationDelay: `${index * 0.4}s`,
            }}
          >
            <div className="status-card-inner">
              <div className="status-card-back"></div>
              <div className="status-card-front">
                <div 
                  className="status-card-header"
                  style={{ backgroundImage: `url(${status.image})` }}
                >
                  <div className="status-card-header-peel"></div>
                  <div className="status-card-name">{status.name}</div>
                </div>
                <div className="status-card-body">
                  <div className="status-discount">{status.discount}</div>
                  <p className="status-description">{status.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatusBenefits


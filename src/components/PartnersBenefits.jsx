import React from 'react'
import bonus3d from '../assets/images/bonus_3d.png'
import cake3d from '../assets/images/cake_3d.png'
import checkin3d from '../assets/images/checkin_3d.png'
import seat3d from '../assets/images/seat_3d.png'
import dinner3d from '../assets/images/dinner_3d.png'

const PartnersBenefits = () => {
  const benefits = [
    { text: 'Welcome Bonus', image: bonus3d },
    { text: 'Free monthly treat.', image: cake3d },
    { text: 'Priority check in at business class counter', image: checkin3d },
    { text: 'Advance seat booking.', image: seat3d },
    { text: 'extended check-in, check out time', image: dinner3d },
  ]

  return (
    <div className="partners-benefits-section">
        <div className="partners-benefits-section-title">
            <p className="section-title">partners benefit</p>
        </div>
      <h2 className="section-subtitle">exclusive Perks</h2>
      <div className="partners-benefits-container">
        {/* Center Content */}
        <div className="partners-center-content">
          <ul className="partners-benefits-list">
            {benefits.map((benefit, index) => (
              <li 
                key={index} 
                className={`partners-benefit-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <span className="partners-benefit-text">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3D Models - Left Side (absolute positioned inside container) */}
        {benefits.map((benefit, index) => (
          index % 2 === 0 && (
            <img 
              key={index}
              src={benefit.image} 
              alt={benefit.text}
              className={`partners-benefit-3d-model left-model model-${index}`}
              style={{
                top: `${3 + index * 18}%`
              }}
            />
          )
        ))}

        {/* 3D Models - Right Side (absolute positioned inside container) */}
        {benefits.map((benefit, index) => (
          index % 2 === 1 && (
            <img 
              key={index}
              src={benefit.image} 
              alt={benefit.text}
              className={`partners-benefit-3d-model right-model model-${index}`}
              style={{
                top: `${20 + (index - 1) * 18}%`
              }}
            />
          )
        ))}
      </div>
    </div>
  )
}

export default PartnersBenefits


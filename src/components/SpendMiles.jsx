import React from 'react'
import istanbulImage from '../assets/images/istanbul_street.png'
import teamupImage from '../assets/images/teamup.png'
import maldivesImage from '../assets/images/maldives_room.png'

const SpendMiles = () => {

    const options = [
        {
            id: 1,
            destination: 'Book your weekend',
            subtitle: 'ESCAPE',
            miles: '30,000',
            type: 'Weekend Escape',
            image: istanbulImage
        },
        {
            id: 2,
            destination: 'Team Up with your',
            subtitle: 'BUDDIES',
            miles: '100,000',
            type: 'Round Trip',
            image: teamupImage
        },
        {
            id: 3,
            destination: 'Save up for your',
            subtitle: 'DREAM HOLIDAY',
            miles: '300,000',
            type: 'Holiday Pack',
            image: maldivesImage
        },
    ]


    return (
        <div className="spend-miles-section">
            <div className="spend-miles-section-title">
                <p className="section-title">spend miles</p>
            </div>
            <h2 className="section-subtitle">choose your next getaway</h2>
            <div className="spend-options-container">
                {options.map((option) => (
                    <div key={option.id} className="spend-option-wrapper">
                        <div className="spend-option-header">
                            <div className="spend-option-destination">{option.destination}</div>
                        </div>
                        <div
                            className="spend-option-card"
                            style={{ backgroundImage: `url(${option.image})` }}
                        >
                            <div className="spend-option-overlay"></div>
                            <div className="spend-option-content">
                                <div className="spend-option-subtitle">{option.subtitle}</div>
                            </div>
                            <div className="price-tag">
                                <div className="spend-option-miles">
                                    <span className="price-text-medium">Book for </span>
                                    <div className="price-amount-container">
                                        <span className="price-amount">{option.miles}</span>
                                        <span className="price-text-small"> Miles</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SpendMiles


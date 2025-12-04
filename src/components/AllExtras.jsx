import React, { useState, useEffect, useRef } from 'react'
import heroFinger from '../assets/images/hero_finger.png'

const AllExtras = () => {
    const [selectedBenefit, setSelectedBenefit] = useState(null)
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

    const IconWifi = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
    )

    const IconTicket = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path>
            <path d="M13 5v2"></path>
            <path d="M13 17v2"></path>
            <path d="M13 11v2"></path>
        </svg>
    )

    const IconBuilding = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
            <path d="M6 12h12"></path>
            <path d="M6 6h12"></path>
            <path d="M6 18h12"></path>
        </svg>
    )

    const IconWine = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 22h8"></path>
            <path d="M7 10h10"></path>
            <path d="M12 15v7"></path>
            <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"></path>
        </svg>
    )

    const IconLuggage = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
            <path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"></path>
        </svg>
    )

    const IconArrowUp = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 7-7 7 7"></path>
            <path d="M12 19V5"></path>
        </svg>
    )

    const benefits = [
        { id: 1, title: 'Free Wifi', icon: IconWifi },
        { id: 2, title: 'Priority Check in', description: 'at Business counter', icon: IconTicket },
        { id: 3, title: 'Lounge Access', description: 'to Business class Lounge', icon: IconBuilding },
        { id: 4, title: 'Food & Beverages', description: 'on flight', icon: IconWine },
        { id: 5, title: 'Additional luggage', icon: IconLuggage },
        { id: 6, title: 'Upgrade', description: 'to Super Econ or Business class', icon: IconArrowUp },
    ]

    return (
        <div className="benefits-selection-section" ref={sectionRef}>
            <div className="benefits-background" style={{ backgroundImage: `url(${heroFinger})` }}>
                <div className="benefits-overlay"></div>
            </div>
            <div className="benefits-content">
                <p className="section-subtitle">all extras at your finger point</p>
                <div className="benefits-grid">
                    {benefits.map((benefit, index) => {
                        const row = Math.floor(index / 3)
                        const col = index % 3
                        const delay = row * 0.2 + col * 0.15
                        
                        return (
                        <div
                            key={benefit.id}
                            className={`benefit-card ${isVisible ? 'animate-card' : ''} ${selectedBenefit === benefit.id ? 'selected' : ''}`}
                            onClick={() => setSelectedBenefit(benefit.id)}
                            style={{
                                animationDelay: `${delay}s`,
                            }}
                        >
                            <div className="benefit-icon">
                                {benefit.icon && React.createElement(benefit.icon)}
                            </div>
                            <div className="benefit-content">
                                <div className="benefit-title">{benefit.title}</div>
                                {benefit.description && (
                                    <div className="benefit-description">{benefit.description}</div>
                                )}
                            </div>
                            {selectedBenefit === benefit.id && (
                                <div className="benefit-checkmark">
                                    <div className="checkmark-circle">✓</div>
                                </div>
                            )}
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AllExtras


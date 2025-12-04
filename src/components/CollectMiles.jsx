import React, { useState, useEffect, useRef } from 'react'
import heroImage from '../assets/images/hero_bclass.jpg'
import PartnersCarousel from './PartnersCarousel'

const CollectMiles = () => {
    const [radius, setRadius] = useState(160)
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const updateRadius = () => {
            if (window.innerWidth <= 480) {
                setRadius(110)
            } else if (window.innerWidth <= 768) {
                setRadius(130)
            } else if (window.innerWidth <= 968) {
                setRadius(145)
            } else {
                setRadius(160)
            }
        }

        updateRadius()
        window.addEventListener('resize', updateRadius)
        return () => window.removeEventListener('resize', updateRadius)
    }, [])

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
                threshold: 0.2, // Секция считается видимой, когда 20% её видно
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

    // Равномерное распределение карточек по полному кругу (360 градусов)
    const totalCards = 9
    const angleStep = 360 / totalCards // 40 градусов между карточками

    const activities = [
        { id: 1, title: 'Banking', description: 'Monthly card payments', miles: '1960 Miles' },
        { id: 2, title: 'Gas Station', description: 'Filled the tank', miles: '30 Miles' },
        { id: 3, title: 'Restaurant', description: 'Dinner with family', miles: '300 Miles' },
        { id: 4, title: 'Flight', description: 'Business trip', miles: '1500 Miles' },
        { id: 5, title: 'Restaurant', description: 'Lunch with partner', miles: '400 Miles' },
        { id: 6, title: 'Gym', description: 'Monthly fee', miles: '200 Miles' },
        { id: 7, title: 'Hotel', description: 'Business trip', miles: '500 Miles' },
        { id: 8, title: 'Coffee', description: 'With friends', miles: '50 Miles' },
        { id: 9, title: 'Flight', description: 'Business trip', miles: '800 Miles' },
    ].map((activity, index) => ({
        ...activity,
        angle: index * angleStep, // Равномерное распределение по кругу
        radius: radius
    }))

    return (
        <div className="collect-miles-section" ref={sectionRef}>
            <div className="collect-miles-section-title">
                <p className="section-title">collect miles</p>
            </div>
            <PartnersCarousel />
            <h2 className="section-subtitle">your daily activity turns into <br />  your next Holiday</h2>
            <div className="collect-miles-visualization">
                <div className="center-hero">
                    <div className="hero-image-wrapper">
                        <img src={heroImage} alt="Hero" className="hero-image" />
                    </div>
                </div>
                <div className="activities-circle">
                    {activities.map((activity, index) => {
                        const angleInRadians = (activity.angle * Math.PI) / 180
                        const x = Math.cos(angleInRadians) * activity.radius
                        const y = Math.sin(angleInRadians) * activity.radius

                        return (
                            <div
                                key={activity.id}
                                className={`activity-card-circle ${isVisible ? 'animate-in' : ''}`}
                                style={{
                                    '--x': `${x}px`,
                                    '--y': `${y}px`,
                                    animationDelay: `${index * 0.1}s`,
                                }}
                            >
                                <div className="activity-card-content">
                                    <div className="activity-title">{activity.title}</div>
                                    <div className="activity-description">{activity.description}</div>
                                    <div className="activity-miles">{activity.miles}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CollectMiles


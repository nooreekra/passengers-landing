"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function RestaurantsPage() {
  const { t } = useTranslation()

  return (
    <div className="home-page">
      <Header />
      <section className="collect-miles-section" style={{ padding: '120px 20px 80px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '40px',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            {t('landing.collectMiles.restaurants.title', 'Restaurants')}
          </h1>
          
          <div style={{ fontSize: '20px', lineHeight: '1.8', marginBottom: '40px' }}>
            <p style={{ marginBottom: '30px', textAlign: 'center', maxWidth: '900px', margin: '0 auto 30px' }}>
              {t('landing.collectMiles.restaurants.description', 
                'Enjoy delicious meals and earn IMS Miles at the same time. Every dinner with family, business lunch with partners, or special occasion celebration at our partner restaurants earns you rewards.')}
            </p>
            <p style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
              {t('landing.collectMiles.restaurants.benefits', 
                'No need to join separate restaurant loyalty programs. All your dining experiences are unified in your IMS Miles account, making every meal a step closer to your next vacation.')}
            </p>
          </div>

          <div style={{ 
            marginTop: '60px', 
            padding: '40px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '30px',
              textTransform: 'uppercase'
            }}>
              {t('landing.collectMiles.restaurants.howItWorks', 'How It Works')}
            </h2>
            <ul style={{ fontSize: '18px', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🍽️</span>
                {t('landing.collectMiles.restaurants.step1', 'Dine at any of our partner restaurants')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>💳</span>
                {t('landing.collectMiles.restaurants.step2', 'Pay with your linked card or account')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🎁</span>
                {t('landing.collectMiles.restaurants.step3', 'Miles are automatically credited to your account')}
              </li>
              <li style={{ paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>✈️</span>
                {t('landing.collectMiles.restaurants.step4', 'Use your miles for flights, hotels, or more dining experiences')}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}


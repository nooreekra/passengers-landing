"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function HotelsPage() {
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
            {t('landing.collectMiles.hotels.title', 'Hotels')}
          </h1>
          
          <div style={{ fontSize: '20px', lineHeight: '1.8', marginBottom: '40px' }}>
            <p style={{ marginBottom: '30px', textAlign: 'center', maxWidth: '900px', margin: '0 auto 30px' }}>
              {t('landing.collectMiles.hotels.description', 
                'Every hotel stay earns you IMS Miles. Whether you\'re on a business trip or enjoying a vacation, your accommodation expenses turn into rewards.')}
            </p>
            <p style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
              {t('landing.collectMiles.hotels.benefits', 
                'Stay at any of our partner hotels and automatically collect miles. No need to join multiple hotel loyalty programs - all your stays are unified in your IMS Miles account.')}
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
              {t('landing.collectMiles.hotels.howItWorks', 'How It Works')}
            </h2>
            <ul style={{ fontSize: '18px', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🏨</span>
                {t('landing.collectMiles.hotels.step1', 'Book a stay at any of our partner hotels')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🔑</span>
                {t('landing.collectMiles.hotels.step2', 'Check in and enjoy your stay')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>💳</span>
                {t('landing.collectMiles.hotels.step3', 'Your stay is automatically tracked and miles are credited')}
              </li>
              <li style={{ paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🎁</span>
                {t('landing.collectMiles.hotels.step4', 'Use your accumulated miles for future hotel stays or other rewards')}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}


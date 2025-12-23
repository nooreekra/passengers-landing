"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function GymsPage() {
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
            {t('landing.collectMiles.gyms.title', 'Gyms')}
          </h1>
          
          <div style={{ fontSize: '20px', lineHeight: '1.8', marginBottom: '40px' }}>
            <p style={{ marginBottom: '30px', textAlign: 'center', maxWidth: '900px', margin: '0 auto 30px' }}>
              {t('landing.collectMiles.gyms.description', 
                'Stay fit and earn miles at the same time. Your monthly gym membership fees and fitness activities at our partner gyms automatically earn you IMS Miles.')}
            </p>
            <p style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
              {t('landing.collectMiles.gyms.benefits', 
                'Investing in your health now rewards you with travel opportunities. Every workout session and membership payment brings you closer to your next adventure.')}
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
              {t('landing.collectMiles.gyms.howItWorks', 'How It Works')}
            </h2>
            <ul style={{ fontSize: '18px', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>💪</span>
                {t('landing.collectMiles.gyms.step1', 'Join or visit any of our partner gyms')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>💳</span>
                {t('landing.collectMiles.gyms.step2', 'Pay your monthly membership fee')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🏋️</span>
                {t('landing.collectMiles.gyms.step3', 'Stay active and earn miles with every payment')}
              </li>
              <li style={{ paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>✈️</span>
                {t('landing.collectMiles.gyms.step4', 'Use your fitness miles for your next travel adventure')}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}


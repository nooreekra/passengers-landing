"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function UnifiedMilesPage() {
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
            {t('landing.collectMiles.unifiedMiles.title', 'Unified Miles')}
          </h1>
          
          <div style={{ 
            fontSize: '20px', 
            lineHeight: '1.8', 
            marginBottom: '40px',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto 40px'
          }}>
            <p style={{ marginBottom: '30px' }}>
              {t('landing.collectMiles.unifiedMiles.paragraph1', 
                'IMS Miles are unified Miles which means every time you take your flight, stay at hotel, buy a croissant or pay using a credit card, you collect the same IMS Miles from all our Partners.')}
            </p>
            <p style={{ marginBottom: '30px' }}>
              {t('landing.collectMiles.unifiedMiles.paragraph2', 
                'No need to register for 10 different airline loyalty programs, 20 different hotel loyalty programs, 30 different restaurant & coffee shop loyalty programs any more. All your rewards are now unified & in one place. Keep track of all your activity & Miles collected from different places in one window.')}
            </p>
            <p>
              {t('landing.collectMiles.unifiedMiles.paragraph3', 
                'Move over, IMS Miles never expire, nor capped, giving flexibility & control over your rewards. With a wide range of ecosystem partners, you can collect miles with your daily activity at your home country or abroad, while on a business trip.')}
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}


"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function GasStationsPage() {
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
            {t('landing.collectMiles.gasStations.title', 'Gas Stations')}
          </h1>
          
          <div style={{ fontSize: '20px', lineHeight: '1.8', marginBottom: '40px' }}>
            <p style={{ marginBottom: '30px', textAlign: 'center', maxWidth: '900px', margin: '0 auto 30px' }}>
              {t('landing.collectMiles.gasStations.description', 
                'Every time you fill up your tank at our partner gas stations, you\'re filling up your miles account too. Turn your regular fuel stops into travel rewards.')}
            </p>
            <p style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
              {t('landing.collectMiles.gasStations.benefits', 
                'No matter if you\'re driving to work, on a road trip, or just running errands, every fuel purchase earns you IMS Miles that can be used for flights, hotels, and more.')}
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
              {t('landing.collectMiles.gasStations.howItWorks', 'How It Works')}
            </h2>
            <ul style={{ fontSize: '18px', lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>⛽</span>
                {t('landing.collectMiles.gasStations.step1', 'Fill up your tank at any of our partner gas stations')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>💳</span>
                {t('landing.collectMiles.gasStations.step2', 'Pay for your fuel purchase')}
              </li>
              <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🎁</span>
                {t('landing.collectMiles.gasStations.step3', 'Miles are automatically credited to your IMS account')}
              </li>
              <li style={{ paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🚗</span>
                {t('landing.collectMiles.gasStations.step4', 'Use your miles to fuel your next travel adventure')}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}


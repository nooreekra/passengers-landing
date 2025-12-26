"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function CoffeeShopsPage() {
  const { t } = useTranslation()

  return (
    <div className="home-page">
      <Header />
      <section className="collect-miles-section" style={{ padding: '120px 20px 80px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 className="section-subtitle" style={{ 
            marginBottom: '40px',
            textTransform: 'uppercase'
          }}>
            {t('landing.collectMiles.coffeeShops.title', 'Coffee Shops')}
          </h1>
          
          <div style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
            <p className="section-description" style={{ marginBottom: '30px' }}>
              {t('landing.collectMiles.coffeeShops.description', 
                'Your daily coffee ritual can now fuel your next vacation. Every cup of coffee, croissant, or snack purchased at our partner coffee shops earns you IMS Miles.')}
            </p>
            <p className="section-description">
              {t('landing.collectMiles.coffeeShops.benefits', 
                'Grab your morning coffee with friends, enjoy a takeaway, or relax with a pastry - all while collecting miles that bring you closer to your dream destination.')}
            </p>
          </div>

          <div style={{ 
            marginTop: '60px', 
            padding: '40px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h2 className="section-subtitle" style={{ 
              fontSize: '28px',
              marginBottom: '30px',
              textTransform: 'uppercase'
            }}>
              {t('landing.collectMiles.coffeeShops.howItWorks', 'How It Works')}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="section-description" style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>☕</span>
                {t('landing.collectMiles.coffeeShops.step1', 'Visit any of our partner coffee shops')}
              </li>
              <li className="section-description" style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🥐</span>
                {t('landing.collectMiles.coffeeShops.step2', 'Buy your coffee, croissant, or any item')}
              </li>
              <li className="section-description" style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>💳</span>
                {t('landing.collectMiles.coffeeShops.step3', 'Pay and automatically earn IMS Miles')}
              </li>
              <li className="section-description" style={{ paddingLeft: '30px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '24px' }}>🎉</span>
                {t('landing.collectMiles.coffeeShops.step4', 'Watch your miles accumulate with every visit')}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}


"use client"

import React from 'react'
import LandingPage from '../../../LandingPage'

export default function TransactionConfirmPage({ params }: { params: { code: string } }) {
  return <LandingPage autoOpenAuth={true} qrCode={params.code} />
}


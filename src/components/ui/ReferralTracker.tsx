'use client'
import { useEffect } from 'react'
export default function ReferralTracker(){useEffect(()=>{try{const code=new URLSearchParams(window.location.search).get('ref')?.trim().toUpperCase();if(code&&/^[A-Z0-9]{8}$/.test(code)){localStorage.setItem('cg_referral_code',code);document.cookie='cg_referral_code='+code+'; Max-Age=7776000; Path=/; SameSite=Lax; Secure'}}catch{}},[]);return null}

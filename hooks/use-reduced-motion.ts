'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if animations should be reduced
 * Returns true if:
 * - User has prefers-reduced-motion enabled
 * - Device is mobile (viewport < 768px)
 * 
 * This helps with:
 * - Accessibility for users sensitive to motion
 * - Performance on mobile devices with limited GPU
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true) // Default to reduced for SSR
  
  useEffect(() => {
    const checkMotion = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isMobile = window.innerWidth < 768
      setReduced(prefersReduced || isMobile)
    }
    
    checkMotion()
    
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', checkMotion)
    window.addEventListener('resize', checkMotion)
    
    return () => {
      motionQuery.removeEventListener('change', checkMotion)
      window.removeEventListener('resize', checkMotion)
    }
  }, [])
  
  return reduced
}

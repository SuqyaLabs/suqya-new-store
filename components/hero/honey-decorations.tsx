'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

function Hexagon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M21 16V8L12 2.8L3 8V16L12 21.2L21 16Z" />
    </svg>
  )
}

function Bee({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 8.8C8 8.8 7 5 10 3C13 1 15 5 15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M16 8.8C16 8.8 17 5 14 3C11 1 9 5 9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M12 7C9 7 7 9 7 12C7 15 9 17 12 17C15 17 17 15 17 12C17 9 15 7 12 7Z" fill="currentColor"/>
      <path d="M12 7V17" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <path d="M7 12H17" stroke="white" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

export function HoneyDecorations() {
  // Generate random positions for floating elements
  const particles = useMemo(() => [
    { type: 'hex', size: 'w-12 h-12', pos: 'top-1/4 left-1/4', color: 'text-amber-400/20', delay: '0s', anim: 'hero-float-random' },
    { type: 'hex', size: 'w-8 h-8', pos: 'top-1/3 right-1/4', color: 'text-yellow-500/15', delay: '1s', anim: 'hero-float-random' },
    { type: 'hex', size: 'w-16 h-16', pos: 'bottom-1/4 left-1/3', color: 'text-orange-400/10', delay: '2s', anim: 'hero-float-random' },
    { type: 'hex', size: 'w-6 h-6', pos: 'top-20 right-20', color: 'text-amber-300/20', delay: '3s', anim: 'hero-float-random' },
    { type: 'bee', size: 'w-8 h-8', pos: 'top-1/3 left-20', color: 'text-amber-600/30', delay: '0s', anim: 'hero-bee-drift' },
    { type: 'bee', size: 'w-6 h-6', pos: 'bottom-1/3 right-20', color: 'text-yellow-600/25', delay: '2s', anim: 'hero-bee-drift' }
  ], [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className={cn('absolute', p.pos)}
          style={{
            animation: `${p.anim} ${p.type === 'bee' ? '15s' : '10s'} ease-in-out infinite`,
            animationDelay: p.delay
          }}
        >
          {p.type === 'hex' ? (
            <Hexagon className={cn(p.size, p.color)} />
          ) : (
            <Bee className={cn(p.size, p.color)} />
          )}
        </div>
      ))}
      
      {/* Background Honeycomb Mesh */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
         <svg width="100%" height="100%">
            <pattern id="honey-hex-bg" x="0" y="0" width="50" height="86.6" patternUnits="userSpaceOnUse">
               <path d="M25 0 L50 14.4 L50 43.3 L25 57.7 L0 43.3 L0 14.4 Z" fill="none" stroke="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#honey-hex-bg)" />
         </svg>
      </div>
    </div>
  )
}

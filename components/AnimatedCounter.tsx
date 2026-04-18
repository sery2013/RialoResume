'use client'
import { useState, useEffect } from 'react'

interface Props {
  value: number
  duration?: number
}

export default function AnimatedCounter({ value, duration = 1500 }: Props) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const startValue = 0
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (value - startValue) * easeOutQuart)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

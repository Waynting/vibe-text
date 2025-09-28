'use client'

import { useRef, useEffect } from 'react'

interface HtmlPrinterProps {
  htmlContent: string
  className?: string
}

export function HtmlPrinter({ htmlContent, className = '' }: HtmlPrinterProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // 直接設置 innerHTML，完全繞過 React 的虛擬 DOM
      containerRef.current.innerHTML = htmlContent
    }
  }, [htmlContent])

  return (
    <div 
      ref={containerRef}
      className={`html-printer ${className}`}
    />
  )
}
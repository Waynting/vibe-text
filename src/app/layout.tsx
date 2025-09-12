import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vibe Text - 直式文字編輯器',
  description: '一個極簡的中文直式文字編輯器，專為傳統垂直書寫而設計',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
import './globals.css'
import "leaflet/dist/leaflet.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MVNU Interactive Map',
  description: 'Interactive map for MVNU\'s booth at General Assembly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

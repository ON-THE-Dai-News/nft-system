import { Inter } from 'next/font/google'
import '../styles/main.scss'
import { MainLayout } from '@/components/layout/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'OTDNews NFT System',
  description: 'Automated NFT creation system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}
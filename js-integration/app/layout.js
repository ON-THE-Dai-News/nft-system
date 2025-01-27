import '../styles/main.scss'

export const metadata = {
  title: 'OTDNews NFT System',
  description: 'Automated NFT creation system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
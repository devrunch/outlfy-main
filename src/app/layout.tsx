import { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/extra.css'
import '../../public/assets/scss/master.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {

  metadataBase: new URL('https://www.outlfy.com'),
  title: 'Outlfy | Your Long-Term Partner for Scalable Business Growth',
  description: 'We set up the systems, you focus on growth. Outlfy empowers businesses with smart strategies and scalable solutions.',
  openGraph: {
    title: 'Outlfy | Your Long-Term Partner for Scalable Business Growth',
    description: 'We set up the systems, you focus on growth. Outlfy empowers businesses with smart strategies and scalable solutions.',
    url: 'https://www.outlfy.com/',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy - Your Long-Term Partner for Scalable Business Growth'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Outlfy | Your Long-Term Partner for Scalable Business Growth',
    description: 'We set up the systems, you focus on growth. Outlfy empowers businesses with smart strategies and scalable solutions.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  },
  robots: 'index, follow'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/g13.svg"
        />
      </head>
      <body suppressHydrationWarning className={kanit.className}>
        {children}
      </body>
    </html>
  )
}
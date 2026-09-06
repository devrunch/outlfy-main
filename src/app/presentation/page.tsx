import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presentation | Outlfy',
  description: 'View the Outlfy presentation deck.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Presentation | Outlfy',
    description: 'View the Outlfy presentation deck.',
    url: 'https://www.outlfy.com/presentation',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Presentation'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presentation | Outlfy',
    description: 'View the Outlfy presentation deck.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

const page = () => {
  return (
    <div style={{ width:'100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0px' }}>
      
        <iframe
          loading="lazy"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            border: 'none',
            padding: 0,
            margin: 0,
            borderRadius: 8,
          }}
          src="https://www.canva.com/design/DAGzUf8yBy0/HHWcDop-MvTfa-Iy8b4axw/view?embed"
          allowFullScreen
          title="Final presentation Outlfy"
        />
     
    </div>
  )
}

export default page

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Join Our Team at Outlfy',
  description: 'Explore open roles at Outlfy and join our team to help businesses scale with smart strategies and scalable solutions.',
  openGraph: {
    title: 'Careers | Join Our Team at Outlfy',
    description: 'Explore open roles at Outlfy and join our team to help businesses scale with smart strategies and scalable solutions.',
    url: 'https://www.outlfy.com/career',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Careers at Outlfy'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | Join Our Team at Outlfy',
    description: 'Explore open roles at Outlfy and join our team to help businesses scale with smart strategies and scalable solutions.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

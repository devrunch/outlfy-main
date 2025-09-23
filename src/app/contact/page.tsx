import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch with Outlfy',
  description: 'Ready to scale your business? Contact Outlfy today for smart strategies and scalable solutions. We set up the systems, you focus on growth.',
  openGraph: {
    title: 'Contact Us | Get in Touch with Outlfy',
    description: 'Ready to scale your business? Contact Outlfy today for smart strategies and scalable solutions. We set up the systems, you focus on growth.',
    url: 'https://www.outlfy.com/contact',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Outlfy'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Get in Touch with Outlfy',
    description: 'Ready to scale your business? Contact Outlfy today for smart strategies and scalable solutions. We set up the systems, you focus on growth.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import Contact1 from "@/components/contact/Contact1";

const Contact = () => {
  return (
    <>
      <main>
      <RootLayout header="header1" footer="footer1">
          <Contact1 />
        </RootLayout>
      </main>
    </>
  );
};

export default Contact;

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Outlfy - Your Long-Term Business Growth Partner',
  description: 'Learn about Outlfy\'s mission to empower businesses with smart strategies and scalable solutions. We set up the systems, you focus on growth.',
  openGraph: {
    title: 'About Us | Outlfy - Your Long-Term Business Growth Partner',
    description: 'Learn about Outlfy\'s mission to empower businesses with smart strategies and scalable solutions. We set up the systems, you focus on growth.',
    url: 'https://www.outlfy.com/about',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Outlfy'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Outlfy - Your Long-Term Business Growth Partner',
    description: 'Learn about Outlfy\'s mission to empower businesses with smart strategies and scalable solutions. We set up the systems, you focus on growth.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

import RootLayout from "@/components/common/layout/RootLayout";
import AboutCounter from "@/components/counter/AboutCounter";
import AboutCTA from "@/components/cta/AboutCTA";
import AboutHero from "@/components/hero/AboutHero";
import AboutStory from "@/components/story/AboutStory";
import AboutTestimonial from "@/components/testimonial/AboutTestimonial";
import DigitalAgencyBrand from '@/components/brand/DigitalAgencyBrand';


const About = () => {
  return (
    <div>
    
      <main>
      <RootLayout header="header1" footer="footer1">
          <AboutHero />
          <AboutStory />
          <AboutCounter />
          {/* <AboutTeam /> */}
          <DigitalAgencyBrand />
          <AboutTestimonial />
          <AboutCTA />
        </RootLayout>
      </main>
    </div>
  );
};

export default About;

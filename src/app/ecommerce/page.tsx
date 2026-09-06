import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecommerce Solutions | Outlfy',
  description: 'Outlfy provides comprehensive ecommerce solutions to help businesses grow online',
  openGraph: {
    title: 'Ecommerce Solutions | Outlfy',
    description: 'Outlfy provides comprehensive ecommerce solutions to help businesses grow online',
    url: 'https://www.outlfy.com/ecommerce',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Ecommerce Solutions'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Solutions | Outlfy',
    description: 'Outlfy provides comprehensive ecommerce solutions to help businesses grow online',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

import RootLayout from "@/components/common/layout/RootLayout";
import StartupAgencyHero from "@/components/hero/StartupAgencyHero";
import StartupAgencyWorkflow from "@/components/workflow/StartupAgencyWorkflow";
import StartupAgencyFeature from "@/components/feature/StartupAgencyFeature";
import StartupAgencyService from "@/components/service/StartupAgencyService";
import StartupAgencyFaq from "@/components/faq/StartupAgencyFaq";
import StartupAgencyPortfolio from "@/components/portfolio/StartupAgencyPortfolio";
import StartupAgencyTestimonial from "@/components/testimonial/StartupAgencyTestimonial";
import StartupAgencySolution from "@/components/solution/StartupAgencySolution";
import StartupAgencyBlog from "@/components/blog/StartupAgencyBlog";
import StartupAgencyCTA from "@/components/cta/StartupAgencyCTA";
import DigitalMarketingBrand from '@/components/brand/DigitalMarketingBrand';

const StartupAgency = () => {
  return (
    <div>
      <main>
        <RootLayout header="header1" footer="footer1">
          <StartupAgencyHero />
          <StartupAgencyWorkflow />
          <StartupAgencyFeature />
          <StartupAgencyService />
          <StartupAgencyFaq />
          {/* <StartupAgencyPortfolio /> */}
          <DigitalMarketingBrand /> 
          <StartupAgencyTestimonial />
          <StartupAgencySolution />
          <StartupAgencyBlog />
          <StartupAgencyCTA />
        </RootLayout>
      </main>
    </div>
  );
};

export default StartupAgency;

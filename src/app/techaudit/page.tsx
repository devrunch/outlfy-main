import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Tech Audit | Outlfy Technology Assessment',
  description: 'Get a free technology audit from Outlfy. We assess your current tech stack and provide recommendations for scalable business growth.',
  openGraph: {
    title: 'Free Tech Audit | Outlfy Technology Assessment',
    description: 'Get a free technology audit from Outlfy. We assess your current tech stack and provide recommendations for scalable business growth.',
    url: 'https://www.outlfy.com/techaudit',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Free Tech Audit'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Tech Audit | Outlfy Technology Assessment',
    description: 'Get a free technology audit from Outlfy. We assess your current tech stack and provide recommendations for scalable business growth.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

import RootLayout from "@/components/common/layout/RootLayout";
import ServiceDetailsDevelopment from "@/components/development/ServiceDetailsDevelopment";
import ServiceDetailsWorkflow from "@/components/workflow/ServiceDetailsWorkflow";
import ServiceDetailsService from "@/components/service/ServiceDetailsService";
import ServiceDetailsFaq from "@/components/faq/ServiceDetailsFaq";
import DigitalAgencyCTA from "@/components/cta/DigitalAgencyCTA";

const ServiceDetails = () => {
  return (
    <>

      <main>
        <RootLayout header="header1" footer="footer1">
          <ServiceDetailsDevelopment />
          <ServiceDetailsWorkflow />
          <ServiceDetailsService />
          <ServiceDetailsFaq />
          <DigitalAgencyCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default ServiceDetails;

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tech Partnerships | Outlfy Technology Solutions',
  description: 'Partner with Outlfy for comprehensive technology solutions. We provide smart strategies and scalable tech partnerships for business growth.',
  openGraph: {
    title: 'Tech Partnerships | Outlfy Technology Solutions',
    description: 'Partner with Outlfy for comprehensive technology solutions. We provide smart strategies and scalable tech partnerships for business growth.',
    url: 'https://www.outlfy.com/techpartnership',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Tech Partnerships'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Partnerships | Outlfy Technology Solutions',
    description: 'Partner with Outlfy for comprehensive technology solutions. We provide smart strategies and scalable tech partnerships for business growth.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

import RootLayout from "@/components/common/layout/RootLayout";
import TechPartnershipHero from "@/components/hero/TechPartnershipHero";
import TechPartnershipServices from "@/components/service/TechPartnershipServices";
import TechPartnershipBenefits from "@/components/benefit/TechPartnershipBenefits";
import TechPartnershipWorkflow from "@/components/workflow/TechPartnershipWorkflow";
import IdealPartnerProfile from "@/components/feature/IdealPartnerProfile";
import TechPartnershipCTA from "@/components/cta/TechPartnershipCTA";

const TechPartnership = () => {
  return (
    <div>
      <main>
        <RootLayout header="header1" footer="footer1">
          <TechPartnershipHero />
          <TechPartnershipServices />
          <TechPartnershipBenefits />
          <TechPartnershipWorkflow />
          <IdealPartnerProfile />
          <TechPartnershipCTA />
        </RootLayout>
      </main>
    </div>
  );
};

export default TechPartnership;

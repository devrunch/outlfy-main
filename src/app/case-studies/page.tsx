import { Metadata } from 'next';
// This page has no server-side data fetch of its own — the case study list
// is loaded client-side (see CaseStudyListing), so there's nothing here
// that needs force-dynamic; the static shell can be prerendered.
export const metadata: Metadata = {
  title: 'Case Studies | Outlfy - Successful Digital Transformation Projects',
  description: 'Explore our successful projects and discover how we transform ideas into powerful digital solutions that drive real business growth.',
  openGraph: {
    title: 'Case Studies | Outlfy - Successful Digital Transformation Projects',
    description: 'Explore our successful projects and discover how we transform ideas into powerful digital solutions that drive real business growth.',
    url: 'https://www.outlfy.com/case-studies',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Case Studies'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies | Outlfy - Successful Digital Transformation Projects',
    description: 'Explore our successful projects and discover how we transform ideas into powerful digital solutions that drive real business growth.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

import RootLayout from "@/components/common/layout/RootLayout";
import CaseStudiesPage from "@/components/casestudy/CaseStudiesPage";

const CaseStudies = () => {
  return (
    <div>
      <main>
        <RootLayout header="header1" footer="footer1">
          <CaseStudiesPage />
        </RootLayout>
      </main>
    </div>
  );
};

export default CaseStudies;

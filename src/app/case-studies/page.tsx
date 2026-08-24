import { Metadata } from 'next';
// This page has no server-side data fetch of its own — the case study list
// is loaded client-side (see CaseStudyListing), so there's nothing here
// that needs force-dynamic; the static shell can be prerendered.
export const metadata: Metadata = {
  title: 'Case Studies | Outlfy - Successful Digital Transformation Projects',
  description: 'Explore our successful projects and discover how we transform ideas into powerful digital solutions that drive real business growth.',
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

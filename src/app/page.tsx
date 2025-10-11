import { Metadata } from 'next';
import { connectDB } from '@/lib/utils/database';
import { getFeaturedTestimonials } from '@/admin/models/Testimonial';

export const metadata: Metadata = {
  title: 'Outlfy - Tech Partners',
  description: 'Outlfy helps businesses succeed with custom software development and technology strategy',
};

import RootLayout from "@/components/common/layout/RootLayout";
import DigitalMarketingHero from "@/components/hero/DigitalMarketingHero";
import DigitalMarketingBrand from "@/components/brand/DigitalMarketingBrand";
import DigitalMarketingAbout from "@/components/about/DigitalMarketingAbout";
import DigitalMarketingService from "@/components/service/DigitalMarketingService";
import DigitalMarketingWorkflow from "@/components/workflow/DigitalMarketingWorkflow";
import TestimonialGrid from '@/components/testimonials/TestimonialGridHome';

async function hasFeaturedTestimonials(): Promise<boolean> {
  try {
    await connectDB();
    const result = await getFeaturedTestimonials();

    if (!result?.success || !Array.isArray(result.data)) {
      return false;
    }

    return result.data.length > 0;
  } catch (error) {
    console.error('Error checking featured testimonials:', error);
    return false;
  }
}

export default async function DigitalMarketing() {
  const showTestimonials = await hasFeaturedTestimonials();

  return (
    <main suppressHydrationWarning>
      <RootLayout header="header1" footer="footer1">
        <DigitalMarketingHero />
        <DigitalMarketingBrand />
        {showTestimonials && <TestimonialGrid />}
        <DigitalMarketingAbout />
        <DigitalMarketingService />
        {/* <DigitalMarketingProtfolio /> */}
        {/* <DigitalMarketingTestimonial /> */}
        <DigitalMarketingWorkflow />
        {/* <DigitalMarketingPrice /> */}
        {/* <DigitalMarketingBlog /> */}
      </RootLayout>
    </main>
  );
}

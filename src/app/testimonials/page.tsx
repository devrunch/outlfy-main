import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/utils/database';
import { getTestimonials } from '@/admin/models/Testimonial';
import RootLayout from "@/components/common/layout/RootLayout";
import TestimonialGrid from '@/components/testimonials/TestimonialGrid';
import TestimonialHero from '@/components/testimonials/TestimonialHero';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Client Testimonials | Outlfy Success Stories',
  description: 'Read what our clients say about Outlfy. Real success stories from businesses we\'ve helped scale with smart strategies and scalable solutions.',
  openGraph: {
    title: 'Client Testimonials | Outlfy Success Stories',
    description: 'Read what our clients say about Outlfy. Real success stories from businesses we\'ve helped scale with smart strategies and scalable solutions.',
    url: 'https://www.outlfy.com/testimonials',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Client Testimonials'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Client Testimonials | Outlfy Success Stories',
    description: 'Read what our clients say about Outlfy. Real success stories from businesses we\'ve helped scale with smart strategies and scalable solutions.',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

// Server-side function to fetch testimonials
async function getTestimonialsData(): Promise<any[] | null> {
  try {
    await connectDB();
    
    const result = await getTestimonials({
      page: 1,
      limit: 20,
      status: 'approved',
      sortBy: 'displayOrder',
      sortOrder: 'asc'
    });

    if (result.success) {
      return result.data || [];
    } else {
      console.error('Failed to fetch testimonials:', result.error);
      return null; // Return null to indicate error
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return null; // Return null to indicate error
  }
}

const TestimonialsPage = async () => {
  const testimonials = await getTestimonialsData();

  // Return 404 if there's an error or no testimonials
  if (testimonials === null || testimonials.length === 0) {
    notFound();
  }

  return (
    <div>
      <main>
        <RootLayout header="header1" footer="footer1">
          {/* Hero Section */}
           <TestimonialHero/>

            {/* Testimonials Grid */}
            <TestimonialGrid testimonials={testimonials} />
      
        </RootLayout>
      </main>
    </div>
  );
};

export default TestimonialsPage;

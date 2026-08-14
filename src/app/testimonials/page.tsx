import { Metadata } from 'next';
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

// Helper to convert Mongoose document to plain object
const toPlainObject = (doc: any) => {
  if (doc && typeof doc === 'object' && typeof doc.toObject === 'function') {
    return doc.toObject({ getters: true, virtuals: false });
  }
  return doc;
};

// Server-side function to fetch testimonials.
// Always resolves to an array — an unreachable DB or an empty result set
// should render a graceful empty state, not take down the whole page.
async function getTestimonialsData(): Promise<any[]> {
  try {
    await connectDB();

    const result = await getTestimonials({
      page: 1,
      limit: 20,
      status: 'approved',
      sortBy: 'displayOrder',
      sortOrder: 'asc'
    });

    if (result.success && Array.isArray(result.data)) {
      // Convert Mongoose documents to plain objects
      const plainData = result.data.map(item => {
        const plain = toPlainObject(item);
        // Ensure dates are serialized as strings
        return {
          ...plain,
          _id: plain._id?.toString() || plain._id,
          createdAt: plain.createdAt instanceof Date ? plain.createdAt.toISOString() : plain.createdAt,
          updatedAt: plain.updatedAt instanceof Date ? plain.updatedAt.toISOString() : plain.updatedAt,
        };
      });
      return plainData;
    }

    console.error('Failed to fetch testimonials:', result.error);
    return [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

const TestimonialsPage = async () => {
  const testimonials = await getTestimonialsData();

  return (
    <div>
      <main>
        <RootLayout header="header1" footer="footer1">
          {/* Hero Section */}
           <TestimonialHero/>

            {/* Testimonials Grid */}
            {testimonials.length > 0 ? (
              <TestimonialGrid testimonials={testimonials} />
            ) : (
              <div className="container mt-5 mb-5">
                <div className="text-center py-5">
                  <h3 className="mb-2">No testimonials yet</h3>
                  <p className="mb-0">Check back soon — we&apos;re collecting stories from our clients.</p>
                </div>
              </div>
            )}
        </RootLayout>
      </main>
    </div>
  );
};

export default TestimonialsPage;

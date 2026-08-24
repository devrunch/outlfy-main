import { Metadata } from 'next';
import { Suspense } from 'react';
import { connectDB } from '@/lib/utils/database';
import { getFeaturedTestimonials } from '@/admin/models/Testimonial';
import { toMediaUrl } from '@/lib/utils/testimonialMedia';

export const metadata: Metadata = {
  title: 'Outlfy - Tech Partners',
  description: 'Outlfy helps businesses succeed with custom software development and technology strategy',
};

// Testimonials only change via admin approval (which calls revalidatePath),
// so the homepage can be served from cache instead of re-querying Mongo
// (and re-shipping every testimonial's base64 images) on every request.
export const revalidate = 60;

import RootLayout from "@/components/common/layout/RootLayout";
import DigitalMarketingHero from "@/components/hero/DigitalMarketingHero";
import DigitalMarketingBrand from "@/components/brand/DigitalMarketingBrand";
import DigitalMarketingAbout from "@/components/about/DigitalMarketingAbout";
import TheOffer from "@/components/solutions/TheOffer";
import DigitalMarketingWorkflow from "@/components/workflow/DigitalMarketingWorkflow";
import TestimonialGrid, { type Testimonial as FeaturedTestimonial } from '@/components/testimonials/TestimonialGridHome';
import EntryOfferPopup from "@/components/popup/EntryOfferPopup";

// Helper to convert Mongoose document to plain object
const toPlainObject = (doc: unknown) => {
  if (doc && typeof doc === 'object' && typeof (doc as any).toObject === 'function') {
    return (doc as { toObject: (options?: Record<string, unknown>) => unknown }).toObject({ getters: true, virtuals: false });
  }

  return JSON.parse(JSON.stringify(doc ?? {}));
};

const normalizeFeaturedTestimonials = (items: unknown[]): FeaturedTestimonial[] => {
  return items.map((item, index) => {
    const plain = toPlainObject(item) as Record<string, any>;
    const createdAt = plain.createdAt instanceof Date
      ? plain.createdAt.toISOString()
      : typeof plain.createdAt === 'string'
        ? plain.createdAt
        : new Date().toISOString();

    const id = typeof plain._id === 'string' ? plain._id : plain._id?.toString?.() ?? `testimonial-${index}`;
    const updatedAt = plain.updatedAt instanceof Date
      ? plain.updatedAt.toISOString()
      : typeof plain.updatedAt === 'string'
        ? plain.updatedAt
        : undefined;

    return {
      _id: id,
      name: typeof plain.name === 'string' ? plain.name : '',
      position: typeof plain.position === 'string' ? plain.position : '',
      company: typeof plain.company === 'string' ? plain.company : '',
      testimonial: typeof plain.testimonial === 'string' ? plain.testimonial : '',
      profilePicture: toMediaUrl(id, 'profile', typeof plain.profilePicture === 'string' ? plain.profilePicture : '', updatedAt),
      companyLogo: toMediaUrl(id, 'logo', typeof plain.companyLogo === 'string' ? plain.companyLogo : '', updatedAt),
      linkedinUrl: typeof plain.linkedinUrl === 'string' ? plain.linkedinUrl : '',
      companySiteUrl: typeof plain.companySiteUrl === 'string' ? plain.companySiteUrl : '',
      videoUrl: typeof plain.videoUrl === 'string' ? plain.videoUrl : undefined,
      audioUrl: toMediaUrl(id, 'audio', typeof plain.audioUrl === 'string' ? plain.audioUrl : '', updatedAt) || undefined,
      projectType: typeof plain.projectType === 'string' ? plain.projectType : '',
      status: typeof plain.status === 'string' ? plain.status : '',
      featured: true,
      displayOrder: typeof plain.displayOrder === 'number' ? plain.displayOrder : index,
      createdAt,
    } satisfies FeaturedTestimonial;
  });
};

// Safe server-side fetch for featured testimonials with a short timeout.
// Uses Promise.race to avoid blocking page render when the DB is slow or unreachable.
async function fetchFeaturedTestimonialsWithTimeout(timeout = 10000): Promise<FeaturedTestimonial[] | null> {
  let didTimeout = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    const operation = (async () => {
      await connectDB();
      const result = await getFeaturedTestimonials();

      if (!result?.success || !Array.isArray(result.data)) {
        console.warn('fetchFeaturedTestimonialsWithTimeout: unexpected response shape', result?.error);
        return null;
      }

      if (result.data.length === 0) {
        console.warn('fetchFeaturedTestimonialsWithTimeout: no featured testimonials found');
        return null;
      }

      const trimmed = result.data.slice(0, 3);
      return normalizeFeaturedTestimonials(trimmed);
    })().catch((err) => {
      console.error('fetchFeaturedTestimonialsWithTimeout: DB query failed', err);
      return null;
    });

    const timed = await Promise.race<FeaturedTestimonial[] | null>([
      operation,
      new Promise<null>((resolve) => {
        timeoutId = setTimeout(() => {
          didTimeout = true;
          console.warn(`fetchFeaturedTestimonialsWithTimeout: timed out after ${timeout}ms`);
          resolve(null);
        }, timeout);
      }),
    ]);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (didTimeout) {
      return null;
    }

    return timed && timed.length ? timed : null;
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return null;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

// Isolated in its own component so Suspense can stream the rest of the
// homepage immediately instead of blocking on this DB round-trip.
async function FeaturedTestimonials() {
  const featuredTestimonials = await fetchFeaturedTestimonialsWithTimeout(10000);
  return <TestimonialGrid testimonials={featuredTestimonials || []} />;
}

export default function DigitalMarketing() {
  return (
    <main suppressHydrationWarning>
      <EntryOfferPopup />
      <RootLayout header="header1" footer="footer1">
        <DigitalMarketingHero />
        <DigitalMarketingBrand />
        <Suspense fallback={null}>
          <FeaturedTestimonials />
        </Suspense>
        <DigitalMarketingAbout />
        <TheOffer />
        {/* <DigitalMarketingProtfolio /> */}
        {/* <DigitalMarketingTestimonial /> */}
        <DigitalMarketingWorkflow />
        {/* <DigitalMarketingPrice /> */}
        {/* <DigitalMarketingBlog /> */}
      </RootLayout>
    </main>
  );
}

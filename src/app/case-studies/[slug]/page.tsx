import { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import RootLayout from "@/components/common/layout/RootLayout";
import CaseStudyDetail from "@/components/casestudy/CaseStudyDetail";
import dbConnect from "@/lib/mongodb";
import CaseStudyModel from "@/admin/models/CaseStudy";
import { CaseStudy } from '@/types/case-study';
import { toMediaUrl } from '@/lib/utils/caseStudyMedia';

// Case studies only change via admin publish/edit (which calls
// revalidatePath), so this page can be served from cache instead of
// re-querying Mongo on every request.
export const revalidate = 60;

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Without this, a dynamic segment isn't eligible for the Full Route Cache
// at all (Next.js server-renders it on demand for every request, ignoring
// `revalidate`) — this is what actually makes ISR apply here.
export async function generateStaticParams() {
  try {
    await dbConnect();
    const slugs = await CaseStudyModel.find({ status: 'published' })
      .select('slug')
      .lean<{ slug: string }[]>();
    return slugs.map((cs) => ({ slug: cs.slug }));
  } catch (error) {
    console.error('Error generating case study static params:', error);
    return [];
  }
}

// Wrapped in React's cache() so generateMetadata and the page component
// share a single Mongo query per request instead of running it twice.
const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | null> => {
  try {
    await dbConnect();

    const caseStudy = await CaseStudyModel.findOne({
      slug,
      status: 'published'
    })
      .select('-__v')
      .lean<CaseStudy | null>();

    if (!caseStudy) {
      return null;
    }

    const serializedCaseStudy = JSON.parse(
      JSON.stringify(caseStudy)
    ) as CaseStudy;

    const id = (serializedCaseStudy as any)._id;
    const updatedAt = (serializedCaseStudy as any).updatedAt;

    if (serializedCaseStudy.featuredImage?.url) {
      serializedCaseStudy.featuredImage.url = toMediaUrl(id, 'featured', serializedCaseStudy.featuredImage.url, updatedAt);
    }
    if (serializedCaseStudy.clientLogo) {
      serializedCaseStudy.clientLogo = toMediaUrl(id, 'logo', serializedCaseStudy.clientLogo, updatedAt);
    }

    return serializedCaseStudy;
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
});

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const caseStudy = await getCaseStudy(resolvedParams.slug);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Outlfy',
      description: 'The requested case study could not be found.',
    };
  }

  const ogImage = caseStudy.featuredImage?.url || 'https://www.outlfy.com/assets/og-image.jpg';

  return {
    title: `${caseStudy.title} | Case Study | Outlfy`,
    description: caseStudy.seo?.metaDescription || caseStudy.summary || `Discover how Outlfy helped ${caseStudy.clientName} achieve their digital transformation goals.`,
    keywords: caseStudy.seo?.keywords || caseStudy.tags?.join(', '),
    openGraph: {
      title: caseStudy.seo?.ogTitle || caseStudy.title,
      description: caseStudy.seo?.ogDescription || caseStudy.summary,
      url: `https://www.outlfy.com/case-studies/${resolvedParams.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: caseStudy.title
        }
      ],
      siteName: 'Outlfy',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.title,
      description: caseStudy.summary,
      images: [ogImage],
    },
  };
}

const CaseStudyPage = async ({ params }: CaseStudyPageProps) => {
  const resolvedParams = await params;
  const caseStudy = await getCaseStudy(resolvedParams.slug);
  
  if (!caseStudy) {
    notFound();
  }

  return (
    <div>
      <main>
        <RootLayout header="header1" footer="footer1">
          <CaseStudyDetail caseStudy={caseStudy} />
        </RootLayout>
      </main>
    </div>
  );
};

export default CaseStudyPage;

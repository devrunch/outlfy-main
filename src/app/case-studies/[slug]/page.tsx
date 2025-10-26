import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RootLayout from "@/components/common/layout/RootLayout";
import CaseStudyDetail from "@/components/casestudy/CaseStudyDetail";
import { CaseStudy } from '@/types/case-study';
export const dynamic = "force-dynamic";
interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL;
    const baseUrl = envUrl
      ? envUrl.startsWith('http')
        ? envUrl
        : `https://${envUrl}`
      : process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : undefined;

    if (!baseUrl) {
      throw new Error('Unable to resolve base URL for case study request');
    }

    const response = await fetch(
      `${baseUrl}/api/case-studies/${encodeURIComponent(slug)}`,
      {
        cache: 'no-store', // Ensure fresh data
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.caseStudy;
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const caseStudy = await getCaseStudy(resolvedParams.slug);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Outlfy',
      description: 'The requested case study could not be found.',
    };
  }

  return {
    title: `${caseStudy.title} | Case Study | Outlfy`,
    description: caseStudy.seo?.metaDescription || caseStudy.summary || `Discover how Outlfy helped ${caseStudy.clientName} achieve their digital transformation goals.`,
    keywords: caseStudy.seo?.keywords || caseStudy.tags?.join(', '),
    openGraph: {
      title: caseStudy.seo?.ogTitle || caseStudy.title,
      description: caseStudy.seo?.ogDescription || caseStudy.summary,
      images: caseStudy.featuredImage?.url ? [caseStudy.featuredImage.url] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.title,
      description: caseStudy.summary,
      images: caseStudy.featuredImage?.url ? [caseStudy.featuredImage.url] : [],
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

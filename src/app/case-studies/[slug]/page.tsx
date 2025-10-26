import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RootLayout from "@/components/common/layout/RootLayout";
import CaseStudyDetail from "@/components/casestudy/CaseStudyDetail";
import dbConnect from "@/lib/mongodb";
import CaseStudyModel from "@/admin/models/CaseStudy";
import { CaseStudy } from '@/types/case-study';
export const dynamic = "force-dynamic";
interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
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

    return serializedCaseStudy;
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

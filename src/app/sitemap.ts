import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.outlfy.com';

// Re-generate at most once an hour so newly published case studies appear.
export const revalidate = 3600;

const staticRoutes = [
  { path: '/', priority: 1.0 },
  { path: '/about', priority: 0.8 },
  { path: '/techpartnership', priority: 0.9 },
  { path: '/techaudit', priority: 0.9 },
  { path: '/ecommerce', priority: 0.9 },
  { path: '/ecommerce/website', priority: 0.8 },
  { path: '/ecommerce/inventory', priority: 0.8 },
  { path: '/ecommerce/delivery', priority: 0.8 },
  { path: '/testimonials', priority: 0.7 },
  { path: '/case-studies', priority: 0.8 },
  { path: '/contact', priority: 0.7 },
  { path: '/career', priority: 0.5 },
  { path: '/career/internship', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority,
  }));

  // Published case studies come from MongoDB. If the DB is unreachable
  // (e.g. at build time without env vars) we still return the static pages.
  try {
    const { default: dbConnect } = await import('@/lib/mongodb');
    const { default: CaseStudyModel } = await import('@/admin/models/CaseStudy');
    await dbConnect();

    const studies = await CaseStudyModel.find({ status: 'published' })
      .select('slug updatedAt')
      .lean<{ slug: string; updatedAt?: Date }[]>();

    for (const study of studies) {
      entries.push({
        url: `${SITE_URL}/case-studies/${study.slug}`,
        lastModified: study.updatedAt ? new Date(study.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('sitemap: could not load case studies', error);
  }

  return entries;
}

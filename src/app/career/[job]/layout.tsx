import { Metadata } from 'next';

interface JobLayoutProps {
  children: React.ReactNode;
  params: Promise<{ job: string }>;
}

function formatJobTitle(slug: string): string {
  return decodeURIComponent(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: JobLayoutProps): Promise<Metadata> {
  const { job } = await params;
  const jobTitle = formatJobTitle(job);

  const title = `${jobTitle} | Careers at Outlfy`;
  const description = `Apply for the ${jobTitle} role at Outlfy and join our team to help businesses scale with smart strategies and scalable solutions.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.outlfy.com/career/${job}`,
      type: 'website',
      images: [
        {
          url: 'https://www.outlfy.com/assets/og-image.jpg',
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      siteName: 'Outlfy'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.outlfy.com/assets/og-image.jpg']
    }
  };
}

export default function JobLayout({ children }: JobLayoutProps) {
  return children;
}

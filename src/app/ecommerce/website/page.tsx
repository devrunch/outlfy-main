import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecommerce Website Development | Outlfy',
  description: 'Build a high-performing ecommerce website with Outlfy\'s custom development services',
  openGraph: {
    title: 'Ecommerce Website Development | Outlfy',
    description: 'Build a high-performing ecommerce website with Outlfy\'s custom development services',
    url: 'https://www.outlfy.com/ecommerce/website',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Ecommerce Website Development'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Website Development | Outlfy',
    description: 'Build a high-performing ecommerce website with Outlfy\'s custom development services',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};


import RootLayout from "@/components/common/layout/RootLayout";
import EcommerceWebsiteHero from "@/components/hero/EcommerceWebsiteHero";
import EcommerceWebsiteService from "@/components/service/EcommerceWebsiteService";
import EcommerceWebsiteBrand from "@/components/brand/EcommerceWebsiteBrand";
import EcommerceWebsiteCTA from "@/components/cta/EcommerceWebsiteCTA";

const Service = () => {
  return (
    <>
     
      <main>
        <RootLayout header="header1" footer="footer1">
          <EcommerceWebsiteHero />
          <EcommerceWebsiteService />
          <EcommerceWebsiteBrand />
          <EcommerceWebsiteCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default Service;

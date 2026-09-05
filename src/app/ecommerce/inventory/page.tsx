import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecommerce Inventory Management | Outlfy',
  description: 'Outlfy\'s inventory management solutions help ecommerce businesses optimize stock and improve efficiency',
  openGraph: {
    title: 'Ecommerce Inventory Management | Outlfy',
    description: 'Outlfy\'s inventory management solutions help ecommerce businesses optimize stock and improve efficiency',
    url: 'https://www.outlfy.com/ecommerce/inventory',
    type: 'website',
    images: [
      {
        url: 'https://www.outlfy.com/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Outlfy Ecommerce Inventory Management'
      }
    ],
    siteName: 'Outlfy'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Inventory Management | Outlfy',
    description: 'Outlfy\'s inventory management solutions help ecommerce businesses optimize stock and improve efficiency',
    images: ['https://www.outlfy.com/assets/og-image.jpg']
  }
};

import RootLayout from "@/components/common/layout/RootLayout";
import EcommerceInventoryHero from "@/components/hero/EcommerceInventoryHero";
import EcommerceInventoryService from "@/components/service/EcommerceInventoryService";
import EcommerceInventoryBrand from "@/components/brand/EcommerceInventoryBrand";
import EcommerceInventoryCTA from "@/components/cta/EcommerceInventoryCTA";

const Service = () => {
  return (
    <>
    
      <main>
        <RootLayout header="header1" footer="footer1">
          <EcommerceInventoryHero />
          <EcommerceInventoryService />
          <EcommerceInventoryBrand />
          <EcommerceInventoryCTA />
        </RootLayout>
      </main>
    </>
  );
};

export default Service;

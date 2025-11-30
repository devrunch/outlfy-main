"use client";
import CareerBenefit from '@/components/benefit/CareerBenefit';
import Career1 from '@/components/career/Career1'
import CareerGallery from '@/components/gallery/CareerGallery';
import CareerHero from '@/components/hero/CareerHero'
import React from 'react'
import RootLayout from "@/components/common/layout/RootLayout";

const Career = () => {
  return (
    <>
    <main suppressHydrationWarning>

     <RootLayout header="header1" footer="footer1">
      <CareerHero />
      <CareerGallery />
      {/* <CareerBenefit/> */}
      <Career1 />
     </RootLayout>
    </main>
      
    </>
  )
}
export default Career;
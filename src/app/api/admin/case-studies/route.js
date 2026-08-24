import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/utils/database';
import { checkAdminAuth } from '@/lib/adminAuth';
import CaseStudy from '@/admin/models/CaseStudy';
import { validateCaseStudyForAPI } from '@/lib/validation/caseStudyValidation';

// The case study detail pages are cached (revalidate = 60s) so they don't
// re-hit Mongo on every visit. Any admin change that affects what's
// publicly shown needs to bust that cache immediately.
const revalidatePublicCaseStudyPages = () => {
  revalidatePath('/case-studies');
  revalidatePath('/case-studies/[slug]', 'page');
};

// Get all case studies
export async function GET(request) {
  // Check authentication
  const authCheck = checkAdminAuth(request);
  if (!authCheck.authenticated) {
    return authCheck.response;
  }

  try {
    await connectDB();
    
    const caseStudies = await CaseStudy.find()
      .sort({ createdAt: -1 })
      .select('title slug clientName projectType industry status published featured timeline budget createdAt author');
      
    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}

// Create a new case study
export async function POST(request) {
  // Check authentication
  const authCheck = checkAdminAuth(request);
  if (!authCheck.authenticated) {
    return authCheck.response;
  }

  try {
    await connectDB();
    
    const data = await request.json();
    
    // Server-side validation using shared utility
    const { isValid, errors: validationErrors } = validateCaseStudyForAPI(data);
    
    if (!isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          validationErrors 
        },
        { status: 400 }
      );
    }
    
    // Generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
    
    const caseStudy = new CaseStudy(data);
    await caseStudy.save();
    revalidatePublicCaseStudyPages();

    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    console.error('Error creating case study:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A case study with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      return NextResponse.json(
        { 
          error: 'Validation failed',
          validationErrors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create case study' },
      { status: 500 }
    );
  }
}

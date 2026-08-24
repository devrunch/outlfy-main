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

// Get a specific case study
export async function GET(request, { params }) {
  // Check authentication
  const authCheck = checkAdminAuth(request);
  if (!authCheck.authenticated) {
    return authCheck.response;
  }

  try {
    await connectDB();
    
    const { id } = await params;
    const caseStudy = await CaseStudy.findById(id);
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error('Error fetching case study:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case study' },
      { status: 500 }
    );
  }
}

// Update a case study
export async function PUT(request, { params }) {
  // Check authentication
  const authCheck = checkAdminAuth(request);
  if (!authCheck.authenticated) {
    return authCheck.response;
  }

  try {
    await connectDB();
    
    const { id } = await params;
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
    
    // Update slug if title changed
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
    
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      id, 
      data, 
      { new: true, runValidators: true }
    );
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      );
    }

    revalidatePublicCaseStudyPages();
    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error('Error updating case study:', error);
    
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
      { error: 'Failed to update case study' },
      { status: 500 }
    );
  }
}

// Delete a case study
export async function DELETE(request, { params }) {
  // Check authentication
  const authCheck = checkAdminAuth(request);
  if (!authCheck.authenticated) {
    return authCheck.response;
  }

  try {
    await connectDB();
    
    const { id } = await params;
    const caseStudy = await CaseStudy.findByIdAndDelete(id);
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      );
    }

    revalidatePublicCaseStudyPages();
    return NextResponse.json({ message: 'Case study deleted successfully' });
  } catch (error) {
    console.error('Error deleting case study:', error);
    return NextResponse.json(
      { error: 'Failed to delete case study' },
      { status: 500 }
    );
  }
}

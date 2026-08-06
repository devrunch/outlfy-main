import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/database';
import { getTestimonials } from '@/admin/models/Testimonial';

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const projectType = searchParams.get('projectType');
    const featured = searchParams.get('featured');

    // Get testimonials with pagination — only approved testimonials are
    // ever exposed through this public endpoint.
    const result = await getTestimonials({
      status: 'approved',
      ...(projectType && projectType !== 'all' ? { projectType } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
      page,
      limit,
      sortBy: 'displayOrder',
      sortOrder: 'asc'
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testimonials: result.data,
      pagination: {
        page,
        limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
        hasNextPage: page < result.pagination.pages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch testimonials' 
      },
      { status: 500 }
    );
  }
}
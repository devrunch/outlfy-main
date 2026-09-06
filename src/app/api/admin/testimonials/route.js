import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/utils/database';
import {
  createTestimonial,
  getTestimonials,
  bulkDeleteTestimonials,
  getTestimonialStats
} from '@/admin/models/Testimonial';

// The homepage and /testimonials page are cached (revalidate = 60s) so they
// don't re-hit Mongo on every visit. Any admin change that affects what's
// publicly shown needs to bust that cache immediately.
const revalidatePublicTestimonialPages = () => {
  revalidatePath('/');
  revalidatePath('/testimonials');
};

// CORS helpers
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
  .flatMap(o => {
    if (o === '*') return ['*'];
    if (o.startsWith('http://') || o.startsWith('https://')) return [o];
    return [`https://${o}`, `http://${o}`];
  });

const getAllowedOrigin = (origin) => {
  if (ALLOWED_ORIGINS.includes('*')) return '*';
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  return '';
};

const corsHeaders = (origin) => {
  const allowOrigin = getAllowedOrigin(origin);
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;
  return headers;
};

// Preflight handler
export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

// GET - Get all testimonials with filtering/pagination
export async function GET(request) {
  try {
    await connectDB();
    const origin = request.headers.get('origin');
    const { searchParams } = new URL(request.url);
    
    // Check if requesting stats
    if (searchParams.get('stats') === 'true') {
      const stats = await getTestimonialStats();
      return NextResponse.json(stats, { 
        status: stats.success ? 200 : 500,
        headers: corsHeaders(origin) 
      });
    }

    // Regular testimonials query
    const options = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      status: searchParams.get('status'),
      featured: searchParams.get('featured') === 'true' ? true : 
               searchParams.get('featured') === 'false' ? false : undefined,
      company: searchParams.get('company'),
      projectType: searchParams.get('projectType'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    };

    const result = await getTestimonials(options);
    return NextResponse.json(result, { 
      status: result.success ? 200 : 500,
      headers: corsHeaders(origin) 
    });

  } catch (error) {
    console.error('GET testimonials error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        message: 'Failed to retrieve testimonials' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// POST - Create new testimonial
export async function POST(request) {
  try {
    await connectDB();
    const origin = request.headers.get('origin');
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'position', 'company', 'testimonial', 'profilePicture', 'companyLogo', 'companySiteUrl'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const result = await createTestimonial(data);
    if (result.success) revalidatePublicTestimonialPages();
    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
      headers: corsHeaders(origin)
    });

  } catch (error) {
    console.error('POST testimonial error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        message: 'Failed to create testimonial' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// DELETE - Bulk delete testimonials
export async function DELETE(request) {
  try {
    await connectDB();
    const origin = request.headers.get('origin');
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please provide an array of testimonial IDs to delete' 
        },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const result = await bulkDeleteTestimonials(ids);
    if (result.success) revalidatePublicTestimonialPages();
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
      headers: corsHeaders(origin)
    });

  } catch (error) {
    console.error('DELETE testimonials error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        message: 'Failed to delete testimonials' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
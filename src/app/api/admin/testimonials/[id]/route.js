import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/utils/database';
import {
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialStatus,
  toggleFeatured
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
    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,PATCH,OPTIONS',
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

// GET - Get single testimonial by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const origin = request.headers.get('origin');
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID is required' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const result = await getTestimonialById(id);
    return NextResponse.json(result, { 
      status: result.success ? 200 : 404,
      headers: corsHeaders(origin) 
    });

  } catch (error) {
    console.error('GET testimonial by ID error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        message: 'Failed to retrieve testimonial' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// PUT - Update testimonial
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const origin = request.headers.get('origin');
    const { id } = await params;
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID is required' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const result = await updateTestimonial(id, data);
    if (result.success) revalidatePublicTestimonialPages();
    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
      headers: corsHeaders(origin)
    });

  } catch (error) {
    console.error('PUT testimonial error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        message: 'Failed to update testimonial' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// PATCH - Update testimonial status or toggle featured
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const origin = request.headers.get('origin');
    const { id } = await params;
    const { action, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID is required' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    let result;
    
    if (action === 'toggle-featured') {
      result = await toggleFeatured(id);
    } else if (action === 'update-status' && status) {
      result = await updateTestimonialStatus(id, status);
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid action. Use "toggle-featured" or "update-status" with status field' 
        },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (result.success) revalidatePublicTestimonialPages();
    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
      headers: corsHeaders(origin)
    });

  } catch (error) {
    console.error('PATCH testimonial error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        message: 'Failed to update testimonial' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// DELETE - Delete single testimonial
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const origin = request.headers.get('origin');
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Testimonial ID is required' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const result = await deleteTestimonial(id);
    if (result.success) revalidatePublicTestimonialPages();
    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
      headers: corsHeaders(origin)
    });

  } catch (error) {
    console.error('DELETE testimonial error:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { 
        success: false, 
        error: error.message, 
        message: 'Failed to delete testimonial' 
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
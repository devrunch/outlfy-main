import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/database';
import Testimonial from '@/admin/models/Testimonial';

const FIELD_MAP = {
  profile: 'profilePicture',
  logo: 'companyLogo',
  audio: 'audioUrl',
};

const DATA_URI_PATTERN = /^data:([^;]+);base64,(.+)$/s;

// Serves the base64 image/audio that a testimonial document stores in Mongo
// as an actual binary HTTP response instead of inline page HTML — see
// src/lib/utils/testimonialMedia.js for why that matters. Only approved
// testimonials are served here, matching the public /api/testimonials rule.
export async function GET(request, { params }) {
  const { id, field } = await params;
  const dbField = FIELD_MAP[field];

  if (!dbField) {
    return NextResponse.json({ success: false, message: 'Invalid media field' }, { status: 400 });
  }

  try {
    await connectDB();

    const doc = await Testimonial.findOne({ _id: id, status: 'approved' })
      .select(dbField)
      .lean();

    const value = doc?.[dbField];
    const match = typeof value === 'string' ? DATA_URI_PATTERN.exec(value) : null;

    if (!match) {
      return NextResponse.json({ success: false, message: 'Media not found' }, { status: 404 });
    }

    const [, mimeType, base64Data] = match;
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        // Safe to cache for a long time — the URL's `v` query param changes
        // whenever the testimonial is updated, so a stale cached copy is
        // simply never requested again after an edit.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('GET testimonial media error:', error);
    return NextResponse.json({ success: false, message: 'Failed to load media' }, { status: 500 });
  }
}

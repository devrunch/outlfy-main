import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/utils/database';
import CaseStudy from '@/admin/models/CaseStudy';

const FIELD_CONFIG = {
  featured: {
    select: 'featuredImage.url',
    get: (doc) => doc?.featuredImage?.url,
  },
  logo: {
    select: 'clientLogo',
    get: (doc) => doc?.clientLogo,
  },
};

const DATA_URI_PATTERN = /^data:([^;]+);base64,(.+)$/s;

// Serves the base64 image that a case study document stores in Mongo as an
// actual binary HTTP response instead of inline page HTML/JSON — see
// src/lib/utils/caseStudyMedia.js for why that matters. Only published case
// studies are served here, matching the public /api/case-studies rule.
export async function GET(request, { params }) {
  // Despite the folder name (shared with the sibling /[slug] route so
  // Next.js doesn't reject mismatched dynamic segment names at this path
  // level), the value passed here is always the case study's Mongo _id —
  // see toMediaUrl() in src/lib/utils/caseStudyMedia.js.
  const { slug: id, field } = await params;
  const config = FIELD_CONFIG[field];

  if (!config) {
    return NextResponse.json({ success: false, message: 'Invalid media field' }, { status: 400 });
  }

  try {
    await connectDB();

    const doc = await CaseStudy.findOne({ _id: id, status: 'published' })
      .select(config.select)
      .lean();

    const value = config.get(doc);
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
        // whenever the case study is updated, so a stale cached copy is
        // simply never requested again after an edit.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('GET case study media error:', error);
    return NextResponse.json({ success: false, message: 'Failed to load media' }, { status: 500 });
  }
}

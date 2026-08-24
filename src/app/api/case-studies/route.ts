import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CaseStudy from '@/admin/models/CaseStudy';
import { toMediaUrl } from '@/lib/utils/caseStudyMedia';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const category = searchParams.get('category');
    const industry = searchParams.get('industry');
    const technology = searchParams.get('technology');
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    // Build filter object
    const filter: any = { status: 'published' };

    if (category && category !== 'all') {
      filter.projectType = category;
    }

    if (industry && industry !== 'all') {
      filter.industry = industry;
    }

    if (technology && technology !== 'all') {
      filter['technologies.name'] = new RegExp(technology, 'i');
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { clientName: new RegExp(search, 'i') },
        { summary: new RegExp(search, 'i') },
        { projectType: new RegExp(search, 'i') },
        { industry: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    let sortObject: any = {};
    switch (sort) {
      case 'newest':
        sortObject = { publishedAt: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortObject = { publishedAt: 1, createdAt: 1 };
        break;
      case 'title':
        sortObject = { title: 1 };
        break;
      case 'client':
        sortObject = { clientName: 1 };
        break;
      default:
        sortObject = { publishedAt: -1, createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [caseStudies, total] = await Promise.all([
      CaseStudy.find(filter)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .populate('technologies', 'name category icon')
        .populate('author', 'name avatar')
        .select('-__v')
        .lean(),
      CaseStudy.countDocuments(filter)
    ]);

    // Get filter options for frontend
    const [projectTypes, industries, technologies] = await Promise.all([
      CaseStudy.distinct('projectType', { status: 'published' }),
      CaseStudy.distinct('industry', { status: 'published' }),
      CaseStudy.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$technologies' },
        { $lookup: {
          from: 'technologies',
          localField: 'technologies',
          foreignField: '_id',
          as: 'tech'
        }},
        { $unwind: '$tech' },
        { $group: {
          _id: '$tech.name',
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: 20 }
      ])
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Swap embedded base64 images for URLs into the media route below —
    // otherwise this JSON response (fetched client-side by the case
    // studies listing) balloons with every card's full-size image data.
    const media = caseStudies.map((cs: any) => ({
      ...cs,
      featuredImage: cs.featuredImage
        ? { ...cs.featuredImage, url: toMediaUrl(cs._id, 'featured', cs.featuredImage.url, cs.updatedAt) }
        : cs.featuredImage,
      clientLogo: toMediaUrl(cs._id, 'logo', cs.clientLogo, cs.updatedAt),
    }));

    return NextResponse.json({
      success: true,
      data: {
        caseStudies: media,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          projectTypes: projectTypes.filter(Boolean),
          industries: industries.filter(Boolean),
          technologies: technologies.map((t: any) => t._id).filter(Boolean)
        }
      }
    }, {
      headers: {
        // Case studies only change via admin publish/edit — safe to let a
        // CDN/browser reuse this response instead of hitting Mongo (and
        // re-shipping every card's image URLs) on every visit.
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch case studies'
      },
      { status: 500 }
    );
  }
}

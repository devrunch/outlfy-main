import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectDB } from '@/lib/utils/database';
import FormResponse from '@/admin/models/FormResponse';
import { verifyRecaptcha } from '@/lib/utils/verifyRecaptcha';

const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'aashish@outlfy.com';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Outlfy Website <onboarding@resend.dev>';

const buildNotificationHtml = (data) => `
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <p><strong>Message:</strong><br/>${data.message}</p>
  ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
  ${data.website ? `<p><strong>Website:</strong> ${data.website}</p>` : ''}
  ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
  ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
`;

const buildNotificationText = (data) =>
  [
    'New Contact Form Submission',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'N/A'}`,
    `Subject: ${data.subject}`,
    `Message:\n${data.message}`,
  ].join('\n\n');

async function notifyAdmin(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Skipping contact form admin notification, missing env var: RESEND_API_KEY');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: ADMIN_NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject: `New Contact Form Submission - ${data.name}`,
    text: buildNotificationText(data),
    html: buildNotificationHtml(data),
  });

  if (error) {
    throw new Error(error.message || 'Failed to send email via Resend');
  }
}

// CORS helpers
const RAW_ALLOWED = ('store.outlfy.com,www.store.outlfy.com,localhost:3000,localhost:3001,localhost:3002,localhost:3003,localhost:3004,localhost:3005,localhost:3006,localhost:3007,localhost:3008,localhost:3009');

// Expand host entries to full origins with schemes so they match the browser's Origin header
const ALLOWED_ORIGINS = RAW_ALLOWED
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
  .flatMap(o => {
    if (o === '*') return ['*'];
    if (o.startsWith('http://') || o.startsWith('https://')) return [o];
    // default: include both https and http variants
    return [`https://${o}`, `http://${o}`];
  });

const getAllowedOrigin = (origin) => {
  if (ALLOWED_ORIGINS.includes('*')) return '*';
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  return ''; // no match => no CORS header
};

const corsHeaders = (origin) => {
  const allowOrigin = getAllowedOrigin(origin);
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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
    headers: {
      ...corsHeaders(origin),
    },
  });
}

// Handle contact form submissions
export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();
    const origin = request.headers.get('origin');

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400, headers: { ...corsHeaders(origin) } }
      );
    }

    const remoteIp = request.headers.get('x-forwarded-for');
    const recaptchaResult = await verifyRecaptcha(data.recaptchaToken, remoteIp, 'contact_submit');
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { error: 'Captcha verification failed. Please try again.' },
        { status: 400, headers: { ...corsHeaders(origin) } }
      );
    }

    // Create form response
    const formResponse = new FormResponse({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'Contact Form Submission',
      message: data.message,
      formType: 'contact',
      source: data.source || 'contact-page',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      meta: {
        company: data.company,
        website: data.website,
        budget: data.budget,
        timeline: data.timeline,
        services: data.services,
        ...data.customFields,
      },
    });

    await formResponse.save();

    try {
      await notifyAdmin({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || 'Contact Form Submission',
        message: data.message,
        company: data.company,
        website: data.website,
        budget: data.budget,
        timeline: data.timeline,
      });
    } catch (notifyError) {
      console.error('Failed to send admin notification email:', notifyError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
        id: formResponse._id,
      },
      { status: 201, headers: { ...corsHeaders(origin) } }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    const origin = request.headers.get('origin');

    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500, headers: { ...corsHeaders(origin) } }
    );
  }
}

// Get all contact form submissions (for admin)
export async function GET(request) {
  try {
    await connectDB();

    const origin = request.headers.get('origin');
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');

    const query = {};
    if (status) {
      query.status = status;
    }

    const submissions = await FormResponse
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('name email subject formType status createdAt');

    const total = await FormResponse.countDocuments(query);

    return NextResponse.json(
      {
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: { ...corsHeaders(origin) } }
    );
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500, headers: { ...corsHeaders(origin) } }
    );
  }
}

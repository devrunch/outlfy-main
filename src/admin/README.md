# Outlfy Admin Panel

A comprehensive admin panel for managing case studies and form responses in the Outlfy Next.js application.

## 📁 Structure

```
src/
├── admin/
│   ├── components/
│   │   ├── AdminLayout.jsx          # Main admin layout with sidebar
│   │   ├── AdminDashboard.jsx       # Dashboard with stats and overview
│   │   ├── CaseStudyForm.jsx        # Add/Edit case studies
│   │   ├── CaseStudyList.jsx        # List and manage case studies
│   │   └── FormResponseList.jsx     # View and manage form submissions
│   ├── models/
│   │   ├── CaseStudy.js            # MongoDB schema for case studies
│   │   └── FormResponse.js         # MongoDB schema for form responses
│   └── styles/
│       └── _admin.scss             # Custom admin panel styles
├── app/
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard page
│   │   ├── case-studies/
│   │   │   └── page.tsx            # Case studies management page
│   │   └── responses/
│   │       └── page.tsx            # Form responses page
│   └── api/
│       └── contact/
│           └── route.ts            # API endpoint for form submissions
```

## 🚀 Features

### Case Studies Management
- ✅ Add new case studies with rich content sections
- ✅ Edit existing case studies
- ✅ Structured sections: Problem, Solution, Process, Results, etc.
- ✅ Toggle featured/published status
- ✅ Search and filter functionality
- ✅ Responsive design with Bootstrap 5

### Form Responses Management
- ✅ View all contact form submissions
- ✅ Update response status (New, Read, Replied, Archived)
- ✅ Add admin notes to responses
- ✅ Search and filter responses
- ✅ Direct email reply integration
- ✅ Response details modal

### Dashboard
- ✅ Overview statistics
- ✅ Recent submissions
- ✅ Quick actions
- ✅ System status information

## 🎨 Design Features

- **Modern UI**: Clean, professional design with Bootstrap 5
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Consistent with Outlfy brand colors
- **Animations**: Smooth transitions and loading states
- **Icons**: Font Awesome icons throughout
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🛠️ Setup Instructions

### 1. Install Dependencies

Make sure you have Bootstrap 5 and Font Awesome installed:

```bash
npm install bootstrap react-bootstrap
```

Add Font Awesome to your layout or import it:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

### 2. Database Setup (MongoDB)

Install MongoDB dependencies:

```bash
npm install mongoose
```

Create a database connection file (`src/lib/mongodb.js`):

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

### 3. Environment Variables

Add to your `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/outlfy
ADMIN_NOTIFICATION_EMAIL=admin@outlfy.com
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Outlfy Website <onboarding@resend.dev>
```

### 4. API Integration

Update the API routes to use real database operations:

```javascript
// In src/app/api/contact/route.ts
import dbConnect from '../../../lib/mongodb';
import FormResponse from '../../../admin/models/FormResponse';

export async function POST(request) {
  await dbConnect();
  
  const data = await request.json();
  const formResponse = new FormResponse(data);
  await formResponse.save();
  
  return NextResponse.json({ success: true });
}
```

### 5. Email Notifications (Optional)

Install the Resend SDK for email notifications:

```bash
npm install resend
```

## 🔐 Access Control

To add authentication to the admin panel:

1. Install NextAuth.js or your preferred auth solution
2. Wrap admin routes with authentication middleware
3. Add role-based access control

Example with NextAuth.js:

```javascript
// In admin layout
import { useSession } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user.role !== 'admin') {
    return <div>Access denied</div>;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}
```

## 📱 Usage

### Accessing the Admin Panel

Navigate to `/admin` to access the dashboard:

- **Dashboard**: `/admin` - Overview and statistics
- **Case Studies**: `/admin/case-studies` - Manage case studies
- **Form Responses**: `/admin/responses` - View and manage submissions

### Creating Case Studies

1. Go to `/admin/case-studies`
2. Click "Add New Case Study"
3. Fill in the basic information (title, client, industry, etc.)
4. Expand each content section and add detailed information
5. Set featured/published status
6. Save the case study

### Managing Form Responses

1. Go to `/admin/responses`
2. View all submissions in the table
3. Click the eye icon to view full details
4. Update status and add notes
5. Reply directly via email integration

## 🎯 Customization

### Styling

Modify `src/admin/styles/_admin.scss` to customize:

- Color scheme
- Layout spacing
- Component styles
- Responsive breakpoints

### Adding New Features

1. Create new components in `src/admin/components/`
2. Add corresponding pages in `src/app/admin/`
3. Update navigation in `AdminLayout.jsx`
4. Add API routes as needed

### Form Fields

To add new form fields:

1. Update the FormResponse model
2. Modify the contact form component
3. Update the admin list/detail views
4. Adjust the API endpoint

## 🔧 Development

### Running in Development

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000/admin`

### Building for Production

```bash
npm run build
npm start
```

## 📊 Analytics and Monitoring

Consider adding:

- Response time tracking
- Form conversion analytics
- User engagement metrics
- Error monitoring

## 🚀 Deployment

The admin panel is built with Next.js and can be deployed to:

- Vercel (recommended)
- Netlify
- AWS
- Any Node.js hosting provider

Make sure to:

1. Set environment variables
2. Configure MongoDB connection
3. Set up email service
4. Configure domain/subdomain for admin access

## 🔒 Security Considerations

- Implement proper authentication
- Use HTTPS in production
- Validate all input data
- Implement rate limiting
- Regular security audits
- Backup strategies

## 📝 License

This admin panel is part of the Outlfy project and follows the same licensing terms.

---

For support or questions, contact the Outlfy development team.

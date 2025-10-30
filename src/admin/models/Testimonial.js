// Testimonial Model for MongoDB
import mongoose from 'mongoose';
const { Schema } = mongoose;

const TestimonialSchema = new Schema(
  {
    // Personal Information
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    
    position: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    
    company: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    
    // Media Assets
    profilePicture: {
      type: String, // Base64 encoded image
      required: true,
      validate: {
        validator: function(v) {
          // Validate base64 image format
          return /^data:image\/(jpeg|jpg|png|webp|gif);base64,/.test(v);
        },
        message: 'Profile picture must be a valid base64 encoded image (jpeg, jpg, png, webp, gif)'
      }
    },
    
    companyLogo: {
      type: String, // Base64 encoded image
      required: true,
      validate: {
        validator: function(v) {
          // Validate base64 image format (including SVG)
          return /^data:image\/(jpeg|jpg|png|webp|gif|svg\+xml);base64,/.test(v);
        },
        message: 'Company logo must be a valid base64 encoded image (jpeg, jpg, png, webp, gif, svg)'
      }
    },
    
    // Testimonial Content (Rich Text - HTML allowed for bold, italic, etc.)
    testimonial: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 2000,
      validate: {
        validator: function(v) {
          // Allow only basic HTML tags for rich text formatting
          const allowedTags = /<\/?(?:b|strong|i|em|u|br|p|span)(?:\s[^>]*)?>|&(?:amp|lt|gt|quot|#39);/gi;
          const stripped = v.replace(allowedTags, '');
          return !/<[^>]*>/g.test(stripped); // No other HTML tags allowed
        },
        message: 'Testimonial contains invalid HTML. Only basic formatting tags (b, strong, i, em, u, br, p, span) are allowed'
      }
    },
    
    // Links
    linkedinUrl: {
      type: String,
      required: false,
      default: '',
      validate: {
        validator: function(v) {
          // If empty or undefined, it's valid (optional field)
          if (!v || v.trim() === '') return true;
          // If provided, validate format: allow both personal profiles (/in/) and company pages (/company/)
          return /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/.test(v);
        },
        message: 'Please provide a valid LinkedIn profile or company URL'
      }
    },
    
    companySiteUrl: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Please provide a valid company website URL'
      }
    },
    
    // Optional YouTube embed video testimonial
    videoUrl: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional field
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid video URL starting with http:// or https://'
      }
    },
    
    // Project/Service context
    projectType: {
      type: String,
      required: false,
      enum: ['web-development', 'mobile-app', 'e-commerce', 'ui-ux-design', 'digital-marketing', 'consulting', 'other'],
      default: 'other'
    },
    
    // Admin fields
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'featured'],
      default: 'pending'
    },
    
    featured: {
      type: Boolean,
      default: false
    },
    
    displayOrder: {
      type: Number,
      default: 0 // For ordering testimonials
    },
    
    // Metadata
    source: {
      type: String,
      enum: ['direct', 'google', 'linkedin', 'referral', 'other'],
      default: 'direct'
    },
    
    adminNotes: String,
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TestimonialSchema.index({ status: 1 });
TestimonialSchema.index({ featured: 1 });
TestimonialSchema.index({ displayOrder: 1 });
TestimonialSchema.index({ createdAt: -1 });
TestimonialSchema.index({ company: 1 });

// Pre-save middleware to update the updatedAt field
TestimonialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

const normalizeVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace('/', '');
      if (videoId) {
        const params = parsed.searchParams.toString();
        return `https://www.youtube.com/embed/${videoId}${params ? `?${params}` : ''}`;
      }
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const videoId = parsed.searchParams.get('v');
        if (videoId) {
          parsed.searchParams.delete('v');
          const remaining = parsed.searchParams.toString();
          return `https://www.youtube.com/embed/${videoId}${remaining ? `?${remaining}` : ''}`;
        }
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return trimmed;
      }
    }

    return trimmed;
  } catch (error) {
    return trimmed;
  }
};

// CRUD Functions

// CREATE - Add new testimonial
export const createTestimonial = async (testimonialData) => {
  try {
    const payload = { ...testimonialData };
    if (payload.videoUrl) {
      payload.videoUrl = normalizeVideoUrl(payload.videoUrl);
    }

    const testimonial = new Testimonial(payload);
    const savedTestimonial = await testimonial.save();
    return {
      success: true,
      data: savedTestimonial,
      message: 'Testimonial created successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to create testimonial'
    };
  }
};

// READ - Get all testimonials with pagination and filtering
export const getTestimonials = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      featured,
      company,
      projectType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build query filter
    const filter = {};
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured;
    if (company) filter.company = new RegExp(company, 'i');
    if (projectType) filter.projectType = projectType;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const testimonials = await Testimonial
      .find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Testimonial.countDocuments(filter);

    return {
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Testimonials retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to retrieve testimonials'
    };
  }
};

// READ - Get single testimonial by ID
export const getTestimonialById = async (id) => {
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return {
        success: false,
        message: 'Testimonial not found'
      };
    }
    
    // Add excerpt to the response
    const plainText = testimonial.testimonial.replace(/<[^>]*>/g, '');
    const excerpt = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
    
    return {
      success: true,
      data: {
        ...testimonial.toObject(),
        excerpt
      },
      message: 'Testimonial retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to retrieve testimonial'
    };
  }
};

// UPDATE - Update testimonial by ID
export const updateTestimonial = async (id, updateData) => {
  try {
    // Separate fields to update and fields to unset
    const updateFields = { ...updateData };
    const unsetFields = {};

    if (typeof updateFields.videoUrl === 'string' && updateFields.videoUrl.trim()) {
      updateFields.videoUrl = normalizeVideoUrl(updateFields.videoUrl);
    }

    // Check for empty optional fields and move them to unset
    if (updateFields.linkedinUrl === '' || updateFields.linkedinUrl === null || updateFields.linkedinUrl === undefined) {
      unsetFields.linkedinUrl = '';
      delete updateFields.linkedinUrl;
    }
    if (updateFields.videoUrl === '' || updateFields.videoUrl === null || updateFields.videoUrl === undefined) {
      unsetFields.videoUrl = '';
      delete updateFields.videoUrl;
    }

    // Build update operation
    const updateOperation = {
      $set: { ...updateFields, updatedAt: Date.now() }
    };

    // Add $unset operation if there are fields to remove
    if (Object.keys(unsetFields).length > 0) {
      updateOperation.$unset = unsetFields;
    }

    // When using $unset, we need to disable validators to avoid validation errors on removed fields
    const options = {
      new: true,
      runValidators: Object.keys(unsetFields).length === 0, // Only run validators if not unsetting fields
      context: 'query'
    };

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateOperation,
      options
    );

    if (!updatedTestimonial) {
      return {
        success: false,
        message: 'Testimonial not found'
      };
    }

    return {
      success: true,
      data: updatedTestimonial,
      message: 'Testimonial updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to update testimonial'
    };
  }
};

// DELETE - Delete testimonial by ID
export const deleteTestimonial = async (id) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    
    if (!deletedTestimonial) {
      return {
        success: false,
        message: 'Testimonial not found'
      };
    }

    return {
      success: true,
      data: deletedTestimonial,
      message: 'Testimonial deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete testimonial'
    };
  }
};

// FEATURED - Get featured testimonials
export const getFeaturedTestimonials = async () => {
  try {
    const testimonials = await Testimonial
      .find({ status: 'approved', featured: true })
      .sort({ displayOrder: 1, createdAt: -1 });

    return {
      success: true,
      data: testimonials,
      message: 'Featured testimonials retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to retrieve featured testimonials'
    };
  }
};

// APPROVE - Update testimonial status
export const updateTestimonialStatus = async (id, status) => {
  try {
    const validStatuses = ['pending', 'approved', 'rejected', 'featured'];
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      };
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return {
        success: false,
        message: 'Testimonial not found'
      };
    }

    return {
      success: true,
      data: updatedTestimonial,
      message: `Testimonial status updated to ${status} successfully`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to update testimonial status'
    };
  }
};

// TOGGLE FEATURED - Toggle featured status
export const toggleFeatured = async (id) => {
  try {
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return {
        success: false,
        message: 'Testimonial not found'
      };
    }

    testimonial.featured = !testimonial.featured;
    testimonial.updatedAt = Date.now();
    await testimonial.save();

    return {
      success: true,
      data: testimonial,
      message: `Testimonial ${testimonial.featured ? 'featured' : 'unfeatured'} successfully`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to toggle featured status'
    };
  }
};

// BULK DELETE - Delete multiple testimonials
export const bulkDeleteTestimonials = async (ids) => {
  try {
    const result = await Testimonial.deleteMany({ _id: { $in: ids } });
    
    return {
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `${result.deletedCount} testimonials deleted successfully`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete testimonials'
    };
  }
};

// STATS - Get testimonial statistics
export const getTestimonialStats = async () => {
  try {
    const stats = await Testimonial.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Testimonial.countDocuments();
    const featured = await Testimonial.countDocuments({ featured: true });

    return {
      success: true,
      data: {
        total,
        featured,
        byStatus: stats
      },
      message: 'Statistics retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to retrieve statistics'
    };
  }
};

export default Testimonial;
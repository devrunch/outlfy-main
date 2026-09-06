"use client";
import React, { useState } from 'react';
import TipTapEditor from './TipTapEditor';
import VoiceRecorder from './VoiceRecorder';

const TestimonialForm = ({ testimonial = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    position: testimonial?.position || '',
    company: testimonial?.company || '',
    testimonial: testimonial?.testimonial || '',
    profilePicture: testimonial?.profilePicture || '',
    companyLogo: testimonial?.companyLogo || '',
    linkedinUrl: testimonial?.linkedinUrl || '',
    companySiteUrl: testimonial?.companySiteUrl || '',
    videoUrl: testimonial?.videoUrl || '',
    audioUrl: testimonial?.audioUrl || '',
    projectType: testimonial?.projectType || 'other',
    status: testimonial?.status || 'pending',
    featured: testimonial?.featured || false,
    displayOrder: testimonial?.displayOrder || 0,
    adminNotes: testimonial?.adminNotes || '',
    source: testimonial?.source || 'direct'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profilePreview, setProfilePreview] = useState(testimonial?.profilePicture || '');
  const [logoPreview, setLogoPreview] = useState(testimonial?.companyLogo || '');

  const projectTypes = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-app', label: 'Mobile App' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'featured', label: 'Featured' }
  ];

  const sourceOptions = [
    { value: 'direct', label: 'Direct' },
    { value: 'google', label: 'Google' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'referral', label: 'Referral' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Uploads land here at full camera/screenshot resolution (up to 5MB), but
  // every testimonial is stored (and re-shipped on every public page load)
  // as a base64 blob. Downscaling to the size the card actually displays
  // keeps that payload in the tens-of-KB range instead of megabytes.
  const compressImage = (file, { maxDimension, mimeType, quality = 0.82 }) => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };
      img.src = objectUrl;
    });
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (type === 'logo') allowedTypes.push('image/svg+xml');

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [type]: `Invalid file type. Please select a valid image file.`
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [type]: 'File size too large. Please select an image under 5MB.'
      }));
      return;
    }

    const applyImage = (base64) => {
      if (type === 'profile') {
        setFormData(prev => ({ ...prev, profilePicture: base64 }));
        setProfilePreview(base64);
      } else {
        setFormData(prev => ({ ...prev, companyLogo: base64 }));
        setLogoPreview(base64);
      }
      setErrors(prev => ({ ...prev, [type]: '' }));
    };

    const readAsIs = () => {
      const reader = new FileReader();
      reader.onload = (event) => applyImage(event.target.result);
      reader.readAsDataURL(file);
    };

    // SVG logos are already small vector files, and GIFs may be animated —
    // recompressing either through a canvas would rasterize/strip them, so
    // store those as-is. Everything else gets downscaled + recompressed.
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      readAsIs();
      return;
    }

    try {
      const base64 = await compressImage(file, {
        maxDimension: type === 'profile' ? 480 : 400,
        mimeType: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        quality: 0.82,
      });
      applyImage(base64);
    } catch (error) {
      readAsIs();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.testimonial.trim()) newErrors.testimonial = 'Testimonial is required';
    if (!formData.profilePicture) newErrors.profile = 'Profile picture is required';
    if (!formData.companyLogo) newErrors.logo = 'Company logo is required';
    if (!formData.companySiteUrl.trim()) newErrors.companySiteUrl = 'Company website is required';

    // URL validations (only validate if field has a value)
    if (formData.linkedinUrl && formData.linkedinUrl.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/.test(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn profile or company URL';
    }
    if (formData.companySiteUrl && formData.companySiteUrl.trim() && !/^https?:\/\/.+\..+/.test(formData.companySiteUrl)) {
      newErrors.companySiteUrl = 'Please enter a valid website URL';
    }
    if (formData.videoUrl && formData.videoUrl.trim() && !/^https?:\/\/.+/.test(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid video URL starting with http:// or https://';
    }

    // Length validations
    if (formData.testimonial.length < 50) {
      newErrors.testimonial = 'Testimonial must be at least 50 characters long';
    }
    if (formData.testimonial.length > 2000) {
      newErrors.testimonial = 'Testimonial must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="testimonial-form">
      <div className="form-header mb-4">
        <h2>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Personal Information */}
        <div className="col-12">
          <h4>Personal Information</h4>
          <hr />
        </div>

        <div className="col-md-4">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            maxLength="100"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Position *</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className={`form-control ${errors.position ? 'is-invalid' : ''}`}
            maxLength="100"
          />
          {errors.position && <div className="invalid-feedback">{errors.position}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Company *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={`form-control ${errors.company ? 'is-invalid' : ''}`}
            maxLength="100"
          />
          {errors.company && <div className="invalid-feedback">{errors.company}</div>}
        </div>

        {/* Media Assets */}
        <div className="col-12 mt-4">
          <h4>Media Assets</h4>
          <hr />
        </div>

        <div className="col-md-6">
          <label className="form-label">Profile Picture *</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={(e) => handleImageUpload(e, 'profile')}
            className={`form-control ${errors.profile ? 'is-invalid' : ''}`}
          />
          {errors.profile && <div className="invalid-feedback">{errors.profile}</div>}
          <div className="form-text">
            Recommended: a square photo, at least 300×300px. It renders as a circle on the
            site, so off-center or non-square photos may get cropped.
          </div>
          {profilePreview && (
            <div className="mt-2">
              <img
                src={profilePreview}
                alt="Profile preview"
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ddd' }}
              />
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Company Logo *</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={(e) => handleImageUpload(e, 'logo')}
            className={`form-control ${errors.logo ? 'is-invalid' : ''}`}
          />
          {errors.logo && <div className="invalid-feedback">{errors.logo}</div>}
          <div className="form-text">
            Recommended: a landscape logo (roughly 2:1, e.g. 300×150px) on a transparent
            background. It displays inside a fixed {"92×44px"} box, so it will be scaled to
            fit without cropping regardless of the source size.
          </div>
          {logoPreview && (
            <div className="mt-2">
              <div
                style={{
                  width: '92px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              >
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Testimonial Content */}
        <div className="col-12 mt-4">
          <h4>Testimonial Content</h4>
          <hr />
        </div>

        <div className="col-12">
          <label className="form-label">Testimonial *</label>
          <TipTapEditor
            content={formData.testimonial}
            onChange={(content) => setFormData(prev => ({ ...prev, testimonial: content }))}
            placeholder="Write the testimonial content here... (minimum 50 characters)"
          />
          {errors.testimonial && <div className="text-danger mt-1">{errors.testimonial}</div>}
          <div className="form-text">
            {formData.testimonial.replace(/<[^>]*>/g, '').length}/2000 characters
          </div>
        </div>

        {/* Links */}
        <div className="col-12 mt-4">
          <h4>Links</h4>
          <hr />
        </div>

        <div className="col-md-6">
          <label className="form-label">LinkedIn URL (Optional)</label>
          <input
            type="url"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleInputChange}
            className={`form-control ${errors.linkedinUrl ? 'is-invalid' : ''}`}
            placeholder="https://linkedin.com/in/username or https://linkedin.com/company/companyname"
          />
          {errors.linkedinUrl && <div className="invalid-feedback">{errors.linkedinUrl}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Company Website *</label>
          <input
            type="url"
            name="companySiteUrl"
            value={formData.companySiteUrl}
            onChange={handleInputChange}
            className={`form-control ${errors.companySiteUrl ? 'is-invalid' : ''}`}
            placeholder="https://company.com"
          />
          {errors.companySiteUrl && <div className="invalid-feedback">{errors.companySiteUrl}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Video URL (Optional)</label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            className={`form-control ${errors.videoUrl ? 'is-invalid' : ''}`}
            placeholder="https://youtu.be/VIDEO_ID or https://vimeo.com/..."
          />
          {errors.videoUrl && <div className="invalid-feedback">{errors.videoUrl}</div>}
          <div className="form-text">Provide any valid video link starting with http:// or https://</div>
        </div>

        <div className="col-12">
          <label className="form-label">Voice Recording (Optional)</label>
          <VoiceRecorder
            value={formData.audioUrl}
            onChange={(audioUrl) => setFormData((prev) => ({ ...prev, audioUrl }))}
          />
          <div className="form-text">
            Record a short voice testimonial directly, or upload an existing audio file. It
            plays as an audio clip on the testimonial card.
          </div>
        </div>

        {/* Settings */}
        <div className="col-12 mt-4">
          <h4>Settings</h4>
          <hr />
        </div>

        <div className="col-md-4">
          <label className="form-label">Project Type</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            className="form-control"
          >
            {projectTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="form-control"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Source</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className="form-control"
          >
            {sourceOptions.map(source => (
              <option key={source.value} value={source.value}>{source.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Display Order</label>
          <input
            type="number"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleInputChange}
            className="form-control"
            min="0"
          />
          <div className="form-text">Lower numbers appear first</div>
        </div>

        <div className="col-md-6 d-flex align-items-end">
          <div className="form-check">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="form-check-input"
              id="featured"
            />
            <label className="form-check-label" htmlFor="featured">
              Featured Testimonial
            </label>
          </div>
        </div>

        <div className="col-12">
          <label className="form-label">Admin Notes</label>
          <textarea
            name="adminNotes"
            value={formData.adminNotes}
            onChange={handleInputChange}
            className="form-control"
            rows="3"
            placeholder="Internal notes about this testimonial..."
          ></textarea>
        </div>

        {/* Actions */}
        <div className="col-12 mt-4">
          <hr />
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {testimonial ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                testimonial ? 'Update Testimonial' : 'Create Testimonial'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
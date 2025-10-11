"use client";
import React from 'react';

const TestimonialView = ({ testimonial, onEdit, onClose, onDelete }) => {
  if (!testimonial) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle me-2"></i>
        No testimonial data available.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-warning', text: 'Pending' },
      approved: { class: 'bg-success', text: 'Approved' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      featured: { class: 'bg-primary', text: 'Featured' }
    };
    return badges[status] || { class: 'bg-secondary', text: status };
  };

  const getProjectTypeLabel = (projectType) => {
    const labels = {
      'web-development': 'Web Development',
      'mobile-app': 'Mobile App',
      'e-commerce': 'E-commerce',
      'ui-ux-design': 'UI/UX Design',
      'digital-marketing': 'Digital Marketing',
      'consulting': 'Consulting',
      'other': 'Other'
    };
    return labels[projectType] || projectType;
  };

  const getSourceLabel = (source) => {
    const labels = {
      'direct': 'Direct',
      'google': 'Google',
      'linkedin': 'LinkedIn',
      'referral': 'Referral',
      'other': 'Other'
    };
    return labels[source] || source;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      onDelete(testimonial._id);
    }
  };

  const statusBadge = getStatusBadge(testimonial.status);

  return (
    <div className="testimonial-view">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="mb-2">Testimonial Details</h2>
          <div className="d-flex gap-2 align-items-center">
            <span className={`badge ${statusBadge.class}`}>
              {statusBadge.text}
            </span>
            {testimonial.featured && (
              <span className="badge bg-warning">
                <i className="fas fa-star me-1"></i>
                Featured
              </span>
            )}
            <span className="badge bg-secondary">
              {getProjectTypeLabel(testimonial.projectType)}
            </span>
          </div>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => onEdit(testimonial)}>
            <i className="fas fa-edit me-2"></i>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <i className="fas fa-trash me-2"></i>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            <i className="fas fa-times me-2"></i>
            Close
          </button>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Main Info */}
        <div className="col-md-8">
          {/* Personal Information */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <p>{testimonial.name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Position</label>
                    <p>{testimonial.position}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Company</label>
                    <p>{testimonial.company}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  {testimonial.profilePicture && (
                    <div className="text-center">
                      <label className="form-label fw-bold d-block">Profile Picture</label>
                      <img
                        src={testimonial.profilePicture}
                        alt={testimonial.name}
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        className="rounded-circle border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-quote-left me-2"></i>
                Testimonial Content
              </h5>
            </div>
            <div className="card-body">
              <div 
                className="testimonial-content"
                dangerouslySetInnerHTML={{ __html: testimonial.testimonial }}
                style={{ lineHeight: '1.6', fontSize: '1.1rem' }}
              />
            </div>
          </div>

          {/* Links */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-link me-2"></i>
                Links & Social
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {testimonial.linkedinUrl && (
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">LinkedIn Profile</label>
                      <p>
                        <a 
                          href={testimonial.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fab fa-linkedin me-1"></i>
                          View Profile
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                <div className={testimonial.linkedinUrl ? "col-md-6" : "col-md-12"}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Company Website</label>
                    <p>
                      {testimonial.companySiteUrl ? (
                        <a 
                          href={testimonial.companySiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="fas fa-external-link-alt me-1"></i>
                          Visit Site
                        </a>
                      ) : (
                        <span className="text-muted">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {testimonial.videoUrl && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Video Testimonial</label>
                  <div className="ratio ratio-16x9" style={{ maxWidth: '560px' }}>
                    <iframe
                      src={testimonial.videoUrl}
                      title="Video Testimonial"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              
              {!testimonial.linkedinUrl && !testimonial.videoUrl && testimonial.companySiteUrl && (
                <div className="alert alert-info mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Only company website is available for this testimonial.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Metadata & Company Logo */}
        <div className="col-md-4">
          {/* Company Logo */}
          {testimonial.companyLogo && (
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Company Logo</h6>
              </div>
              <div className="card-body text-center">
                <img
                  src={testimonial.companyLogo}
                  alt={`${testimonial.company} logo`}
                  style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                  className="border rounded"
                />
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Details
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Status</label>
                <p>
                  <span className={`badge ${statusBadge.class}`}>
                    {statusBadge.text}
                  </span>
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Featured</label>
                <p>
                  {testimonial.featured ? (
                    <span className="badge bg-warning">
                      <i className="fas fa-star me-1"></i>
                      Yes
                    </span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Project Type</label>
                <p>{getProjectTypeLabel(testimonial.projectType)}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Source</label>
                <p>{getSourceLabel(testimonial.source)}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Display Order</label>
                <p>{testimonial.displayOrder}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Timestamps
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Created</label>
                <p className="text-muted">{formatDate(testimonial.createdAt)}</p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Last Updated</label>
                <p className="text-muted">{formatDate(testimonial.updatedAt)}</p>
              </div>
              <div className="mb-0">
                <label className="form-label fw-bold">ID</label>
                <p className="text-muted small font-monospace">{testimonial._id}</p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {testimonial.adminNotes && (
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="fas fa-sticky-note me-2"></i>
                  Admin Notes
                </h6>
              </div>
              <div className="card-body">
                <p className="text-muted">{testimonial.adminNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialView;
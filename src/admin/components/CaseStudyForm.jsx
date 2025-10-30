"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Accordion, Row, Col, Alert, Tab, Tabs, Badge } from "react-bootstrap";
import { authUtils } from "@/lib/authUtils";
import TipTapEditor from "./TipTapEditor";
import { 
  validateField, 
  validateCaseStudy, 
  getNestedValue, 
  setNestedValue 
} from "@/lib/validation/caseStudyValidation";

// Add required field styling
const styles = `
  .required::after {
    content: "";
  }
  .form-control.is-invalid {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  }
  .form-control.is-valid {
    border-color: #198754;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
  }
  .invalid-feedback {
    display: block;
    font-size: 0.875em;
    color: #dc3545;
    margin-top: 0.25rem;
  }
  .validation-summary {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 0.375rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .validation-summary h6 {
    color: #721c24;
    margin-bottom: 0.5rem;
  }
  .validation-summary ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  .validation-summary li {
    color: #721c24;
    margin-bottom: 0.25rem;
  }
`;

const sectionFields = [
  { key: "theProblem", label: "The Problem", icon: "fas fa-exclamation-triangle" },
  { key: "whatWeBuilt", label: "What We Built", icon: "fas fa-tools" },
  { key: "howWeDidIt", label: "How We Did It", icon: "fas fa-cogs" },
  { key: "theResults", label: "The Results", icon: "fas fa-chart-bar" },
  { key: "whatHappenedNext", label: "What Happened Next", icon: "fas fa-arrow-right" },
  { key: "whatThisMeansForYou", label: "What This Means For You", icon: "fas fa-lightbulb" },
];

const projectTypes = [
  'Web Development', 'Mobile App', 'E-commerce', 'Custom Software', 
  'AI/ML Solution', 'API Integration', 'UI/UX Design', 'Other'
];

const budgetRanges = [
  '$5K-$10K', '$10K-$25K', '$25K-$50K', '$50K-$100K', '$100K+', 'Custom'
];

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'secondary' },
  { value: 'review', label: 'Under Review', color: 'warning' },
  { value: 'published', label: 'Published', color: 'success' },
  { value: 'archived', label: 'Archived', color: 'dark' },
];

const technologyCategories = [
  'frontend', 'backend', 'database', 'devops', 'design', 'other'
];

// Validation-aware input component
const ValidatedFormControl = ({ 
  name, 
  label, 
  required = false, 
  error, 
  touched, 
  onBlur, 
  helpText,
  children,
  ...props 
}) => {
  const hasError = touched && error;
  
  return (
    <Form.Group className="mb-3">
      <Form.Label className={required ? "required" : ""}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      {children || (
        <Form.Control
          name={name}
          onBlur={onBlur}
          isInvalid={hasError}
          isValid={touched && !error}
          {...props}
        />
      )}
      {helpText && !hasError && (
        <Form.Text className="text-muted">{helpText}</Form.Text>
      )}
      {hasError && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

const CaseStudyForm = ({ selected, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    excerpt: "",
    clientName: "",
    clientLogo: "",
    clientWebsite: "",
    projectType: "",
    industry: "",
    timeline: { start: "", end: "", duration: "" },
    budget: { range: "", currency: "USD" },
    teamSize: "",
    outcome: "",
    status: "draft",
    featured: false,
    published: false,
    tags: [],
    categories: [],
    
    // Media
    featuredImage: { type: "image", url: "", alt: "" },
    
    // Technologies
    technologies: [],
    
    // Metrics
    metrics: [],
    
    // Links
    links: { live: "", demo: "", github: "", case_study: "" },
    
    // SEO
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
    },
    
    // Author
    author: { name: "", email: "", avatar: "" },
    
    // Content sections
    theProblem: { heading: "", content: "", excerpt: "", order: 1 },
    whatWeBuilt: { heading: "", content: "", excerpt: "", order: 2 },
    howWeDidIt: { heading: "", content: "", excerpt: "", order: 3 },
    theResults: { heading: "", content: "", excerpt: "", order: 4 },
    whatHappenedNext: { heading: "", content: "", excerpt: "", order: 5 },
    whatThisMeansForYou: { heading: "", content: "", excerpt: "", order: 6 },
    
    // Custom sections
    customSections: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("basic");
  const [newTag, setNewTag] = useState("");
  const [newTechnology, setNewTechnology] = useState({ name: "", category: "frontend", icon: "", url: "" });
  const [newMetric, setNewMetric] = useState({ label: "", value: "", description: "" });
  const [imageUploading, setImageUploading] = useState(false);
  const [clientLogoUploading, setClientLogoUploading] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Validate entire form using shared utility
  const validateForm = (formData = form) => {
    const { isValid, errors: validationErrors } = validateCaseStudy(formData);
    setErrors(validationErrors);
    return isValid;
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const value = getNestedValue(form, name);
    const error = validateField(name, value);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        setNestedValue(newErrors, name, error);
      } else {
        // Remove error if field is now valid
        const keys = name.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => current?.[key], newErrors);
        if (target && target[lastKey]) {
          delete target[lastKey];
        }
      }
      return newErrors;
    });
  };

  useEffect(() => {
    if (selected) {
      setForm({
        ...selected,
        timeline: {
          start: selected.timeline?.start ? new Date(selected.timeline.start).toISOString().split('T')[0] : "",
          end: selected.timeline?.end ? new Date(selected.timeline.end).toISOString().split('T')[0] : "",
          duration: selected.timeline?.duration || ""
        },
        tags: selected.tags || [],
        categories: selected.categories || [],
        technologies: selected.technologies || [],
        metrics: selected.metrics || [],
        seo: selected.seo || {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
        }
      });
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const keys = name.split(".");
      setForm((prev) => {
        const updated = { ...prev };
        let current = updated;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return updated;
      });
    } else {
      setForm((prev) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }

    // Auto-generate slug from title
    if (name === 'title') {
      const slugValue = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setForm((prev) => ({ ...prev, slug: slugValue }));
      
      // Validate slug as well
      const slugError = validateField('slug', slugValue);
      setErrors(prev => ({
        ...prev,
        slug: slugError
      }));
    }

    // Real-time validation for touched fields
    if (touched[name]) {
      const fieldValue = type === 'checkbox' ? checked : value;
      const error = validateField(name, fieldValue);
      
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          setNestedValue(newErrors, name, error);
        } else {
          // Remove error if field is now valid
          const keys = name.split('.');
          const lastKey = keys.pop();
          const target = keys.reduce((current, key) => current?.[key], newErrors);
          if (target && target[lastKey]) {
            delete target[lastKey];
          }
        }
        return newErrors;
      });
    }
  };

  const handleContentChange = (sectionKey, content) => {
    setForm((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        content: content
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: "danger", text: "Please select a valid image file." });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "danger", text: "Image size should be less than 5MB." });
      return;
    }

    setImageUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setForm(prev => ({
          ...prev,
          featuredImage: {
            ...prev.featuredImage,
            url: base64String,
            type: "base64"
          }
        }));
        setMessage({ type: "success", text: "Image uploaded successfully!" });
        setImageUploading(false);
      };
      reader.onerror = () => {
        setMessage({ type: "danger", text: "Error reading the image file." });
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: "danger", text: "Error uploading image." });
      setImageUploading(false);
    }
  };

  const handleClientLogoUpload = (e) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: "danger", text: "Please select a valid image file for the client logo." });
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "danger", text: "Client logo size should be less than 5MB." });
      input.value = "";
      return;
    }

    setClientLogoUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = typeof reader.result === 'string' ? reader.result : '';
        if (!base64String) {
          setMessage({ type: "danger", text: "Error processing client logo." });
          setClientLogoUploading(false);
          return;
        }

        setForm((prev) => ({
          ...prev,
          clientLogo: base64String,
        }));

        setTouched((prev) => ({ ...prev, clientLogo: true }));

        const error = validateField('clientLogo', base64String);
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors.clientLogo = error;
          } else {
            delete newErrors.clientLogo;
          }
          return newErrors;
        });

        setMessage({ type: "success", text: "Client logo uploaded successfully!" });
        input.value = "";
        setClientLogoUploading(false);
      };

      reader.onerror = () => {
        setMessage({ type: "danger", text: "Error reading the client logo file." });
        input.value = "";
        setClientLogoUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading client logo:', error);
      setMessage({ type: "danger", text: "Error uploading client logo." });
      input.value = "";
      setClientLogoUploading(false);
    }
  };

  const removeClientLogo = () => {
    setForm((prev) => ({
      ...prev,
      clientLogo: "",
    }));
    setTouched((prev) => ({ ...prev, clientLogo: true }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.clientLogo;
      return newErrors;
    });
    setMessage({ type: "success", text: "Client logo removed successfully!" });
  };

  const removeImage = () => {
    setForm(prev => ({
      ...prev,
      featuredImage: {
        ...prev.featuredImage,
        url: "",
        type: "image"
      }
    }));
    setMessage({ type: "success", text: "Image removed successfully!" });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  useEffect(() => {
    if (form.title && !selected) {
      setForm(prev => ({ ...prev, slug: generateSlug(form.title) }));
    }
  }, [form.title, selected]);

  // Auto-generate meta title and description
  useEffect(() => {
    if (form.title && !form.seo?.metaTitle) {
      setForm(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaTitle: form.title.length > 60 ? form.title.substring(0, 57) + '...' : form.title
        }
      }));
    }
    
    if (form.summary && !form.seo?.metaDescription) {
      setForm(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaDescription: form.summary.length > 160 ? form.summary.substring(0, 157) + '...' : form.summary
        }
      }));
    }
  }, [form.title, form.summary, form.seo?.metaTitle, form.seo?.metaDescription]);

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTechnology = () => {
    if (newTechnology.name.trim()) {
      setForm(prev => ({
        ...prev,
        technologies: [...prev.technologies, { ...newTechnology }]
      }));
      setNewTechnology({ name: "", category: "frontend", icon: "", url: "" });
    }
  };

  const removeTechnology = (index) => {
    setForm(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addMetric = () => {
    if (newMetric.label.trim() && newMetric.value.trim()) {
      setForm(prev => ({
        ...prev,
        metrics: [...prev.metrics, { ...newMetric }]
      }));
      setNewMetric({ label: "", value: "", description: "" });
    }
  };

  const removeMetric = (index) => {
    setForm(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    setIsValidating(true);

    // Validate entire form before submission
    const isValid = validateForm();
    
    if (!isValid) {
      setLoading(false);
      setIsValidating(false);
      setMessage({ 
        type: "danger", 
        text: "Please fix the validation errors before submitting." 
      });
      
      // Find first tab with errors and switch to it
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const firstError = errorFields[0];
        if (['title', 'slug', 'summary', 'excerpt', 'clientName', 'projectType'].includes(firstError)) {
          setActiveTab('basic');
        } else if (firstError.startsWith('timeline') || firstError.includes('budget')) {
          setActiveTab('project');
        } else if (firstError.includes('seo')) {
          setActiveTab('seo');
        } else if (['theProblem', 'whatWeBuilt', 'howWeDidIt', 'theResults'].some(s => firstError.includes(s))) {
          setActiveTab('content');
        }
      }
      
      return;
    }

    try {
      const url = selected 
        ? `/api/admin/case-studies/${selected._id}` 
        : '/api/admin/case-studies';
      
      const method = selected ? 'PUT' : 'POST';
      
      const response = await authUtils.authenticatedFetch(url, {
        method: method,
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: "success", text: `Case study ${selected ? 'updated' : 'created'} successfully!` });
        
        // Clear errors on successful save
        setErrors({});
        setTouched({});
        
        if (onSave) {
          setTimeout(() => onSave(result), 1500); // Delay to show success message
        }
      } else {
        const errorData = await response.json();
        
        // Handle validation errors from server
        if (errorData.validationErrors) {
          setErrors(errorData.validationErrors);
          setMessage({ type: "danger", text: "Please fix the validation errors and try again." });
        } else {
          throw new Error(errorData.error || 'Failed to save case study');
        }
      }
    } catch (error) {
      console.error('Error saving case study:', error);
      setMessage({ type: "danger", text: error.message || "Error saving case study. Please try again." });
    } finally {
      setLoading(false);
      setIsValidating(false);
    }
  };

  return (
    <div className="admin-form">
      <style>{styles}</style>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <i className="fas fa-briefcase me-2"></i>
          {selected ? "Edit Case Study" : "Add New Case Study"}
        </h4>
        <div className="d-flex gap-2">
          {form.status && (
            <Badge bg={statusOptions.find(s => s.value === form.status)?.color || 'secondary'}>
              {statusOptions.find(s => s.value === form.status)?.label || form.status}
            </Badge>
          )}
          {selected && (
            <Button variant="outline-secondary" size="sm" onClick={onCancel}>
              <i className="fas fa-times me-1"></i> Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            form="case-study-form"
            variant="primary" 
            disabled={loading || isValidating}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {selected ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className="fas fa-save me-1"></i>
                {selected ? 'Update' : 'Create'} Case Study
              </>
            )}
          </Button>
        </div>
      </div>

      {message.text && (
        <Alert variant={message.type} className="mb-3">
          {message.text}
        </Alert>
      )}

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="validation-summary">
          <h6><i className="fas fa-exclamation-triangle me-2"></i>Please fix the following errors:</h6>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <strong>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Form id="case-study-form" onSubmit={handleSubmit}>
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
          {/* Basic Information Tab */}
          <Tab eventKey="basic" title={<><i className="fas fa-info-circle me-1"></i> Basic Info</>}>
            <Row className="mb-3">
              <Col md={8}>
                <ValidatedFormControl
                  name="title"
                  label="Title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.title}
                  touched={touched.title}
                  placeholder="Enter case study title"
                />
              </Col>
              <Col md={4}>
                <ValidatedFormControl
                  name="slug"
                  label="Slug"
                  required
                  value={form.slug}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.slug}
                  touched={touched.slug}
                  placeholder="url-friendly-name"
                  helpText="Auto-generated from title. Use lowercase letters, numbers, and hyphens only."
                />
              </Col>
            </Row>

            <ValidatedFormControl
              name="summary"
              label="Summary"
              as="textarea"
              rows={3}
              value={form.summary}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.summary}
              touched={touched.summary}
              placeholder="Brief summary of the case study"
              helpText={`${(form.summary || '').length}/1000 characters`}
            />

            <ValidatedFormControl
              name="excerpt"
              label="Excerpt"
              as="textarea"
              rows={2}
              value={form.excerpt}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.excerpt}
              touched={touched.excerpt}
              placeholder="Short excerpt for previews (auto-generated from summary if empty)"
              helpText={`${(form.excerpt || '').length}/300 characters`}
            />

            {/* Featured Image */}
            <Form.Group className="mb-4">
              <Form.Label className="d-flex align-items-center">
                <i className="fas fa-image me-2"></i>
                Featured Image
              </Form.Label>
              
              {form.featuredImage?.url ? (
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="mb-0">Current Image:</h6>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={removeImage}
                    >
                      <i className="fas fa-trash me-1"></i>
                      Remove
                    </Button>
                  </div>
                  <div className="text-center">
                    <img 
                      src={form.featuredImage?.url} 
                      alt={form.featuredImage?.alt || "Featured image"} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      Image type: {form.featuredImage?.type === 'base64' ? 'Uploaded (Base64)' : 'URL'}
                    </small>
                  </div>
                </div>
              ) : null}

              <Row>
                <Col md={8}>
                  <div className="mb-3">
                    <label className="form-label">Upload New Image</label>
                    <div className="input-group">
                      <input 
                        type="file" 
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                      />
                      <span className="input-group-text">
                        {imageUploading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-upload"></i>
                        )}
                      </span>
                    </div>
                    <div className="form-text">
                      <i className="fas fa-info-circle me-1"></i>
                      Supported formats: JPG, PNG, GIF, WEBP. Max size: 5MB
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="text-muted mb-2">OR</div>
                    <Button 
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        const url = prompt("Enter image URL:");
                        if (url) {
                          setForm(prev => ({
                            ...prev,
                            featuredImage: {
                              ...prev.featuredImage,
                              url: url,
                              type: "image"
                            }
                          }));
                        }
                      }}
                    >
                      <i className="fas fa-link me-1"></i>
                      Use URL
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Alt Text</Form.Label>
                    <Form.Control 
                      name="featuredImage.alt" 
                      value={form.featuredImage?.alt || ''} 
                      onChange={handleChange} 
                      placeholder="Describe the image for accessibility and SEO"
                    />
                    <div className="form-text">
                      <i className="fas fa-universal-access me-1"></i>
                      Good alt text improves accessibility and SEO
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>

            {/* Status and Visibility */}
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={handleChange}>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-3 mt-4">
                    <Form.Check
                      type="checkbox"
                      name="featured"
                      label="Featured"
                      checked={form.featured}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="published"
                      label="Published"
                      checked={form.published}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div className="d-flex gap-2 mb-2 flex-wrap">
                {form.tags.map((tag, index) => (
                  <Badge key={index} bg="primary" className="d-flex align-items-center gap-1">
                    {tag}
                    <i 
                      className="fas fa-times cursor-pointer" 
                      onClick={() => removeTag(tag)}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </Badge>
                ))}
              </div>
              <div className="d-flex gap-2">
                <Form.Control
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button variant="outline-primary" size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>
            </Form.Group>
          </Tab>

          {/* Project Details Tab */}
          <Tab eventKey="project" title={<><i className="fas fa-project-diagram me-1"></i> Project Details</>}>
            {/* Client Information */}
            <Row className="mb-3">
              <Col md={6}>
                <ValidatedFormControl
                  name="clientName"
                  label="Client Name"
                  required
                  value={form.clientName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.clientName}
                  touched={touched.clientName}
                  placeholder="Client company name"
                />
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Client Logo</Form.Label>

                  {form.clientLogo && (
                    <div className="border rounded p-2 mb-2 text-center">
                      <img
                        src={form.clientLogo}
                        alt="Client logo preview"
                        style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }}
                      />
                      <div className="mt-2">
                        <Button variant="outline-danger" size="sm" onClick={removeClientLogo}>
                          <i className="fas fa-trash me-1"></i>
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="input-group mb-2">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleClientLogoUpload}
                      disabled={clientLogoUploading}
                    />
                    <span className="input-group-text">
                      {clientLogoUploading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-upload"></i>
                      )}
                    </span>
                  </div>
                  <Form.Text className="text-muted d-block mb-2">
                    Upload an image to store the logo as a Base64 string, or paste a URL/Base64 value below.
                  </Form.Text>

                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="clientLogo"
                    value={form.clientLogo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.clientLogo && !!errors.clientLogo}
                    isValid={touched.clientLogo && !errors.clientLogo && !!form.clientLogo}
                    placeholder="Logo URL or Base64 string"
                  />
                  {touched.clientLogo && errors.clientLogo && (
                    <Form.Control.Feedback type="invalid">
                      {errors.clientLogo}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <ValidatedFormControl
                  name="clientWebsite"
                  label="Client Website"
                  value={form.clientWebsite}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.clientWebsite}
                  touched={touched.clientWebsite}
                  placeholder="https://client.com"
                  helpText="Must be a valid URL"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <ValidatedFormControl
                  name="projectType"
                  label="Project Type"
                  required
                  error={errors.projectType}
                  touched={touched.projectType}
                  onBlur={handleBlur}
                >
                  <Form.Select 
                    name="projectType" 
                    value={form.projectType} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.projectType && errors.projectType}
                    isValid={touched.projectType && !errors.projectType}
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </ValidatedFormControl>
              </Col>
              <Col md={4}>
                <ValidatedFormControl
                  name="industry"
                  label="Industry"
                  value={form.industry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.industry}
                  touched={touched.industry}
                  placeholder="e.g., Healthcare, Fintech"
                />
              </Col>
              <Col md={4}>
                <ValidatedFormControl
                  name="teamSize"
                  label="Team Size"
                  type="number"
                  value={form.teamSize}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.teamSize}
                  touched={touched.teamSize}
                  placeholder="Number of team members"
                  helpText="Enter a number between 1 and 100"
                />
              </Col>
            </Row>

            {/* Timeline */}
            <Row className="mb-3">
              <Col md={4}>
                <ValidatedFormControl
                  name="timeline.start"
                  label="Start Date"
                  type="date"
                  value={form.timeline?.start || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors['timeline.start']}
                  touched={touched['timeline.start']}
                />
              </Col>
              <Col md={4}>
                <ValidatedFormControl
                  name="timeline.end"
                  label="End Date"
                  type="date"
                  value={form.timeline?.end || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors['timeline.end']}
                  touched={touched['timeline.end']}
                />
              </Col>
              <Col md={4}>
                <ValidatedFormControl
                  name="timeline.duration"
                  label="Duration"
                  value={form.timeline?.duration || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors['timeline.duration']}
                  touched={touched['timeline.duration']}
                  placeholder="e.g., 8 weeks, 3 months"
                  helpText="Auto-calculated from dates or enter manually"
                />
              </Col>
            </Row>

            {/* Budget */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Budget Range</Form.Label>
                  <Form.Select name="budget.range" value={form.budget?.range || ''} onChange={handleChange}>
                    <option value="">Select budget range</option>
                    {budgetRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select name="budget.currency" value={form.budget?.currency || 'USD'} onChange={handleChange}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Project Links */}
            <h6 className="mb-3">Project Links</h6>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Live Website</Form.Label>
                  <Form.Control 
                    name="links.live" 
                    value={form.links?.live || ''} 
                    onChange={handleChange} 
                    placeholder="https://live-site.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Demo URL</Form.Label>
                  <Form.Control 
                    name="links.demo" 
                    value={form.links?.demo || ''} 
                    onChange={handleChange} 
                    placeholder="https://demo.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub Repository</Form.Label>
                  <Form.Control 
                    name="links.github" 
                    value={form.links?.github || ''} 
                    onChange={handleChange} 
                    placeholder="https://github.com/..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Detailed Case Study</Form.Label>
                  <Form.Control 
                    name="links.case_study" 
                    value={form.links?.case_study || ''} 
                    onChange={handleChange} 
                    placeholder="https://detailed-case-study.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Outcome Summary</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="outcome" 
                value={form.outcome} 
                onChange={handleChange} 
                placeholder="Brief description of the project outcome"
              />
            </Form.Group>
          </Tab>

          {/* Content Sections Tab */}
          <Tab eventKey="content" title={<><i className="fas fa-edit me-1"></i> Content</>}>
            <Accordion defaultActiveKey="0" className="mb-4">
              {sectionFields.map(({ key, label, icon }, idx) => {
                const isRequired = ['theProblem', 'whatWeBuilt', 'howWeDidIt', 'theResults'].includes(key);
                const headingError = errors[`${key}.heading`];
                const contentError = errors[`${key}.content`];
                const headingTouched = touched[`${key}.heading`];
                const contentTouched = touched[`${key}.content`];
                
                return (
                  <Accordion.Item eventKey={String(idx)} key={key}>
                    <Accordion.Header>
                      <i className={`${icon} me-2`}></i>
                      {label}
                      {isRequired && <span className="text-danger ms-1">*</span>}
                      {(headingError || contentError) && (
                        <i className="fas fa-exclamation-triangle text-danger ms-2" title="This section has validation errors"></i>
                      )}
                    </Accordion.Header>
                    <Accordion.Body>
                      <ValidatedFormControl
                        name={`${key}.heading`}
                        label="Section Heading"
                        required={isRequired}
                        value={form[key]?.heading || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={headingError}
                        touched={headingTouched}
                        placeholder={`Enter heading for ${label}`}
                      />
                      
                      <Form.Group className="mb-3">
                        <Form.Label className={isRequired ? "required" : ""}>
                          Content
                          {isRequired && <span className="text-danger ms-1">*</span>}
                        </Form.Label>
                        <TipTapEditor
                          content={form[key]?.content || ''}
                          onChange={(content) => {
                            handleContentChange(key, content);
                            // Validate content on change if touched
                            if (touched[`${key}.content`]) {
                              const error = validateField(`${key}.content`, content);
                              setErrors(prev => ({
                                ...prev,
                                [`${key}.content`]: error
                              }));
                            }
                          }}
                          onBlur={() => {
                            setTouched(prev => ({ ...prev, [`${key}.content`]: true }));
                            const error = validateField(`${key}.content`, form[key]?.content);
                            setErrors(prev => ({
                              ...prev,
                              [`${key}.content`]: error
                            }));
                          }}
                          placeholder={`Enter content for ${label}...`}
                        />
                        {contentTouched && contentError && (
                          <div className="invalid-feedback" style={{ display: 'block' }}>
                            {contentError}
                          </div>
                        )}
                      </Form.Group>
                      
                      <ValidatedFormControl
                        name={`${key}.excerpt`}
                        label="Excerpt (Optional)"
                        as="textarea"
                        rows={2}
                        value={form[key]?.excerpt || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[`${key}.excerpt`]}
                        touched={touched[`${key}.excerpt`]}
                        placeholder="Brief excerpt for this section"
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Tab>

          {/* Technologies & Metrics Tab */}
          <Tab eventKey="tech" title={<><i className="fas fa-cogs me-1"></i> Tech & Metrics</>}>
            {/* Technologies */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">
                Technologies Used
                <span className="text-danger ms-1">*</span>
              </h6>
              {errors.technologies && (
                <small className="text-danger">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {errors.technologies}
                </small>
              )}
            </div>
            
            <div className="mb-3">
              {form.technologies.length === 0 ? (
                <div className="text-muted p-3 border rounded bg-light">
                  <i className="fas fa-info-circle me-2"></i>
                  No technologies added yet. Add at least one technology to continue.
                </div>
              ) : (
                form.technologies.map((tech, index) => (
                  <Badge key={index} bg="primary" className="me-2 mb-2 d-inline-flex align-items-center gap-1">
                    {tech.icon && <i className={tech.icon}></i>}
                    {tech.name} ({tech.category})
                    <i 
                      className="fas fa-times cursor-pointer" 
                      onClick={() => removeTechnology(index)}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </Badge>
                ))
              )}
            </div>
            
            <Row className="mb-3">
              <Col md={4}>
                <Form.Control
                  value={newTechnology.name}
                  onChange={(e) => setNewTechnology({...newTechnology, name: e.target.value})}
                  placeholder="Technology name"
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={newTechnology.category}
                  onChange={(e) => setNewTechnology({...newTechnology, category: e.target.value})}
                >
                  {technologyCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Control
                  value={newTechnology.icon}
                  onChange={(e) => setNewTechnology({...newTechnology, icon: e.target.value})}
                  placeholder="Icon class (optional)"
                />
              </Col>
              <Col md={2}>
                <Button variant="outline-primary" size="sm" onClick={addTechnology}>
                  Add
                </Button>
              </Col>
            </Row>

            {/* Key Metrics */}
            <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
              <h6 className="mb-0">
                Key Metrics & Results
                {form.status === 'published' && <span className="text-danger ms-1">*</span>}
              </h6>
              {errors.metrics && (
                <small className="text-danger">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {errors.metrics}
                </small>
              )}
            </div>
            
            <div className="mb-3">
              {form.metrics.length === 0 ? (
                <div className="text-muted p-3 border rounded bg-light">
                  <i className="fas fa-info-circle me-2"></i>
                  {form.status === 'published' 
                    ? 'At least one metric is required for published case studies.' 
                    : 'No metrics added yet. Consider adding metrics to showcase results.'}
                </div>
              ) : (
                form.metrics.map((metric, index) => (
                  <div key={index} className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{metric.label}:</strong> {metric.value}
                      {metric.description && <><br/><small className="text-muted">{metric.description}</small></>}
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => removeMetric(index)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            <Row className="mb-3">
              <Col md={4}>
                <Form.Control
                  value={newMetric.label}
                  onChange={(e) => setNewMetric({...newMetric, label: e.target.value})}
                  placeholder="Metric label"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
                  placeholder="Value (e.g., 40%, $50K)"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  value={newMetric.description}
                  onChange={(e) => setNewMetric({...newMetric, description: e.target.value})}
                  placeholder="Description (optional)"
                />
              </Col>
              <Col md={2}>
                <Button variant="outline-primary" size="sm" onClick={addMetric}>
                  Add
                </Button>
              </Col>
            </Row>
          </Tab>

          {/* SEO & Meta Tab */}
          <Tab eventKey="seo" title={<><i className="fas fa-search me-1"></i> SEO & Meta</>}>
            <Row className="mb-3">
              <Col md={6}>
                <ValidatedFormControl
                  name="seo.metaTitle"
                  label="Meta Title"
                  value={form.seo?.metaTitle || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors['seo.metaTitle']}
                  touched={touched['seo.metaTitle']}
                  placeholder="SEO title (60 chars max)"
                  maxLength={60}
                  helpText={`${(form.seo?.metaTitle || '').length}/60 characters`}
                />
              </Col>
              <Col md={6}>
                <ValidatedFormControl
                  name="seo.ogTitle"
                  label="Open Graph Title"
                  value={form.seo?.ogTitle || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors['seo.ogTitle']}
                  touched={touched['seo.ogTitle']}
                  placeholder="Social media title"
                />
              </Col>
            </Row>

            <ValidatedFormControl
              name="seo.metaDescription"
              label="Meta Description"
              as="textarea"
              rows={3}
              value={form.seo?.metaDescription || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors['seo.metaDescription']}
              touched={touched['seo.metaDescription']}
              placeholder="SEO description (160 chars max)"
              maxLength={160}
              helpText={`${(form.seo?.metaDescription || '').length}/160 characters`}
            />

            <ValidatedFormControl
              name="seo.ogDescription"
              label="Open Graph Description"
              as="textarea"
              rows={2}
              value={form.seo?.ogDescription || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors['seo.ogDescription']}
              touched={touched['seo.ogDescription']}
              placeholder="Social media description"
            />

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Open Graph Image</Form.Label>
                  <Form.Control 
                    name="seo.ogImage" 
                    value={form.seo?.ogImage || ''} 
                    onChange={handleChange} 
                    placeholder="https://example.com/og-image.jpg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Canonical URL</Form.Label>
                  <Form.Control 
                    name="seo.canonicalUrl" 
                    value={form.seo?.canonicalUrl || ''} 
                    onChange={handleChange} 
                    placeholder="https://outlfy.com/case-studies/..."
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Author Information */}
            <h6 className="mb-3 mt-4">Author Information</h6>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Author Name</Form.Label>
                  <Form.Control 
                    name="author.name" 
                    value={form.author?.name || ''} 
                    onChange={handleChange} 
                    placeholder="Author name"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Author Email</Form.Label>
                  <Form.Control 
                    type="email"
                    name="author.email" 
                    value={form.author?.email || ''} 
                    onChange={handleChange} 
                    placeholder="author@outlfy.com"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Author Avatar</Form.Label>
                  <Form.Control 
                    name="author.avatar" 
                    value={form.author?.avatar || ''} 
                    onChange={handleChange} 
                    placeholder="Avatar URL"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Tab>
        </Tabs>

        {/* Submit Button */}
        <div className="d-grid">
          <Button 
            type="submit" 
            className="btn-primary" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                {selected ? "Update Case Study" : "Create Case Study"}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CaseStudyForm;

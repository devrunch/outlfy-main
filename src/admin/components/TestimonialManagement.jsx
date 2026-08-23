"use client";
import React, { useState } from 'react';
import TestimonialList from './TestimonialList';
import TestimonialForm from './TestimonialForm';
import TestimonialView from './TestimonialView';

const TestimonialManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreate = () => {
    setSelectedTestimonial(null);
    setCurrentView('create');
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setCurrentView('edit');
  };

  const handleView = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setCurrentView('view');
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = selectedTestimonial 
        ? `/api/admin/testimonials/${selectedTestimonial._id}`
        : '/api/admin/testimonials';
      
      const method = selectedTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Form submission: response was not JSON', response.status, parseError);
        alert(`Failed to save testimonial (HTTP ${response.status}, non-JSON response — check the server console)`);
        return;
      }

      if (result.success) {
        alert(result.message || 'Testimonial saved successfully!');
        setCurrentView('list');
        setSelectedTestimonial(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        console.error('Form submission failed:', response.status, result);
        alert(`${result.message || 'Failed to save testimonial'}${result.error ? `\n\nDetails: ${result.error}` : ''}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Network error occurred while saving testimonial: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Testimonial deleted successfully!');
        setCurrentView('list');
        setSelectedTestimonial(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert(result.message || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Network error occurred while deleting testimonial');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedTestimonial(null);
  };

  const handleClose = () => {
    setCurrentView('list');
    setSelectedTestimonial(null);
  };

  return (
    <div className="testimonial-management">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#" onClick={() => setCurrentView('list')} className="text-decoration-none">
              Admin
            </a>
          </li>
          <li className={`breadcrumb-item ${currentView === 'list' ? 'active' : ''}`}>
            <a 
              href="#" 
              onClick={() => setCurrentView('list')} 
              className={currentView === 'list' ? 'text-muted' : 'text-decoration-none'}
            >
              Testimonials
            </a>
          </li>
          {currentView === 'create' && (
            <li className="breadcrumb-item active">Add New</li>
          )}
          {currentView === 'edit' && (
            <li className="breadcrumb-item active">Edit</li>
          )}
          {currentView === 'view' && (
            <li className="breadcrumb-item active">View Details</li>
          )}
        </ol>
      </nav>

      {/* Content */}
      <div className="content-area">
        {currentView === 'list' && (
          <TestimonialList
            key={refreshTrigger} // Force refresh when needed
            onCreate={handleCreate}
            onEdit={handleEdit}
            onView={handleView}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <TestimonialForm
            testimonial={selectedTestimonial}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'view' && (
          <TestimonialView
            testimonial={selectedTestimonial}
            onEdit={handleEdit}
            onClose={handleClose}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default TestimonialManagement;
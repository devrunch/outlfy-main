import React from 'react';
import './TestimonialCard.css';

interface TestimonialCardProps {
  testimonial?: {
    _id: string;
    name: string;
    position: string;
    company: string;
    testimonial: string;
    profilePicture: string;
    companyLogo: string;
    linkedinUrl: string;
    companySiteUrl: string;
    videoUrl?: string;
    projectType: string;
    status: string;
    featured: boolean;
    displayOrder: number;
    createdAt: string;
  };
  showVideo?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial,
  showVideo = false 
}) => {
  // Default testimonial for when no data is provided
  const defaultTestimonial = {
    _id: 'default',
    name: 'Sarah Johnson',
    position: 'Marketing Director',
    company: 'TechCorp Solutions',
    testimonial: '<p>Working with <strong>Outlfy</strong> has been a game-changer for our business. Their expertise in digital transformation helped us <em>increase our online presence by 300%</em> and streamline our operations significantly.</p>',
    profilePicture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE4IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2Ni43NDUyIDMwLjc0NTIgNTYgNDQgNTZIMTAwVjEwMEgyMFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
    companyLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjYwIiB5PSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM3Mzg0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Mb2dvPC90ZXh0Pgo8L3N2Zz4=',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    companySiteUrl: 'https://techcorp.com',
    videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ',
    projectType: 'web-development',
    status: 'approved',
    featured: false,
    displayOrder: 1,
    createdAt: new Date().toISOString()
  };

  const data = testimonial || defaultTestimonial;

  // FEATURED CARD - DARK MATTE
  if (false) {
    return (
      <div className="testimonial-card testimonial-card--featured">
        
          {/* Video if exists */}
          {data.videoUrl && (
            <div className="testimonial-card__video">
              <iframe
                src={data.videoUrl}
                title="Video Testimonial"
                allowFullScreen
                className="testimonial-card__video-iframe"
              ></iframe>
            </div>
          )}
        
        {/* Scrollable Testimonial Content */}
        <div 
          className="testimonial-card__content"
        >
          <div 
            className="testimonial-card__text" 
            dangerouslySetInnerHTML={{ __html: data.testimonial }}
          />
          
        </div>

        {/* Author Info */}
        <div className="testimonial-card__footer">
          <div className="testimonial-card__author">
            <img 
              src={data.profilePicture} 
              alt={data.name} 
              className="testimonial-card__avatar"
            />
            <div className="testimonial-card__info">
              <h4 className="testimonial-card__name">{data.name}</h4>
              <p className="testimonial-card__position">{data.position}</p>
            </div>
          </div>

          {/* Company Logo */}
          <div className="testimonial-card__company">
            <img 
              src={data.companyLogo} 
              alt={data.company} 
              className="testimonial-card__company-logo"
            />
          </div>
        </div>

        {/* Hidden Social Links - Show on Hover */}
        <div className="testimonial-card__social">
          {data.linkedinUrl && data.linkedinUrl !== '' && (
            <a
            href={data.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="testimonial-card__social-link"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>)}
          <a 
            href={data.companySiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="testimonial-card__social-link"
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    );
  }

  // REGULAR CARD - SIMPLE WHITE
  return (
    <div className="testimonial-card testimonial-card--regular">
      
          {/* Video if exists */}
          {data.videoUrl && (
            <div className="testimonial-card__video">
              <iframe
                src={data.videoUrl}
                title="Video Testimonial"
                frameBorder="0"
                allowFullScreen
                className="testimonial-card__video-iframe"
              ></iframe>
            </div>
          )}
      {/* Scrollable Testimonial Content */}
      <div 
        className="testimonial-card__content"
      >
        <div 
          className="testimonial-card__text" 
          dangerouslySetInnerHTML={{ __html: data.testimonial }}
        />
      </div>

      {/* Author Info */}
      <div className="testimonial-card__footer">
        <div className="testimonial-card__author">
          <img 
            src={data.profilePicture} 
            alt={data.name} 
            className="testimonial-card__avatar"
          />
          <div className="testimonial-card__info">
            <h4 className="testimonial-card__name">{data.name}</h4>
            <p className="testimonial-card__position">{data.position}</p>
          </div>
        </div>

        {/* Company Logo */}
        <div className="testimonial-card__company">
          <img 
            src={data.companyLogo} 
            alt={data.company} 
            className="testimonial-card__company-logo"
          />
        </div>
      </div>

      {/* Hidden Social Links - Show on Hover */}
      <div className="testimonial-card__social">
        {data.linkedinUrl && 
        <a 
          href={data.linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="testimonial-card__social-link"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>}
        <a 
          href={data.companySiteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="testimonial-card__social-link"
        >
          <i className="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  );
};

export default TestimonialCard;
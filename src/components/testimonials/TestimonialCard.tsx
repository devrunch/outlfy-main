"use client";
import React, { useId, useState } from 'react';
import { Modal } from 'react-bootstrap';
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
    audioUrl?: string;
    projectType: string;
    status: string;
    featured: boolean;
    displayOrder: number;
    createdAt: string;
  };
  showVideo?: boolean;
  /** Truncates the quote to a fixed card height with a clean ellipsis. */
  fixedSize?: boolean;
  /** Makes the card clickable, opening the full quote in a modal. */
  expandable?: boolean;
}

const CLOSE_ANIM_MS = 200;

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  fixedSize = false,
  expandable = false,
}) => {
  const headingId = useId();
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleOpen = () => {
    if (expandable) setShow(true);
  };

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      setClosing(false);
    }, CLOSE_ANIM_MS);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!expandable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  // Social/company links live inside the clickable card — stop their
  // clicks from bubbling up and opening the expand modal underneath them.
  const stopBubble = (event: React.MouseEvent) => event.stopPropagation();
  const normalizeVideoUrl = (url?: string) => {
    if (!url) return undefined;
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace('www.', '').toLowerCase();

      if (host === 'youtu.be') {
        const videoId = parsed.pathname.replace('/', '');
        if (videoId) {
          const params = parsed.searchParams.toString();
          return `https://www.youtube.com/embed/${videoId}${params ? `?${params}` : ''}`;
        }
      }

      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'www.youtube.com') {
        if (parsed.pathname === '/watch') {
          const videoId = parsed.searchParams.get('v');
          if (videoId) {
            parsed.searchParams.delete('v');
            const remaining = parsed.searchParams.toString();
            return `https://www.youtube.com/embed/${videoId}${remaining ? `?${remaining}` : ''}`;
          }
        }

        if (parsed.pathname.startsWith('/embed/')) {
          return url;
        }
      }

      return url;
    } catch (error) {
      return url;
    }
  };

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
          {normalizeVideoUrl(data.videoUrl) && (
            <div className="testimonial-card__video">
              <iframe
                src={normalizeVideoUrl(data.videoUrl)}
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
  const cardClassName = [
    'testimonial-card',
    'testimonial-card--regular',
    fixedSize ? 'testimonial-card--fixed' : '',
    expandable ? 'testimonial-card--clickable' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={cardClassName}
        onClick={handleOpen}
        onKeyDown={handleCardKeyDown}
        role={expandable ? 'button' : undefined}
        tabIndex={expandable ? 0 : undefined}
        aria-haspopup={expandable ? 'dialog' : undefined}
      >

          {/* Video if exists */}
          {normalizeVideoUrl(data.videoUrl) && (
            <div className="testimonial-card__video">
              <iframe
                src={normalizeVideoUrl(data.videoUrl)}
                title="Video Testimonial"
                frameBorder="0"
                allowFullScreen
                className="testimonial-card__video-iframe"
              ></iframe>
            </div>
          )}

          {/* Voice recording if exists */}
          {data.audioUrl && (
            <div className="testimonial-card__audio-wrap" onClick={stopBubble}>
              <audio src={data.audioUrl} controls className="testimonial-card__audio" />
            </div>
          )}
      {/* Truncated in the collapsed (fixedSize) state via CSS line-clamp */}
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
          onClick={stopBubble}
        >
          <i className="fab fa-linkedin-in"></i>
        </a>}
        <a
          href={data.companySiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="testimonial-card__social-link"
          onClick={stopBubble}
        >
          <i className="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>

      {expandable && (
        <Modal
          show={show}
          onHide={handleClose}
          centered
          animation={false}
          className={`testimonial-modal${closing ? ' testimonial-modal--closing' : ''}`}
          dialogClassName="testimonial-modal__dialog"
          contentClassName="testimonial-modal__content-wrap"
          backdropClassName={`testimonial-modal__backdrop${closing ? ' testimonial-modal__backdrop--closing' : ''}`}
          aria-labelledby={headingId}
        >
          <button
            type="button"
            className="testimonial-modal__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {normalizeVideoUrl(data.videoUrl) && (
            <div className="testimonial-card__video">
              <iframe
                src={normalizeVideoUrl(data.videoUrl)}
                title="Video Testimonial"
                frameBorder="0"
                allowFullScreen
                className="testimonial-card__video-iframe"
              ></iframe>
            </div>
          )}

          {data.audioUrl && (
            <div className="testimonial-card__audio-wrap">
              <audio src={data.audioUrl} controls className="testimonial-card__audio" />
            </div>
          )}

          <div className="testimonial-card__content testimonial-modal__content">
            <div
              className="testimonial-card__text"
              dangerouslySetInnerHTML={{ __html: data.testimonial }}
            />
          </div>

          <div className="testimonial-card__footer testimonial-modal__footer">
            <div className="testimonial-card__author">
              <img
                src={data.profilePicture}
                alt={data.name}
                className="testimonial-card__avatar"
              />
              <div className="testimonial-card__info">
                <h4 id={headingId} className="testimonial-card__name">
                  {data.name}
                </h4>
                <p className="testimonial-card__position">
                  {[data.position, data.company].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            <div className="testimonial-card__company">
              <img
                src={data.companyLogo}
                alt={data.company}
                className="testimonial-card__company-logo"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TestimonialCard;
'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import animationWordCome from "@/lib/utils/animationWordCome";
import { CaseStudy } from '@/types/case-study';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
}

const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({ caseStudy }) => {
  const wordAnim = useRef<HTMLHeadingElement>(null);
  const wordAnim2 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          if (wordAnim.current && wordAnim.current instanceof Element) {
            animationWordCome(wordAnim.current);
          }
          if (wordAnim2.current && wordAnim2.current instanceof Element) {
            animationWordCome(wordAnim2.current);
          }
        } catch (error) {
          console.warn('Animation error:', error);
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [caseStudy]);

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderSection = (section: typeof caseStudy.theProblem, title: string) => {
    if (!section || !section.heading) return null;

    return (
      <div key={title}>
        <h2>{section.heading}</h2>
        {section.excerpt && <p><em>{section.excerpt}</em></p>}
        <div dangerouslySetInnerHTML={{ __html: section.content }} />
      </div>
    );
  };

  const sections = [
    { data: caseStudy.theProblem, title: 'The Problem' },
    { data: caseStudy.whatWeBuilt, title: 'What We Built' },
    { data: caseStudy.howWeDidIt, title: 'How We Did It' },
    { data: caseStudy.theResults, title: 'The Results' },
    { data: caseStudy.whatHappenedNext, title: 'What Happened Next' },
    { data: caseStudy.whatThisMeansForYou, title: 'What This Means For You' },
  ];

  return (
    <>
      <section className="blog__detail">
        <div className="container g-0 line pt-140">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-8 col-xl-10 offset-xxl-2 offset-xl-1">
              <div className="blog__detail-top">
                <h2
                  className="blog__detail-date animation__word_come"
                  ref={wordAnim}
                >
                  {caseStudy.industry || 'Case Study'}, {caseStudy.projectType || 'Project'}{' '}
                  <span>{formatDate(caseStudy.publishedAt || caseStudy.createdAt)}</span>
                </h2>
                <h3
                  className="blog__detail-title animation__word_come"
                  ref={wordAnim2}
                >
                  {caseStudy.title}
                </h3>
                <div className="blog__detail-metalist">
                  <div className="blog__detail-meta">
                    <Image
                      priority
                      style={{ width: "100px", height: "auto" }}
                      src={caseStudy.clientLogo || '/assets/imgs/blog/detail/author.png'}
                      alt={caseStudy.author?.name || 'Author Picture'}
                      width={50}
                      height={50}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/imgs/blog/detail/author.png';
                      }}
                    />
                    <p>
                      Study by <span>{caseStudy.author?.name || 'Outlfy Team'}</span>
                    </p>
                  </div>
                  <div className="blog__detail-meta">
                    <p>
                      Client <span>{caseStudy.clientName}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="blog__detail-thumb">
                <Image
                  priority
                  style={{ width: "auto", height: "auto" }}
                  src={caseStudy.featuredImage?.url || '/assets/imgs/blog/detail/1.jpg'}
                  alt={caseStudy.featuredImage?.alt || caseStudy.title}
                  width={1200}
                  height={600}
                  data-speed="0.5"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/imgs/blog/detail/1.jpg';
                  }}
                />
              </div>
            </div>
            <div className="col-xxl-8 col-xl-10 offset-xxl-2 offset-xl-1">
              <div className="blog__detail-content">
                {/* Project Overview */}
                {caseStudy.summary && (
                  <p>
                    <strong>Project Overview:</strong> {caseStudy.summary}
                  </p>
                )}

                {/* Project Details */}
                {(caseStudy.budget?.range || caseStudy.teamSize || caseStudy.timeline?.duration) && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2>Project Details</h2>
                    <ul>
                      {caseStudy.budget?.range && <li>Budget: {caseStudy.budget.range}</li>}
                      {caseStudy.teamSize && <li>Team Size: {caseStudy.teamSize} members</li>}
                      {caseStudy.timeline?.duration && <li>Duration: {caseStudy.formattedDuration || caseStudy.timeline.duration}</li>}
                      {caseStudy.industry && <li>Industry: {caseStudy.industry}</li>}
                    </ul>
                  </div>
                )}

                {/* Technologies Used */}
                {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2>Technologies Used</h2>
                    <ul>
                      {caseStudy.technologies.map((tech, index) => (
                        <li key={index}>
                          {typeof tech === 'object' ? tech.name : tech}
                          {typeof tech === 'object' && tech.category && ` (${tech.category})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Content Sections */}
                {sections.map(({ data, title }) => renderSection(data, title))}

                {/* Custom Sections */}
                {caseStudy.customSections && caseStudy.customSections.map((section, index) => 
                  renderSection(section, `custom-${index}`)
                )}

                {/* Key Metrics */}
                {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2>Key Results & Metrics</h2>
                    <ul>
                      {caseStudy.metrics.map((metric, index) => (
                        <li key={index}>
                          <strong>{metric.label}:</strong> {metric.value}
                          {metric.description && ` - ${metric.description}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Project Links */}
                {(caseStudy.links?.live || caseStudy.links?.demo || caseStudy.links?.github) && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2>Project Links</h2>
                    <ul>
                      {caseStudy.links.live && (
                        <li>
                          <Link href={caseStudy.links.live} target="_blank" rel="noopener noreferrer">
                            Live Website
                          </Link>
                        </li>
                      )}
                      {caseStudy.links.demo && (
                        <li>
                          <Link href={caseStudy.links.demo} target="_blank" rel="noopener noreferrer">
                            View Demo
                          </Link>
                        </li>
                      )}
                      {caseStudy.links.github && (
                        <li>
                          <Link href={caseStudy.links.github} target="_blank" rel="noopener noreferrer">
                            GitHub Repository
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Client Website */}
                {caseStudy.clientWebsite && (
                  <p>
                    <strong>About {caseStudy.clientName}:</strong> Learn more at{' '}
                    <Link href={caseStudy.clientWebsite} target="_blank" rel="noopener noreferrer">
                      {caseStudy.clientWebsite.replace(/^https?:\/\//, '')}
                    </Link>
                  </p>
                )}
              </div>

              {/* Tags */}
              {caseStudy.tags && caseStudy.tags.length > 0 && (
                <div className="blog__detail-tags mb-5">
                  <p className="sub-title-anim">
                    tags: {caseStudy.tags.map((tag, index) => (
                      <span key={index}>
                        <Link href={`/case-studies?tag=${encodeURIComponent(tag)}`}>
                          {tag}
                        </Link>
                        {index < caseStudy.tags!.length - 1 && ', '}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CaseStudyDetail;

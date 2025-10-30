"use client";
import { useEffect, useRef } from "react";
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
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
}

interface TestimonialGridProps {
  testimonials?: Testimonial[];
}

const TestimonialGrid: React.FC<TestimonialGridProps> = ({ testimonials = [] }) => {
  // Fallback data if no testimonials are provided


  // Use database testimonials if available, otherwise fallback to default
  const displayTestimonials = testimonials.length > 0 ? testimonials : [];

  const gridRef = useRef<HTMLDivElement | null>(null);

  const columnCount = Math.min(3, Math.max(displayTestimonials.length, 1));
  const columns: Testimonial[][] = Array.from({ length: columnCount }, () => []);
  const columnWeights: number[] = Array.from({ length: columnCount }, () => 0);

  const estimateWeight = (item: Testimonial) => {
    if (!item) return 0;
    const plainText = item.testimonial
      ? item.testimonial.replace(/<[^>]*>/g, '')
      : '';
    const baseWeight = plainText.length || 0;
    const videoWeight = item.videoUrl ? 600 : 0;
    return baseWeight + videoWeight;
  };

  displayTestimonials.forEach((item) => {
    const weight = estimateWeight(item);
    let targetIndex = 0;
    let minWeight = columnWeights[0];

    for (let i = 1; i < columnCount; i++) {
      if (columnWeights[i] < minWeight) {
        minWeight = columnWeights[i];
        targetIndex = i;
      }
    }

    columns[targetIndex].push(item);
    columnWeights[targetIndex] += weight;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = gridRef.current;
    if (!container) return;

    const animatedNodes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-animate-card="true"]')
    );

    if (animatedNodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("is-visible");
            target.classList.remove("will-animate");
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    animatedNodes.forEach((node) => {
      node.classList.add("will-animate");
      node.classList.remove("is-visible");
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [displayTestimonials.length, columnCount]);

  return (
    <>
      <style jsx>{`
        .bento-columns {
          margin-top: 100px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .bento-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .bento-item {
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .bento-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .bento-item:hover::before {
          opacity: 1;
        }

        @media (max-width: 991px) {
          .bento-columns {
            flex-direction: column;
          }
        }

        .bento-item[data-animate-card="true"] {
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .bento-item[data-animate-card="true"].will-animate {
          opacity: 0;
          transform: translateY(32px);
        }

        .bento-item[data-animate-card="true"].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      
      <div className="container mt-5 mb-5">
        <div className="bento-columns" ref={gridRef}>
          {columns.map((column, colIdx) => (
            <div key={`column-${colIdx}`} className="bento-column">
              {column.map((item, idx) => (
                <div
                  key={item._id || `${colIdx}-${idx}`}
                  className="bento-item"
                  data-animate-card="true"
                >
                  <TestimonialCard testimonial={item} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TestimonialGrid;
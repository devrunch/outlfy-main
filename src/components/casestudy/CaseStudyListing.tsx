'use client';

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
import Image from "next/image";
import animationCharCome from "@/lib/utils/animationCharCome";
import { CaseStudy } from '@/types/case-study';

gsap.registerPlugin(ScrollTrigger);

const CaseStudyListing = () => {
  const charAnim = useRef<HTMLHeadingElement>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await fetch('/api/case-studies?limit=6');
        const data = await response.json();
        if (data.success) {
          setCaseStudies(data.data.caseStudies);
        }
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  useEffect(() => {
    if (charAnim.current) {
      animationCharCome(charAnim.current);
    }
    
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".blog__animation .blog__item", { x: 50, opacity: 0 });

        if (device_width < 1023) {
          const blogList = gsap.utils.toArray(".blog__animation .blog__item");
          blogList.forEach((item) => {
            let blogTl = gsap.timeline({
              scrollTrigger: {
                trigger: item as gsap.DOMTarget,
                start: "top center+=200",
              },
            });
            blogTl.to(item as gsap.TweenTarget, {
              x: 0,
              opacity: 1,
              ease: "power2.out",
              duration: 1.5,
            });
          });
        } else {
          gsap.to(".blog__animation .blog__item", {
            scrollTrigger: {
              trigger: ".blog__animation .blog__item",
              start: "top center+=300",
              markers: false,
            },
            x: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 2,
            stagger: {
              each: 0.3,
            },
          });
        }
      });
      return () => tHero.revert();
    }
  }, [caseStudies]);

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="blog__area-6 blog__animation">
        <div className="container g-0 line pt-110 pb-110">
          <span className="line-3"></span>
          <div className="row pb-130">
            <div className="col-xxl-12">
              <div className="text-center">
                <p>Loading case studies...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="blog__area-6 blog__animation">
        <div className="container g-0 line pt-110 pb-110">
          <span className="line-3"></span>
          <div className="row pb-130">
            <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                  Our Case <br />
                  Studies
                </h2>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
              <div className="blog__text">
                <p>
                  Discover how we transform challenges into innovative solutions
                  that drive real business results and digital growth.
                </p>
              </div>
            </div>
          </div>

          <div className="row reset-grid">
            {caseStudies.map((caseStudy, index) => (
              <div key={caseStudy._id} className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <article className="blog__item">
                  <div className="blog__img-wrapper">
                    <Link href={`/case-studies/${caseStudy.slug}`}>
                      <div className="img-box">
                        <Image
                          priority={index === 0}
                          style={{ width: "auto", height: "auto" }}
                          className="image-box__item"
                          src={caseStudy.featuredImage?.url || '/assets/imgs/blog/1.jpg'}
                          alt={caseStudy.featuredImage?.alt || caseStudy.title}
                          width={400}
                          height={300}
                          onError={(e) => {
                            e.currentTarget.src = '/assets/imgs/blog/1.jpg';
                          }}
                        />
                        <Image
                          priority={index === 0}
                          style={{ width: "auto", height: "auto" }}
                          className="image-box__item"
                          src={caseStudy.featuredImage?.url || '/assets/imgs/blog/1.jpg'}
                          alt={caseStudy.featuredImage?.alt || caseStudy.title}
                          width={400}
                          height={300}
                          onError={(e) => {
                            e.currentTarget.src = '/assets/imgs/blog/1.jpg';
                          }}
                        />
                      </div>
                    </Link>
                  </div>
                  <h4 className="blog__meta">
                    <Link href={`/case-studies?industry=${caseStudy.industry}`}>
                      {caseStudy.industry || 'Case Study'}
                    </Link> . {formatDate(caseStudy.publishedAt || caseStudy.createdAt)}
                  </h4>
                  <h5>
                    <Link href={`/case-studies/${caseStudy.slug}`} className="blog__title">
                      {caseStudy.title}
                    </Link>
                  </h5>
                  <Link href={`/case-studies/${caseStudy.slug}`} className="blog__btn">
                    View Case Study{" "}
                    <span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </Link>
                </article>
              </div>
            ))}
          </div>

          {caseStudies.length === 0 && (
            <div className="row">
              <div className="col-xxl-12">
                <div className="text-center">
                  <h3>No case studies found</h3>
                  <p>Check back soon for new case studies!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CaseStudyListing;

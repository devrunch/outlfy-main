"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText, ScrollTrigger } from "@/plugins";
import ArrowDownSm from "../../../public/assets/imgs/icon/arrow-down-sm.png";
import Hero31 from "../../../public/assets/imgs/hero/3/1.jpg";
import Image from "next/image.js";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const DigitalMarketingHero = () => {
  const titleLeft = useRef();
  const titleRight = useRef();
  const heroTextAnim = useRef();
  const heroTextAnim2 = useRef();
  const buttonAmin1 = useRef();
  const buttonAmin2 = useRef();
  const videoCheck = useRef();
  const videoCloseSection = useRef();
  const videoTitle = useRef();
  const heroArea = useRef();
  const wrapper = useRef();
  const heroImageRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let split_creatives = new SplitText(titleLeft.current, { type: "chars" });
      let split_solutions = new SplitText(titleRight.current, {
        type: "chars",
      });
      let split_text_animation = new SplitText(heroTextAnim.current, {
        type: "chars words",
      });
      let split_text_animation2 = new SplitText(heroTextAnim2.current, {
        type: "chars words",
      });
      let tHero = gsap.context(() => {
        let HomeDigital = gsap.timeline();

        HomeDigital.from(split_creatives.chars, {
          duration: 0.5,
          x: 100,
          autoAlpha: 0,
          stagger: 0.2,
        });
        HomeDigital.from(
          split_solutions.chars,
          { duration: 0.25, x: 100, autoAlpha: 0, stagger: 0.1 },
          "-=1"
        );
        HomeDigital.from(
          split_text_animation.words,
          { duration: 0.25, x: 50, autoAlpha: 0, stagger: 0.05 },
          "-=1"
        );

        HomeDigital.from(
          split_text_animation2.words,
          { duration: 0.25, x: 50, autoAlpha: 0, stagger: 0.05 },
          "-=1"
        );

        // Add fade-in animation for buttons
        HomeDigital.to(
          buttonAmin1.current,
          { duration: 0.25, opacity: 1, y: 0, ease: "power2.out" },
          "-=0.5"
        );
        HomeDigital.to(
          buttonAmin2.current,
          { duration: 0.25, opacity: 1, y: 0, ease: "power2.out" },
          "-=0.8"
        );

        // The hero photo sits at the bottom of a very tall section — on
        // tall viewports it can render inside the initial fold. Keep it
        // hidden until the user actually scrolls down to it.
        gsap.set(heroImageRef.current, { opacity: 0, y: 40 });
        gsap.to(heroImageRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroImageRef.current,
            start: "top 90%",
            once: true,
          },
        });
      });
      return () => tHero.revert();
    }
  }, []);

  const openVideo = () => {
    let headerArea = document.querySelector(".header__area-3");
    let video = videoTitle.current;
    let videoClose = videoCloseSection.current;
    let heroContent = document.querySelector(".hero__inner-3");
    let heroImage = document.querySelector(".hero3-img-ani");

    if (videoCheck.current.checked) {
      wrapper.current.style.zIndex = "1";
      video.style.display = "none";
      videoClose.style.display = "block";
      heroArea.current.classList.add("start-video");
      headerArea.classList.add("bg-white");

      // Fade out content
      if (heroContent) heroContent.style.opacity = "0.1";
      if (heroImage) heroImage.style.opacity = "0.1";

    } else {
      wrapper.current.style.zIndex = "999";
      video.style.display = "block";
      videoClose.style.display = "none";
      heroArea.current.classList.remove("start-video");
      headerArea.classList.remove("bg-white");

      // Fade in content
      if (heroContent) heroContent.style.opacity = "1";
      if (heroImage) heroImage.style.opacity = "1";
    }
  };

  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href');
    
    if (target && target.startsWith('#')) {
      const element = document.querySelector(target);
      if (element) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: element, offsetY: 80 },
          ease: "power2.inOut"
        });
      }
    }
  };

  return (
    <>
      <section className="hero__area-3" ref={heroArea}>
        <div className="container">
          <div className="row align-items-start">
            <div className="col-xxl-6 col-xl-6 col-lg-6 hero__tech-col">
              <div className="hero__inner-3" style={{ transition: "opacity 0.5s ease-in-out" }}>
                <div className="sec-title-wrapper">
                  <h2 className="sec-sub-title">YOUR</h2>
                  <div className="sec-title-row">
                    <h3 className="sec-title title-left" ref={titleLeft}>
                      TECH
                    </h3>
                  </div>
                </div>

                <div className="hero__aside-text hero__aside-text--primary mt-3 mb-3">
                  <p ref={heroTextAnim2}>
                    We help non-tech founders scale faster by managing the complete tech and data side of their business — from automation to analytics.
                  </p>
                </div>

                <div className="hero__text-3 hero__text-3--desktop">
                  <div className="hero__cta-group">
                    <a
                      ref={buttonAmin1}
                      href="https://calendly.com/_outlfy/meeting"
                      className="wc-btn-simple"
                      style={{ opacity: 0 }}
                    >
                      Apply for a free strategy session.
                      <i className="fa-solid fa-arrow-right wc-btn-simple__icon"></i>
                    </a>
                    <a
                      ref={buttonAmin2}
                      href="#howwework"
                      onClick={handleSmoothScroll}
                      className="wc-btn-simple__light"
                      style={{ opacity: 0 }}
                    >
                      See How we work.
                    </a>
                  </div>
                </div>
                <div className="scroll-down">
                  <button>
                    <Image
                      priority
                      style={{ width: "auto", height: "auto" }}
                      src={ArrowDownSm}
                      alt="arrow icon"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-xl-6 col-lg-6 hero__partner-col">
              <div className="hero__aside-text hero__aside-text--secondary mb-4">
                <p className="hero__text-animation" ref={heroTextAnim}>
                  We audit, design, and deploy the systems that make your company run smoother, faster, and smarter — so you can focus entirely on growth
                </p>
              </div>
              <h3 className="sec-title-small title-right title-right--aside" ref={titleRight}>
                PARTNER
              </h3>
            </div>
          </div>

          {/* Mobile-only: the desktop CTA above lives inside the 50%-wide
              TECH column, which isn't wide enough for these buttons to read
              as single-line pills at phone widths. This copy renders full
              container width below the diagonal headline instead; it's
              hidden except at $sm, where the desktop copy hides in turn
              (see _hero.scss). No entrance animation here, unlike the
              desktop copy — it's not worth wiring a second GSAP ref pair
              for a block that only exists below ~767px. */}
          <div className="hero__text-3 hero__text-3--mobile">
            <div className="hero__cta-group">
              <a
                href="https://calendly.com/gaashish575/free-45-min-consultancy-with-outlfy"
                className="wc-btn-simple"
              >
                Apply for a free strategy session.
                <i className="fa-solid fa-arrow-right wc-btn-simple__icon"></i>
              </a>
              <a
                href="#howwework"
                onClick={handleSmoothScroll}
                className="wc-btn-simple__light"
              >
                See How we work.
              </a>
            </div>
          </div>
        </div>

        <div className="hero3-img-ani" ref={heroImageRef} style={{ transition: "opacity 0.5s ease-in-out" }}>
          <Image
            priority
            width={1195}
            style={{ height: "auto" }}
            src={Hero31}
            alt="Hero Image"
            className="hero3-img"
          />
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingHero;

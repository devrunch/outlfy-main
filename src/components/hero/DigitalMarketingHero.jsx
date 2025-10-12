"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "@/plugins";
import ArrowDownSm from "../../../public/assets/imgs/icon/arrow-down-sm.png";
import Hero31 from "../../../public/assets/imgs/hero/3/1.jpg";
import Image from "next/image.js";

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
          duration: 2,
          x: 100,
          autoAlpha: 0,
          stagger: 0.2,
        });
        HomeDigital.from(
          split_solutions.chars,
          { duration: 1, x: 100, autoAlpha: 0, stagger: 0.1 },
          "-=1"
        );
        HomeDigital.from(
          split_text_animation.words,
          { duration: 1, x: 50, autoAlpha: 0, stagger: 0.05 },
          "-=1"
        );

        HomeDigital.from(
          split_text_animation2.words,
          { duration: 1, x: 50, autoAlpha: 0, stagger: 0.05 },
          "-=1"
        );

        // Add fade-in animation for buttons
        HomeDigital.to(
          buttonAmin1.current,
          { duration: 1, opacity: 1, y: 0, ease: "power2.out" },
          "-=0.5"
        );
        HomeDigital.to(
          buttonAmin2.current,
          { duration: 1, opacity: 1, y: 0, ease: "power2.out" },
          "-=0.8"
        );
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
  return (
    <>
      <section className="hero__area-3" ref={heroArea}>
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="hero__inner-3" style={{ transition: "opacity 0.5s ease-in-out" }}>
                <div className="sec-title-wrapper">
                  <h2 className="sec-sub-title">YOUR</h2>
                  <h3 className="sec-title title-left" ref={titleLeft}>
                    TECH
                  </h3>

                  <h3 className="sec-title-small title-right" ref={titleRight}>
                    PARTNER
                  </h3>
                </div>

                <div className="hero__text-3">
                  <p className="hero__text-animation mb-2 video-title mt-3" ref={heroTextAnim}>
                    We audit, design, and deploy the systems that make your company run smoother, faster, and smarter — so you can focus entirely on growth
                  </p>
                  <a
                    ref={buttonAmin1}
                    href="https://calendly.com/gaashish575/free-45-min-consultancy-with-outlfy"
                    className="wc-btn-simple mt-3"
                    style={{ opacity: 0 }}
                  >
                    Apply for a free strategy session.
                  </a>
                  <br />
                  <a
                    ref={buttonAmin2}
                    href="#howwework"
                    className="wc-btn-simple__light"
                    style={{ opacity: 0 }}
                  >
                    See How we work.
                  </a>
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
          </div>
        </div>
        <div className="hero__text-3 d-none d-lg-block" style={{ position: "absolute", left: "70%", top: "240px" }}>
          <p className=" hero__text-animation" style={{ marginLeft: "-80px", width: "380px" }} ref={heroTextAnim2}>
            {/* ▶ WATCH <span>HOW IT WORKS</span> */}
            Outlfy helps non-tech founders scale faster by managing the complete tech and data side of their business — from automation to analytics.
          </p>
        </div>
      
        <div className="hero3-img-ani" style={{ transition: "opacity 0.5s ease-in-out" }}>
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

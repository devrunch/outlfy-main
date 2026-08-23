"use client";
import { useEffect, useRef } from "react";
import { Power1, gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link.js";
import Counter3 from "../../../public/assets/imgs/thumb/counter-3.png";
import Image from "next/image.js";

gsap.registerPlugin(ScrollTrigger);

const DigitalMarketingWorkflow = () => {
  const workflowWrapper = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        if (device_width > 1200) {
          var workflow_section_3 = workflowWrapper.current;
          if (workflow_section_3) {
            let duration = 1,
              sections = gsap.utils.toArray(".wf_panel"),
              sectionIncrement = duration / (sections.length - 1),
              tl = gsap.timeline({
                scrollTrigger: {
                  trigger: ".workflow__wrapper-3",
                  pin: true,
                  scrub: 1,
                  start: "top top",
                  end: "+=5000",
                },
              });

            tl.to(sections, {
              xPercent: -100 * (sections.length - 1),
              duration: duration,
              ease: "none",
            });

            sections.forEach((section, index) => {
              let tween = gsap.from(section, {
                opacity: 0,
                scale: 0.6,
                duration: 0.5,
                force3D: true,
                paused: true,
              });
              addSectionCallbacks(tl, {
                start: sectionIncrement * (index - 0.99),
                end: sectionIncrement * (index + 0.99),
                onEnter: () => tween.play(),
                onLeave: () => tween.reverse(),
                onEnterBack: () => tween.play(),
                onLeaveBack: () => tween.reverse(),
              });
              index || tween.progress(1);
            });

            function addSectionCallbacks(
              timeline,
              { start, end, param, onEnter, onLeave, onEnterBack, onLeaveBack }
            ) {
              let trackDirection = (animation) => {
                  let onUpdate = animation.eventCallback("onUpdate"),
                    prevTime = animation.time();
                  animation.direction = animation.reversed() ? -1 : 1;
                  animation.eventCallback("onUpdate", () => {
                    let time = animation.time();
                    if (prevTime !== time) {
                      animation.direction = time < prevTime ? -1 : 1;
                      prevTime = time;
                    }
                    onUpdate && onUpdate.call(animation);
                  });
                },
                empty = (v) => v;
              timeline.direction || trackDirection(timeline);
              start >= 0 &&
                timeline.add(
                  () =>
                    ((timeline.direction < 0 ? onLeaveBack : onEnter) || empty)(
                      param
                    ),
                  start
                );
              end <= timeline.duration() &&
                timeline.add(
                  () =>
                    ((timeline.direction < 0 ? onEnterBack : onLeave) || empty)(
                      param
                    ),
                  end
                );
            }
          }
          // Counter animations with preserved suffixes
          const counterConfigs = [
            { selector: '.count1', start: 0, end: 50, suffix: '+' },
            { selector: '.count2', start: 0, end: 15, suffix: '+' },
            { selector: '.count3', start: 0, end: 6, suffix: '+' },
            { selector: '.count4', start: 0, end: 25, suffix: 'K+' }
          ];

          counterConfigs.forEach((config, index) => {
            gsap.fromTo(gsap.utils.toArray(config.selector), 
              { 
                textContent: config.start 
              },
              {
                textContent: config.end,
                duration: 1,
                delay: 3 + (index * 0.2),
                ease: Power1.easeIn,
                snap: { textContent: 1 },
                scrollTrigger: {
                  trigger: ".counter__number",
                },
                onUpdate: function() {
                  this.targets().forEach(target => {
                    const currentValue = Math.round(target.textContent);
                    target.textContent = currentValue + config.suffix;
                  });
                }
              }
            );
          });
        }
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section id="howwework" className="workflow__area-3">
        <div className="workflow__wrapper-3" ref={workflowWrapper}>
          <div className="choose-wrapper wf_panel">
            <div className="container">
              <div className="row">
                <div className="col-xxl-12">
                  <div className="choose-title-wrapper">
                    <h2 className="choose-title title-anim">
                      why <br /> choose us
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="research__area wf_panel pt-80">
            <div className="container inner_content">
              <div className="row">
                <div className="col-xxl-6 col-xl-6 col-lg-6">
                  <div className="sec-title-wrapper">
                    <h2 className="sec-sub-title">
                      why <br />
                      choose us <br />
                      why now
                    </h2>
                    <h3 className="sec-title">
                      Every month you wait, the debt compounds.
                    </h3>
                    <p>
                      The mess doesn&apos;t hold still. Every new hire, every new product, every new location adds one more thing that only lives in your head. The longer you wait, the more expensive it is to untangle — and the further ahead your competitors get while you&apos;re still firefighting.
                    </p>
                    <p className="research__quote">
                      &ldquo;I wish I&apos;d done this two years ago.&rdquo;
                      <span>— the one thing our clients say most</span>
                    </p>
                  </div>
                  <ul className="research__tools">
                    <li>
                      <a href="https://www.linkedin.com/company/outlfy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://x.com/outlfy" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                        <i className="fa-brands fa-x-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/outlfy_business_coach/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6">
                  <div className="research__list">
                    <div className="research__item">
                      <div className="research__number">
                        <span>40%</span>
                      </div>
                      <div className="research__info">
                        <h4 className="research__title">Cost Savings</h4>
                        <p>
                          Eliminate the need for multiple SaaS tools and agencies. We consolidate your tech stack, automate workflows, and help you save 40%+ annually on IT and software operations
                        </p>
                      </div>
                    </div>

                    <div className="research__item">
                      <div className="research__number">
                        <span>30 DAY</span>
                      </div>
                      <div className="research__info">
                        <h4 className="research__title">Deployments</h4>
                        <p>
                          Launch AI solutions, internal tools, or full-scale digital ecosystems in 30 days or less
                        </p>
                      </div>
                    </div>

                    <div className="research__item">
                      <div className="research__number">
                        <span>$0</span>
                      </div>
                      <div className="research__info">
                        <h4 className="research__title">Risk Guarantee</h4>
                        <p>
                         Get a 45-minute expert audit at no cost. We only charge when we deliver results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="counter__area-3 wf_panel">
            <div className="container">
              <div className="row">
                <div className="col-xxl-12">
                  <div className="sec-title-wrapper pt-5">
                    <h2 className="sec-sub-title pb-3">
                      Why <br />
                      Choose Us
                    </h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                  <div className="counter__wrapper-3">
                    <div className="counter__item-3">
                      <h2 className="counter__number count1">50+</h2>
                      <p>
                        Project <br />
                        completed
                      </p>
                    </div>
                    <div className="counter__item-3">
                      <h2 className="counter__number count2">15+</h2>
                      <p>
                        Happy <br />
                        customers
                      </p>
                    </div>
                    <div className="counter__item-3">
                      <h2 className="counter__number count3">6+</h2>
                      <p>
                        Years <br />
                        experiences
                      </p>
                    </div>
                    <div className="counter__item-3">
                      <h2 className="counter__number count4">25K+</h2>
                      <p>
                        Active Users Supported
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                  <div className="counter__img-3">
                    <Image
                      priority
                      style={{ width: "100%", height: "auto" }}
                      src={Counter3}
                      alt="Counter Image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA area start */}
          <div className="cta__area-3 wf_panel">
            <div className="container pt-150 pb-150">
              <div className="row">
                <div className="col-xxl-12">
                  <div className="cta__content-3">
                    <p className="cta__sub-title-2">
                      Have you project in mind?
                    </p>
                    <h2 className="cta__title-2">
                      Let’s make something great together!
                    </h2>
                    <div className="btn_wrapper">
                      <Link
                        href="/contact"
                        className="wc-btn-black btn-hover btn-item"
                      >
                        <span></span>Contact <br />
                        with us <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA area end */}
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingWorkflow;

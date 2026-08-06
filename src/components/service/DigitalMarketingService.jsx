"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: (
      <>
        1. Business Audit & Mapping
      </>
    ),
    link: "/contact",
    content: [
      "We begin by understanding how your business truly operates — from people and processes to tools and data.",
    ],
    features: [
      "+ Deep-dive sessions with founders and key team members",
      "+ Mapping every system, workflow, and data source",
      "+ Identifying bottlenecks that slow down growth",
    ],
    btnText: "Start Your Audit",
    img: "assets/imgs/home_1.png",
    insight: "💡 This step gives us the blueprint for how your business can scale faster, with fewer moving parts.",
  },
  {
    title: (
      <>
        2. Process Design & <br />
        Automation
      </>
    ),
    link: "/contact",
    content: [
      "We convert complexity into simple, efficient workflows — automating wherever it saves time, cost, or errors.",
    ],
    features: [
      "+ Redesigning workflows for clarity and efficiency",
      "+ Introducing automation using AI, ERP, or low-code tools",
      "+ Eliminating duplicate and manual tasks",
    ],
    btnText: "Automate Your Workflows",
    img: "assets/imgs/home_2.png",
    insight: "💡 We make your business lighter, faster, and easier to run — without adding tech headaches.",
  },
  {
    title: (
      <>
        3. Implementation & <br />
        Integration
      </>
    ),
    link: "/contact",
    content: [
      "We integrate and deploy the right systems to match your business goals — ensuring every process, platform, and person works in sync.",
    ],
    features: [
      "+ Deployment of ERP, CRM, HRMS, vendor & inventory systems, and many more",
      "+ Real-world testing with your core teams to ensure reliability",
      "+ Smooth transition from old tools to new, unified systems that just work",
    ],
    btnText: "Get Started",
    img: "assets/imgs/home_3.png",
    note: "Note: Most of these software come free with us — no extra cost for your company.",
    insight: "💡 Our goal is simple: get your systems running fast, seamlessly, and without unnecessary expense — so you can scale confidently from day one.",
  },
  {
    title: (
      <>
        4. Reporting & <br />
        Insights
      </>
    ),
    link: "/contact",
    content: [
      "We bring all your business data into one place — turning information into decisions that move the needle.",
    ],
    features: [
      "+ Building real-time dashboards and KPI trackers",
      "+ Automating MIS reports and performance summaries",
      "+ Highlighting where time, money, or effort is being lost",
    ],
    btnText: "View Insights",
    img: "assets/imgs/home_4.png",
    insight: "💡 We make data simple — so every decision you make is backed by clarity, not guesswork.",
  },
  {
    title: (
      <>
        5. Continuous Monitoring <br />
        & Support
      </>
    ),
    link: "/contact",
    content: [
      "We stay with you beyond setup — monitoring, improving, and scaling your systems as your business evolves.",
    ],
    features: [
      "+ Weekly or monthly performance reviews",
      "+ Proactive troubleshooting and updates",
      "+ Continuous optimization for new challenges and growth stages",
    ],
    btnText: "Partner With Us",
    img: "assets/imgs/home_5.png",
    insight: "💡 You get a long-term tech partner who keeps your systems sharp, your data clean, and your growth predictable.",
  },
];

const DigitalMarketingService = () => {
  const serviceList = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      imageAnimation(serviceList.current);
      let tHero = gsap.context(() => {
        let service__items_3 = gsap.utils.toArray(".service_animation");
        let service__items_heading = gsap.utils.toArray(
          ".service_animation h3"
        );
        let service__items_content = gsap.utils.toArray(
          ".service_animation .service__content-3"
        );

        service__items_3.forEach((service_item, i) => {
          gsap.set([service__items_heading[i], service__items_content[i]], {
            x: -30,
            opacity: 0,
          });

          let service3_timeline = gsap.timeline({
            scrollTrigger: {
              trigger: service_item,
              start: "top center+=200",
              markers: false,
            },
          });

          service3_timeline.to(service__items_heading[i], {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 1.5,
            stagger: {
              each: 0.2,
            },
          });
          service3_timeline.to(
            service__items_content[i],
            {
              x: 0,
              opacity: 1,
              ease: "power2.out",
              duration: 1.5,
              stagger: {
                each: 0.2,
              },
            },
            "-=1"
          );
        });
      });
      return () => tHero.revert();
    }
  }, []);

  const imageAnimation = (container) => {
    const items = container.querySelectorAll(".service_animation");
    const imgWrap = container.querySelector(".service3__img-wrap");
    const imgEl = imgWrap?.querySelector(".service3__img");
    if (!imgWrap || !imgEl) return;

    items.forEach((item, i) => {
      const handleEnter = () => {
        imgWrap.style.visibility = "visible";
        imgEl.style.backgroundImage = `url(${services[i].img})`;
      };
      const handleMove = (event) => {
        const containerBox = container.getBoundingClientRect();
        const dx = event.clientX - containerBox.left;
        const dy = event.clientY - containerBox.top;
        imgWrap.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const handleLeave = () => {
        imgWrap.style.visibility = "hidden";
      };

      item.addEventListener("mouseenter", handleEnter);
      item.addEventListener("mousemove", handleMove);
      item.addEventListener("mouseleave", handleLeave);
    });
  };

  return (
    <>
      <section id='howwework' className="service__area-3 pb-150">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper pt-130 text-anim">
                <h2 className="sec-sub-title title-anim">OUR 5-STEP GROWTH SYSTEM</h2>
                <h3 className="sec-title title-anim">
                  How We Build Systems That Scale
                </h3>
                <p>
                  Every engagement at Outlfy follows a proven 5-step framework — built from experience across industries and designed for measurable business impact.
                  <br />
                  <Link href={"https://calendly.com/gaashish575/free-45-min-consultancy-with-outlfy"} target="_blank" className="text-dark-emphasis">
                  <strong>Book a call — and let’s show you how we can help.</strong>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xx-12">
              <div className="service__list-3" ref={serviceList}>
                {services.map((service, idx) => (
                  <div className="service__item-3 service_animation" key={idx}>
                    <h3>
                      <Link href={service.link} className="service__title-3">
                        {service.title}
                      </Link>
                    </h3>
                    <div className="service__content-3">
                      {service.content.map((txt, i) => (
                        <p key={i}>{txt}</p>
                      ))}
                      <ul>
                        {service.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="service__btn-3">
                      <div className="btn_wrapper">
                        <Link
                          href={service.link}
                          className="wc-btn-black btn-hover btn-item text-center"
                        >
                          <span></span> {service.btnText}
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                    
                  </div>
                ))}
                <div className="service3__img-wrap">
                  <div className="service3__img"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingService;

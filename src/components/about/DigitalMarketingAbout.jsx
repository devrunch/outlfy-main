"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "@/plugins";
import Link from "next/link.js";
import About31 from "../../../public/assets/imgs/about/3/1.webp";
import Image from "next/image.js";

gsap.registerPlugin(ScrollSmoother);

const DigitalMarketingAbout = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        ScrollSmoother.create({
          smooth: 1.35,
          effects: device_width < 1025 ? false : true,
          smoothTouch: false,
          normalizeScroll: false,
          ignoreMobileResize: true,
        });
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="about__area-3">
        <div className="container pt-140 pb-110">
          <div className="row">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="about__img-3">
                <Image
                  priority
                  style={{ width: "100", height: "auto" }}
                  src={About31}
                  alt="About Thumbnail"
                  data-speed="auto"
                  className="smootherReset738"
                />
              </div>
            </div>

            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2 className="sec-sub-title title-anim">WHO WE ARE</h2>
                <h3 className="sec-title title-anim">
                  Building Businesses That Scale With Tech
                </h3>
              </div>
              <div className="sec-text-wrapper">
                <div className="sec-text text-anim">
                  <p>
                    We’re Outlfy — your dedicated tech growth and scale partner. <br />
                    Our mission is simple: to help founders with clarity, control, and freedom by building the systems, automations, and data-driven foundations that make scaling inevitable

                  </p>
                  <div className="feature-list" style={{ marginTop: "20px" }}>
                    <div className="feature-item" style={{ display: "flex", alignItems: "flex-start" }}>
                      <div className="feature-icon" style={{ marginRight: "15px", fontSize: "24px", color: "#e5e7eb" }}>
                          <i className="fa-solid fa-microchip"></i>
                        </div>
                        <div className="feature-content">
                          <h4 style={{ fontSize: "18px", color: "#e5e7eb" }}><strong>Tech Backbone Setup</strong></h4>
                          <p style={{ color: "var(--gray-2, #666)" }}>We design and manage your full tech ecosystem across HR, finance, CRM, and inventory.</p>
                        </div>
                    </div>
                    <div className="feature-item" style={{ display: "flex", alignItems: "flex-start" }}>
                      <div className="feature-icon" style={{ marginRight: "15px", fontSize: "24px", color: "#e5e7eb" }}>
                          <i className="fa-solid fa-wand-sparkles"></i>
                        </div>
                        <div className="feature-content">
                          <h4 style={{ fontSize: "18px", color: "#e5e7eb" }}><strong>Automation & Optimization</strong></h4>
                          <p style={{ color: "var(--gray-2, #666)" }}>We automate repetitive tasks, fix inefficiencies, and boost productivity.
</p>
                        </div>
                    </div>
                    <div className="feature-item" style={{ display: "flex", alignItems: "flex-start", color: "#e5e7eb" }}>
                      <div className="feature-icon" style={{ marginRight: "15px", fontSize: "24px", color: "white" }}>
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div className="feature-content">
                          <h4 style={{ fontSize: "18px", marginBottom: "5px" }}><strong>Data & Insights</strong></h4>
                          <p style={{ color: "var(--gray-2, #666)" }}>We give you real-time visibility into operations with dashboards that guide every decision.</p>
                        </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingAbout;

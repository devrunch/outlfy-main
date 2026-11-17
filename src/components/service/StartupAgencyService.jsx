"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
import service1 from "../../../public/assets/imgs/service-1.webp";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const StartupAgencyService = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".fade_bottom_2", { y: 30, opacity: 0 });

        if (device_width < 1023) {
          const fadeArray = gsap.utils.toArray(".fade_bottom_2");
          fadeArray.forEach((item, i) => {
            let fadeTl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top center+=200",
              },
            });
            fadeTl.to(item, {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              duration: 1.5,
            });
          });
        } else {
          gsap.to(".fade_bottom_2", {
            scrollTrigger: {
              trigger: ".fade_bottom_2",
              start: "top center+=300",
              markers: false,
            },
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 1,
            stagger: {
              each: 0.2,
            },
          });
        }
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="service__area-4">
        <div className="container g-0 line_4 pt-150 pb-140">
          <div className="line-col-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="row">
            <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6">
              <div className="service__left-6">
                {" "}
                <h2 className="sec-subtile-6">Products</h2>
                <h3 className="sec-title-6 title-anim">
                  Your All-in-One <br /> Tech Stack for <br /> Effortless
                  Scaling
                </h3>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-6 col-md-6">
              <div className="service__right-4">
                {" "}
                <p>
                  We don't just build tools – we engineer ecosystems. Replace 5+
                  vendors with one AI-driven suite and{" "}
                  <span>save 40%+ in costs.</span>
                </p>
                {/* <Link className="btn-view" href="/service">
                  Explore All Products{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </Link> */}
              </div>
            </div>
          </div>
          <div className="service__inner-4">
            <div className="row">
              <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6">
                <div className="service__img-left">
                  <Image
                    priority
                    width={430}
                    style={{ height: "auto" }}
                    src={service1}
                    alt="Service"
                  />
                </div>
              </div>
              <div className="col-xxl-7 col-xl-7 col-lg-6 col-md-6">
                <div className="service__list-4">
                  <div className="service__item-4 fade_bottom_2">
                    <div className="service__item-number">
                      <span>01</span>
                    </div>
                    <div className="service__title-wrapper-4">
                      <h4>
                        <Link
                          className="service__item-title"
                          href="/ecommerce/website"
                        >
                          AI E-Commerce Website & App
                        </Link>
                      </h4>
                    </div>
                    <div className="service__item-icon">
                      <Link href="/ecommerce/website" aria-label="Learn more about AI E-Commerce Website & App">
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="service__item-4 fade_bottom_2">
                    <div className="service__item-number">
                      <span>02</span>
                    </div>
                    <div className="service__title-wrapper-4">
                      <h4>
                        {" "}
                        <Link
                          className="service__item-title"
                          href="/ecommerce/delivery"
                        >
                          Delivery Management Hero
                        </Link>
                      </h4>
                    </div>
                    <div className="service__item-icon">
                      <Link href="/ecommerce/delivery" aria-label="Learn more about Delivery Management">
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="service__item-4 fade_bottom_2">
                    <div className="service__item-number">
                      <span>03</span>
                    </div>
                    <div className="service__title-wrapper-4">
                      <h4>
                        {" "}
                        <Link
                          className="service__item-title"
                          href="/ecommerce/inventory"
                        >
                          AI Inventory Master
                        </Link>
                      </h4>
                    </div>
                    <div className="service__item-icon">
                      <Link href="/ecommerce/inventory" aria-label="Learn more about AI Inventory Management">
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="service__item-4 fade_bottom_2">
                    <div className="service__item-number">
                      <span>04</span>
                    </div>
                    <div className="service__title-wrapper-4">
                      <h4>
                        {" "}
                        <Link
                          className="service__item-title"
                          href="/techaudit"
                        >
                          Task & Audit Command Center
                        </Link>
                      </h4>
                    </div>
                    <div className="service__item-icon">
                      <Link href="/techaudit" aria-label="Learn more about the free tech audit">
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
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

export default StartupAgencyService;

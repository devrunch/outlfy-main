"use client"; 
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Brand1 from "../../../public/assets/imgs/brand/logo-1.svg";
import Brand2 from "../../../public/assets/imgs/brand/logo-2.svg";
import Brand3 from "../../../public/assets/imgs/brand/logo-3.svg";
import Brand4 from "../../../public/assets/imgs/brand/logo-5.svg";
import Brand5 from "../../../public/assets/imgs/brand/logo-4.svg";
import Brand6 from "../../../public/assets/imgs/brand/logo-6.jpg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const DigitalMarketingBrand = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if we're on mobile
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // Initial check
      checkMobile();

      // Add resize listener
      window.addEventListener("resize", checkMobile);

      // GSAP animations
      let device_width = window.innerWidth;
      setTimeout(() => {
        let tHero = gsap.context(() => {
          gsap.set(".fade_bottom", { y: 30, opacity: 0 });

          if (device_width < 1023) {
            const fadeArray = gsap.utils.toArray(".fade_bottom");
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

            // Add marquee animation for mobile
            if (device_width < 768) {
              const marqueeElements = document.querySelectorAll(".brand__list-3");
              marqueeElements.forEach((element) => {
                const marqueeInner = element.querySelector(".marquee__inner");
                if (marqueeInner) {
                  const marqueeWidth = marqueeInner.offsetWidth;
                  gsap.to(marqueeInner, {
                    x: -marqueeWidth / 2,
                    ease: "none",
                    duration: 20,
                    repeat: -1,
                    modifiers: {
                      x: gsap.utils.unitize(
                        (x) => parseFloat(x) % (marqueeWidth / 2)
                      ),
                    },
                  });
                }
              });
            }
          } else {
            gsap.to(".fade_bottom", {
              scrollTrigger: {
                trigger: ".fade_bottom",
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
        return () => {
          tHero.revert();
          window.removeEventListener("resize", checkMobile);
        };
      }, 100);
    }
  }, []);

  return (
    <>
      <style jsx>{`
        .marquee {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .marquee__inner {
          display: flex;
          align-items: center;
          width: fit-content;
        }

        .marquee__item {
          flex-shrink: 0;
          margin-right: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <section className="brand__area">
        <div className="container pt-140 pb-140">
          <div className="row">
            <div className="col-xxl-12">
              <h2 className="brand__title-3 title-anim">
                Trusted by Founders Who Think Big
              </h2>

              {/* For mobile: Marquee effect */}
              {isMobile ? (
                <div className="brand__list-3 marquee">
                  <div className="marquee__inner">
                    {/* First set of logos */}
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={200}
                        height={67}
                        src={Brand1}
                        alt="Novam Legal Logo"
                      />
                    </div>
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={150}
                        height={67}
                        src={Brand2}
                        alt="MyDayOne Logo"
                      />
                    </div>
                    {/* <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={150}
                        height={64}
                        src={Brand3}
                        alt="Soach Global Logo"
                      />
                    </div> */}
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={160}
                        height={70}
                        src={Brand4}
                        alt="Daykart Logo"
                      />
                    </div>
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={200}
                        height={67}
                        src={Brand5}
                        alt="The You Care Logo"
                      />
                    </div>
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={160}
                        height={60}
                        src={Brand6}
                        alt="CA Cloud Desk Logo"
                      />
                    </div>

                    {/* Duplicate logos for seamless loop */}
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={200}
                        height={67}
                        src={Brand1}
                        alt="Novam Legal Logo"
                      />
                    </div>
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={150}
                        height={67}
                        src={Brand2}
                        alt="MyDayOne Logo"
                      />
                    </div>
                    {/* <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={150}
                        height={64}
                        src={Brand3}
                        alt="Soach Global Logo"
                      />
                    </div> */}
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={160}
                        height={70}
                        src={Brand4}
                        alt="Daykart Logo"
                      />
                    </div>
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={200}
                        height={67}
                        src={Brand5}
                        alt="The You Care Logo"
                      />
                    </div>
                    <div className="marquee__item brand__item-2">
                      <Image
                        priority
                        width={160}
                        height={60}
                        src={Brand6}
                        alt="CA Cloud Desk Logo"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* For desktop: Static grid layout */
                <div className="brand__list-3">
                  <div className="brand__item-2 justify-content-center fade_bottom">
                    <Image
                      priority
                      width={200}
                      height={67}
                      src={Brand1}
                      alt="Novam Legal Logo"
                    />
                  </div>
                  <div className="brand__item-2 fade_bottom">
                    <Image
                      priority
                      width={150}
                      height={67}
                      src={Brand2}
                      alt="MyDayOne Logo"
                    />
                  </div>
                  {/* <div className="brand__item-2 fade_bottom">
                    <Image
                      priority
                      width={150}
                      height={64}
                      src={Brand3}
                      alt="Soach Global Logo"
                    />
                  </div> */}
                  <div className="brand__item-2 fade_bottom">
                    <Image
                      priority
                      width={160}
                      height={70}
                      src={Brand4}
                      alt="Daykart Logo"
                    />
                  </div>
                  <div className="brand__item-2 fade_bottom">
                    <Image
                      priority
                      width={200}
                      height={67}
                      src={Brand5}
                      alt="The You Care Logo"
                    />
                  </div>
                  <div className="brand__item-2 fade_bottom">
                    <Image
                      priority
                      width={160}
                      height={60}
                      src={Brand6}
                      alt="CA Cloud Desk Logo"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingBrand;

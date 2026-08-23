import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import logoWhite2 from "../../../public/assets/imgs/logo/main-logo.svg";
import Shape11 from "../../../public/assets/imgs/shape/11.png";
import Shape12 from "../../../public/assets/imgs/shape/12.png";
import Image from "next/image";
import '../../../src/styles/highlight-link.css';

const Canvas = ({ bladeMode = "", ofCanvasArea }) => {
  const [accordion, setAccordion] = useState(0);
  const [subAccordion, setSubAccordion] = useState(0);
  const headerTitle = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        let rootParent = headerTitle.current.children;
        for (let i = 0; i < rootParent.length; i++) {
          let firstParent = rootParent[i].children;
          for (let j = 0; j < firstParent.length; j++) {
            if (firstParent[j].className.includes("header_title")) {

              let arr = firstParent[j].children[0].textContent.split("");
              let spanData = "";
              for (let k = 0; k < arr.length; k++) {
                if (arr[k] == " ") {
                  spanData += `<span style='width:2vw;'>${arr[k]}</span>`;
                } else {
                  spanData += `<span>${arr[k]}</span>`;
                }
              }
              let result = '<div class="menu-text">' + spanData + "</div>";
              firstParent[j].children[0].innerHTML = result;
            }
          }
        }
      }, 10);
    }
  }, []);
  const openData = (data) => {
    setAccordion(data);
  };
  const openSubData = (data) => {
    setSubAccordion(data);
  };
  const closeCanvas = () => {
    ofCanvasArea.current.style.opacity = "0";
    ofCanvasArea.current.style.visibility = "hidden";
    if (bladeMode) {
      let header_bg = bladeMode;
      header_bg.style.setProperty("mix-blend-mode", "exclusion");
    }
  };
  return (
    <>
      <div className="offcanvas__area" ref={ofCanvasArea}>
        <div className="offcanvas__body">
          <div className="offcanvas__left">
            <div className="offcanvas__logo">
              <Link href="/">
                <Image
                  priority
                  style={{ width: "auto", height: "auto" }}
                  src={logoWhite2}
                  alt="Outlfy Logo"
                />
              </Link>
            </div>
            <div className="offcanvas__social">
              <h3 className="social-title">Follow Us</h3>
              <ul>
                <li>
                  <a href="https://www.instagram.com/outlfy_business_coach/" aria-label="Instagram">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/Outlfy/" aria-label="Facebook">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/outlfy" aria-label="X (Twitter)">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/outlfy" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="offcanvas__links">
              <ul>  
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/techpartnership">Tech Partnerships</Link>
                </li>
                <li>
                  <Link href="/ecommerce">E-commerce Suite</Link>
                </li>
                <li>
                  <Link href="/techaudit" className="highlight-link">Free Tech Audit</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="offcanvas__mid">
            <div className="offcanvas__menu-wrapper">
              <nav className="offcanvas__menu">
                <ul className="menu-anim title" ref={headerTitle}>
                  <li>
                    <div className="header_title">
                      <Link href={"/"}>HOME</Link>
                    </div>
                  </li>
                  <li>
                    <div className="header_title">
                      <Link href={"#"}>SOLUTIONS</Link>
                      <div className="accordian-btn">
                        {accordion === 2 ? (
                          <a onClick={() => openData(0)}>-</a>
                        ) : (
                          <a onClick={() => openData(2)}>+</a>
                        )}
                      </div>
                    </div>
                    <ul
                      className="sub_title"
                      style={
                        accordion === 2 ? { display: "" } : { display: "none" }
                      }
                    >
                      <li>
                        <Link href={"/techpartnership"}>Tech Partnerships</Link>
                      </li>
                      <li className="sub_header_title">
                        <div className="d-flex justify-content-between">
                          <Link href={"https://store.outlfy.com"}>E-commerce Solutions</Link>

                        </div>
                       
                      </li>
                      <li>
                        <Link href={"/techaudit"} className="highlight-link">Free Tech Audit</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="header_title">
                      <Link href={"/about"}>ABOUT US</Link>
                    </div>
                  </li>
                  <li>
                    <div className="header_title">
                      <Link href={"/contact"}>CONTACT</Link>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="offcanvas__right">
            <div className="offcanvas__search">
              <form action="#">
                <input type="text" name="search" placeholder="Search keyword" />
                <button>
                  <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                </button>
              </form>
            </div>
            <div className="offcanvas__contact">
              <h3>Get in touch</h3>
              <ul>
                <li>
                  <a href="tel:02094980547">+(91) - 63878 17791</a>
                </li>
                <li>
                  <a href="mailto:info@outlfy.com">info@outlfy.com</a>
                </li>
              </ul>
            </div>
            <Image
              priority
              style={{ width: "auto", height: "auto" }}
              src={Shape11}
              alt="shape"
              className="shape-1"
            />
            <Image
              priority
              style={{ width: "auto", height: "auto" }}
              src={Shape12}
              alt="shape"
              className="shape-2"
            />
          </div>
          <div className="offcanvas__close">
            <button type="button" onClick={closeCanvas}>
              <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Canvas;

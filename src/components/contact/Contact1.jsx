"use client"
import animationCharCome from "@/lib/utils/animationCharCome";
import animationWordCome from "@/lib/utils/animationWordCome";
import { useEffect, useRef, useState } from "react";

const Contact1 = () => {
  const charAnim = useRef();
  const wordAnim = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    animationCharCome(charAnim.current);
    animationWordCome(wordAnim.current);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'contact',
          source: window.location.pathname
        }),
      });

      if (response.ok) {
        setSubmitMessage("Thank you! Your message has been sent successfully. We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitMessage("Sorry, there was an error sending your message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <section className="contact__area-6">
        <div className="container g-0 line pt-120 pb-110">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                  LET'S GET YOUR TECH GROWING
                </h2>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="contact__text">
                <p>
                  {
                    "Great! Let's chat about your goals—no pitch, just solutions. We'll make it happen whether you need a quick fix or a full ecosystem. Don't overthink—say hello!"
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="row contact__btm">
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="contact__info">
                <h3
                  className="sub-title-anim-top animation__word_come"
                  ref={wordAnim}
                >
                  CONTACT INFO
                </h3>
                <ul>
                  <li>
                    <a href="tel:+916387817791">Call/Text: (+91) 6387817791</a>
                  </li>
                  <li>
                    <a href="mailto:hello@outlfy.com">hello@outlfy.com</a>
                  </li>
                  <li>
                    <span>
                    VWWW9+W26, Lucknow, Uttar Pradesh, 226013
                    </span>
                  </li>
                  <li>
                    <span>
                      Prefer to book directly? <br />
                      <a href="https://calendly.com/gaashish575/free-45-min-consultancy-with-outlfy" target="_blank" className="text-decoration-underline">
                        👉 Schedule Your Free 45-Min Consultancy →
                      </a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
              <div className="contact__form">
                {submitMessage && (
                  <div className={`alert ${submitMessage.includes('error') || submitMessage.includes('Sorry') ? 'alert-danger' : 'alert-success'} mb-3`}>
                    {submitMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Name *" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Email *" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="Phone" 
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject *"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <textarea
                        name="message"
                        placeholder="Messages *"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="btn_wrapper">
                        <button 
                          type="submit" 
                          className="wc-btn-primary btn-hover btn-item"
                          disabled={isSubmitting}
                        >
                          <span></span> 
                          {isSubmitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i> Sending...
                            </>
                          ) : (
                            <>
                              Send <br />
                              Messages <i className="fa-solid fa-arrow-right"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact1;

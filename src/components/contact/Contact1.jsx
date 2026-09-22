"use client"
import animationCharCome from "@/lib/utils/animationCharCome";
import animationWordCome from "@/lib/utils/animationWordCome";
import { useRecaptcha } from "@/lib/hooks/useRecaptcha";
import { useEffect, useRef, useState } from "react";

const Contact1 = () => {
  const charAnim = useRef();
  const wordAnim = useRef();
  const { execute: executeRecaptcha } = useRecaptcha();
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
      const recaptchaToken = await executeRecaptcha("contact_submit");
      if (!recaptchaToken) {
        throw new Error("Verification failed. Please refresh the page and try again.");
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'contact',
          source: window.location.pathname,
          recaptchaToken
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
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6">
              <div className="sec-title-wrapper">
                <span className="contact__eyebrow">Get in touch</span>
                <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                  LET'S GET YOUR TECH GROWING
                </h2>
              </div>
            </div>
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-6">
              <div className="contact__text">
                <p>
                  {
                    "Great! Let's chat about your goals—no pitch, just solutions. We'll make it happen whether you need a quick fix or a full ecosystem. Don't overthink—say hello!"
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="row contact__quick-row">
            <div className="col-12">
              <div className="contact__quick-grid">
                <a
                  href="https://calendly.com/_outlfy/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__quick-card contact__quick-card--primary"
                >
                  <span className="contact__quick-icon">
                    <i className="fa-regular fa-calendar-check"></i>
                  </span>
                  <span className="contact__quick-body">
                    <span className="contact__quick-title">Book a Free Call</span>
                    <span className="contact__quick-text">45-min consultancy, no pitch</span>
                  </span>
                  <span className="contact__quick-arrow">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </a>

                <a href="mailto:info@outlfy.com" className="contact__quick-card">
                  <span className="contact__quick-icon">
                    <i className="fa-regular fa-envelope"></i>
                  </span>
                  <span className="contact__quick-body">
                    <span className="contact__quick-title">Email Us</span>
                    <span className="contact__quick-text">info@outlfy.com</span>
                  </span>
                  <span className="contact__quick-arrow">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </a>

                <a href="tel:+916387817791" className="contact__quick-card">
                  <span className="contact__quick-icon">
                    <i className="fa-solid fa-phone"></i>
                  </span>
                  <span className="contact__quick-body">
                    <span className="contact__quick-title">Call or Text</span>
                    <span className="contact__quick-text">(+91) 6387817791</span>
                  </span>
                  <span className="contact__quick-arrow">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </a>
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
                    <span className="contact__info-label">Address</span>
                    <span>VWWW9+W26, Lucknow, Uttar Pradesh, 226013</span>
                  </li>
                </ul>
                <div className="contact__social">
                  <span className="contact__info-label">Follow us</span>
                  <div className="contact__social-links">
                    <a href="https://www.linkedin.com/company/outlfy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                    <a href="https://x.com/outlfy" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com/outlfy_business_coach/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://www.facebook.com/Outlfy/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
              <div className="contact__form">
                <h3 className="contact__form-title">Send us a message</h3>
                {submitMessage && (
                  <div className={`alert ${submitMessage.includes('error') || submitMessage.includes('Sorry') ? 'alert-danger' : 'alert-success'} mb-3`}>
                    {submitMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <div className="contact__field">
                        <label htmlFor="contact-name">Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <div className="contact__field">
                        <label htmlFor="contact-email">Email *</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          placeholder="jane@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <div className="contact__field">
                        <label htmlFor="contact-phone">Phone</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          placeholder="(+91) 00000 00000"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <div className="contact__field">
                        <label htmlFor="contact-subject">Subject *</label>
                        <input
                          id="contact-subject"
                          type="text"
                          name="subject"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="contact__field">
                        <label htmlFor="contact-message">Message *</label>
                        <textarea
                          id="contact-message"
                          name="message"
                          placeholder="Tell us a bit about your goals..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <button
                        type="submit"
                        className="wc-btn-simple contact__submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <span className="wc-btn-simple__icon">
                              <i className="fa-solid fa-arrow-right"></i>
                            </span>
                          </>
                        )}
                      </button>
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

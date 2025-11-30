import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import JobDetailsModal1 from "./JobDetailsModal1";

gsap.registerPlugin(ScrollTrigger);

const JobDetails1 = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const initialFormState = {
    whyOutlfy: "",
    founderInsight: "",
    strategyPillars: "",
    workLinks: "",
    strategyLink: "",
    availability: "",
    accountability: "",
    name: "",
    email: "",
    phone: "",
    documentLink: "",
    loomLink: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: "",
    success: false,
  });
  const [submissionMessage, setSubmissionMessage] = useState({
    type: "",
    text: "",
  });
  const resetSubmitStatus = () => setSubmitStatus({ loading: false, error: "", success: false });
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        if (device_width > 767) {
          gsap.to(".job__detail-sidebar", {
            scrollTrigger: {
              trigger: ".job__detail",
              pin: ".job__detail-sidebar",
              pinSpacing: false,
              start: "top top",
              end: "bottom center",
              markers: false,
              delay: 1,
            },
          });
        }
      });
      return () => tHero.revert();
    }
  }, []);
  const jobApply = () => {
    resetSubmitStatus();
    setModalOpen(true);
  };

  const handleApplicationSubmit = async () => {
    setSubmitStatus({ loading: true, error: "", success: false });
    try {
      const response = await fetch("/api/internship-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to submit application.");
      }

      setSubmitStatus({ loading: false, error: "", success: true });
      setSubmissionMessage({
        type: "success",
        text: "Application sent successfully! We’ll get back to you soon.",
      });
      setFormData(initialFormState);
      setModalOpen(false);
      resetSubmitStatus();
      setTimeout(() => {
        setSubmissionMessage({ type: "", text: "" });
      }, 6000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit application.";
      setSubmitStatus({ loading: false, error: message, success: false });
      setSubmissionMessage({ type: "error", text: message });
    }
  };
  return (
    <>
      <section className="job__detail">
        <div className="container g-0 line pb-110">
          <span className="line-3"></span>

          <div className="row">
            <div className="col-xxl-9 col-xl-9 col-lg-8 col-md-8">
              <div className="job__detail-wrapper">
                <h2 className="sec-title">Outlfy Internship Opportunity</h2>
                <ul className="job__detail-meta">
                  <li>
                    <span>Location</span> Remote
                  </li>
                  <li>
                    <span>Duration</span> 90 Days
                  </li>
                  <li>
                    <span>Type</span> Part-time / Full-time Internship
                  </li>
                </ul>
<div className="job__detail-content">
                  <p>
                    The Outlfy Internship is a 90-day remote track built as a fast leadership
                    sprint. You will work directly with the founder, operate across strategy,
                    tech, and growth, and help ambitious companies scale without drowning in
                    complexity. This is not a typical internship; it is a high-trust build
                    partner experience for people who want to own outcomes.
                  </p>

                  <h2>About Outlfy</h2>
                  <p>
                    Outlfy is a tech growth and scale partner for founders who need speed.
                    We design automation, data-backed systems, and bold strategies that remove
                    the headache of tech while unlocking measurable revenue. We do not just
                    advise; we build, execute, and stay accountable for real-world results.
                  </p>

                  <h2>What You'll Work On</h2>
                  <ul>
                    <li>Design business strategies that shape client success and retention.</li>
                    <li>Build pitches, frameworks, and assets using tools like Canva, GPT, Notion, and similar stacks.</li>
                    <li>Research markets, map ICPs, and create growth playbooks that influence decisions.</li>
                    <li>Own end-to-end projects with the freedom to experiment, fail fast, and iterate.</li>
                    <li>Deploy and adapt new-age automation or AI tooling to solve live business problems.</li>
                    <li>Co-author case studies and success stories that strengthen the Outlfy brand.</li>
                  </ul>

                  <h2>Who You Are</h2>
                  <ul>
                    <li>Ambitious and driven, focused on impact rather than busywork.</li>
                    <li>Sharp thinker who breaks down messy problems into bold solutions.</li>
                    <li>Fast learner who absorbs tools, domains, and tech at speed.</li>
                    <li>Creative, experimental, and unafraid to challenge the default path.</li>
                    <li>Owner mentality with full accountability for outcomes and deadlines.</li>
                    <li>Curious about startups, disruption, and building smarter systems.</li>
                    <li>Bonus: comfortable with basic coding or technical concepts.</li>
                  </ul>

                  <h2>Selection Task (Mandatory)</h2>
                  <ol>
                    <li>Review the latest Outlfy Presentation shared in the application instructions.</li>
                    <li>Create a detailed Expansion and Outreach Strategy for Outlfy covering both Indian and global markets. Focus on practical, data-backed actions.</li>
                    <li>Ensure the work is 100% original. AI-generated or copied content is rejected and submissions are checked with plagiarism tools.</li>
                    <li>Submit your strategy as a PDF or Word doc along with your CV/portfolio to <strong>info@outlfy.com</strong> with the subject "Outlfy Internship Task".</li>
                  </ol>
                  <p>Applications without the completed strategy are not reviewed.</p>

                  <h2>Stipend & Timeline</h2>
                  <ul>
                    <li><strong>1st Month:</strong> Unpaid immersive evaluation.</li>
                    <li><strong>From 2nd Month:</strong> INR 5,000 - 25,000 per month, performance-based with rapid growth potential.</li>
                    <li><strong>Track:</strong> Remote, part-time or full-time depending on ownership capacity.</li>
                    <li><strong>Deadline:</strong> 30 September 2025.</li>
                  </ul>

                  <h2>Internship Outcomes</h2>
                  <p>
                    Outlfy treats this internship as a transformation sprint. Across 90 days
                    you will develop both the mindset and the systems-thinking toolkit required
                    to operate like a founder.
                  </p>
                  <h3>Core Attitude & Mindset</h3>
                  <ul>
                    <li>Ownership mentality that makes you think beyond tasks.</li>
                    <li>Seriousness and commitment to deliver outcomes, not excuses.</li>
                    <li>Bias for initiative: spot gaps, fix them, and keep asking how to improve.</li>
                    <li>Curiosity, adaptability, and resilience when things get chaotic.</li>
                    <li>Bias for action that helps you ship, learn, and iterate quickly.</li>
                  </ul>
                  <h3>Thinking & Problem-Solving Skills</h3>
                  <ul>
                    <li>Resourcefulness so you find answers instead of waiting for direction.</li>
                    <li>Structured thinking to break down complex challenges into clear steps.</li>
                    <li>Growth mindset so experiments and setbacks become feedback loops.</li>
                  </ul>
                  <p>
                    By the end of this track you will own a portfolio of real strategies,
                    understand how startups scale, and carry a mindset that stands out anywhere
                    you choose to work next. If you are ready to lead, welcome to Outlfy.
                  </p>
                </div>

                {submissionMessage.text && (
                  <div
                    className="job__submission-message"
                    style={{
                      marginTop: "24px",
                      marginBottom: "12px",
                      padding: "16px",
                      borderRadius: "10px",
                      backgroundColor:
                        submissionMessage.type === "success" ? "#e6f4ea" : "#fdecea",
                      border:
                        submissionMessage.type === "success"
                          ? "1px solid #a5d6b0"
                          : "1px solid #f5c2c0",
                      color:
                        submissionMessage.type === "success" ? "#196c3d" : "#b42318",
                      fontWeight: 500,
                    }}
                  >
                    {submissionMessage.text}
                  </div>
                )}

                <div className="job__apply btn_wrapper">
                  <button
                    onClick={jobApply}
                    className="wc-btn-primary btn-hover btn-item"
                  >
                    <span></span> Apply for this <br />
                    Position <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-4">
              <div className="job__detail-sidebar">
                <ul>
                  <li>
                    <span>Experience</span> Fresher / Student
                  </li>
                  <li>
                    <span>Duration</span> 90 Days
                  </li>
                  <li>
                    <span>Type</span> Part-time / Full-time
                  </li>
                  <li>
                    <span>Stipend</span> Month 1 unpaid, then INR 5k-25k
                  </li>
                  <li>
                    <span>Location</span> Remote
                  </li>
                  <li>
                    <span>Status</span> Open
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <JobDetailsModal1
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          formData={formData}
          setFormData={setFormData}
          submitStatus={submitStatus}
          resetStatus={resetSubmitStatus}
          handleApplicationSubmit={handleApplicationSubmit}
        />
      </div>
    </>
  );
};

export default JobDetails1;

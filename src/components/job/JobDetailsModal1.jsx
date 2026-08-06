import { Modal } from "react-bootstrap";
import Image from "next/image";
import LogoBlack from "../../../public/assets/imgs/logo/main-logo-dark.png";

const JobDetailsModal1 = ({
  modalOpen,
  setModalOpen,
  formData,
  setFormData,
  submitStatus,
  resetStatus,
  handleApplicationSubmit,
}) => {
  const stackedRowStyle = { gridTemplateColumns: "1fr", gridGap: "12px" };
  const labelStyle = {
    display: "block",
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: 1.5,
    color: "var(--black)",
  };
  const handleClose = () => {
    resetStatus();
    setModalOpen(false);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Modal
        show={modalOpen}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="modal-show modal__application"
        id="application_form"
      >
        <div className="modal__apply">
          <button
            onClick={handleClose}
            className="modal__close-2"
            id="apply_close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="form-top">
            <Image
              priority
              style={{ width: "auto", height: "auto" }}
              src={LogoBlack}
              alt="Site logo"
            />
            <h2 className="sec-title">Outlfy Internship Program</h2>
            <p>90-day remote track</p>
          </div>
          <div className="form-apply">
            <form
              id="internship-application-form"
              action="#"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplicationSubmit();
              }}
            >
              <div className="input-apply-2" style={stackedRowStyle}>
                <label htmlFor="name" style={labelStyle}>
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>
              <div className="input-apply-2" style={stackedRowStyle}>
                <label htmlFor="email" style={labelStyle}>
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
              <div className="input-apply-2" style={stackedRowStyle}>
                <label htmlFor="phone" style={labelStyle}>
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  required
                />
              </div>
              <div className="input-apply-2" style={stackedRowStyle}>
                <label htmlFor="documentLink" style={labelStyle}>
                  CV + Expansion Strategy link (Drive/Notion) *
                </label>
                <input
                  id="documentLink"
                  type="url"
                  name="documentLink"
                  value={formData.documentLink}
                  onChange={handleChange("documentLink")}
                  required
                />
              </div>
              <div className="input-apply-2" style={stackedRowStyle}>
                <label htmlFor="loomLink" style={labelStyle}>
                  Link to Loom/Notion task (optional)
                </label>
                <input
                  id="loomLink"
                  type="url"
                  name="loomLink"
                  value={formData.loomLink}
                  onChange={handleChange("loomLink")}
                />
              </div>
              <div className="input-apply" style={stackedRowStyle}>
                <label htmlFor="whyOutlfy" style={labelStyle}>
                  Why Outlfy? Which growth outcome do you want to own here? *
                </label>
                <textarea
                  id="whyOutlfy"
                  name="whyOutlfy"
                  value={formData.whyOutlfy}
                  onChange={handleChange("whyOutlfy")}
                  required
                ></textarea>
              </div>
              <div className="input-apply" style={stackedRowStyle}>
                <label htmlFor="founderInsight" style={labelStyle}>
                  After reviewing the Outlfy Presentation, share one insight that unlocked a new idea for you.
                </label>
                <textarea
                  id="founderInsight"
                  name="founderInsight"
                  value={formData.founderInsight}
                  onChange={handleChange("founderInsight")}
                  required
                ></textarea>
              </div>
              <div className="input-apply" style={stackedRowStyle}>
                <label htmlFor="strategyPillars" style={labelStyle}>
                  Describe 2-3 pillars of your Expansion & Outreach Strategy (global + India) in your own words.
                </label>
                <textarea
                  id="strategyPillars"
                  name="strategyPillars"
                  value={formData.strategyPillars}
                  onChange={handleChange("strategyPillars")}
                  required
                ></textarea>
              </div>
              <div className="input-apply" style={stackedRowStyle}>
                <label htmlFor="workLinks" style={labelStyle}>
                  Drop portfolio / GitHub / Notion / LinkedIn links that showcase your past work. *
                </label>
                <textarea
                  id="workLinks"
                  name="workLinks"
                  value={formData.workLinks}
                  onChange={handleChange("workLinks")}
                  required
                ></textarea>
              </div>
              <div className="input-apply" style={stackedRowStyle}>
                <label htmlFor="strategyLink" style={labelStyle}>
                  Paste the link to your final strategy deck or doc (Google Drive, Notion, or Loom). *
                </label>
                <textarea
                  id="strategyLink"
                  name="strategyLink"
                  value={formData.strategyLink}
                  onChange={handleChange("strategyLink")}
                  required
                ></textarea>
              </div>
              <div className="input-apply" style={stackedRowStyle}>
                <label htmlFor="availability" style={labelStyle}>
                  Weekly availability (hours) and preferred working window / timezone.
                </label>
                <textarea
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange("availability")}
                  required
                ></textarea>
              </div>
              <div className="input-apply" style={stackedRowStyle}>
                <label htmlFor="accountability" style={labelStyle}>
                  How do you keep work original and accountable in remote teams? *
                </label>
                <textarea
                  id="accountability"
                  name="accountability"
                  value={formData.accountability}
                  onChange={handleChange("accountability")}
                  required
                ></textarea>
              </div>
            </form>
            <p className="mt-20">
              Please make sure the strategy is 100% original. AI or copy-paste submissions are
              automatically rejected after plagiarism checks.
            </p>
            {submitStatus.error && (
              <p className="mt-10 text-danger">{submitStatus.error}</p>
            )}
            {submitStatus.success && (
              <p className="mt-10 text-success">
                Application sent successfully! We will get back to you soon.
              </p>
            )}
          </div>

          <div className="form-btn apply-trigger">
            <button
              type="submit"
              form="internship-application-form"
              className="wc-btn-primary btn-hover"
              disabled={submitStatus.loading}
            >
              <span></span>
              {submitStatus.loading ? "Sending..." : "Submit Application"}
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobDetailsModal1;

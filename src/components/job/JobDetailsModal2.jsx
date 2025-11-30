import { Modal } from "react-bootstrap";
import LogoBlack from "../../../public/assets/imgs/logo/main-logo-dark.png";
import Image from "next/image";

const JobDetailsModal2 = ({
  modal2,
  setModal1,
  setModal2,
  formData,
  setFormData,
  submitStatus,
  resetStatus,
  handleApplicationSubmit,
}) => {
  const backForm = () => {
    setModal2(false);
    setModal1(true);
  };

  const applyClose = () => {
    resetStatus();
    setModal2(false);
    setModal1(false);
  };
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <>
      <Modal
        show={modal2}
        onHide={applyClose}
        backdrop="static"
        keyboard={false}
        className="modal-show modal__application"
        id="application_form2"
      >
        <div className="modal__apply">
          <button
            onClick={applyClose}
            className="modal__close-2"
            id="apply_close2"
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
            <form action="#" onSubmit={(e) => e.preventDefault()}>
              <div className="input-apply-2">
                <p>Name *</p>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>
              <div className="input-apply-2">
                <p>Email *</p>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
              <div className="input-apply-2">
                <p>Phone *</p>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  required
                />
              </div>
              <div className="input-apply-2">
                <p>CV + Expansion Strategy link (Drive/Notion) *</p>
                <input
                  type="url"
                  name="documentLink"
                  value={formData.documentLink}
                  onChange={handleChange("documentLink")}
                  required
                />
              </div>
              <div className="input-apply-2">
                <p>Link to Loom/Notion task (optional)</p>
                <input
                  type="url"
                  name="task_link"
                  value={formData.loomLink}
                  onChange={handleChange("loomLink")}
                />
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
          <div className="form-btn-2">
            <button
              type="button"
              onClick={backForm}
              className="wc-btn-primary btn-hover"
              id="back_form1"
            >
              <span></span> back <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button
              type="button"
              onClick={handleApplicationSubmit}
              className="wc-btn-primary btn-hover"
              disabled={submitStatus.loading || submitStatus.success}
            >
              <span></span>{" "}
              {submitStatus.loading
                ? "Sending..."
                : submitStatus.success
                ? "Sent"
                : "Submit"}
              {" "}
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobDetailsModal2;

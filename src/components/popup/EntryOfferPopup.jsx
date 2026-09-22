"use client";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./EntryOfferPopup.css";

const STORAGE_KEY = "outlfy-entry-offer-seen";
const SHOW_DELAY_MS = 800;
const CLOSE_ANIM_MS = 200;

const EntryOfferPopup = () => {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let alreadySeen = true;
    try {
      alreadySeen = !!window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      alreadySeen = false;
    }

    if (alreadySeen) return;

    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, "true");
      } catch (error) {
        // Storage unavailable (e.g. private browsing) — still show the
        // popup for this visit, it just won't be remembered.
      }
      setShow(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      setClosing(false);
    }, CLOSE_ANIM_MS);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      animation={false}
      className={`entry-offer${closing ? " entry-offer--closing" : ""}`}
      dialogClassName="entry-offer__dialog"
      contentClassName="entry-offer__content"
      backdropClassName={`entry-offer__backdrop${closing ? " entry-offer__backdrop--closing" : ""}`}
      aria-labelledby="entry-offer-heading"
    >
      <button
        type="button"
        className="entry-offer__close"
        onClick={handleClose}
        aria-label="Close"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <div className="entry-offer__body">
        <h2 id="entry-offer-heading" className="entry-offer__heading">
          Your business has a hidden leak
        </h2>
        <p className="entry-offer__text">
          Most founders lose $10,000+ a year to disconnected tools, manual
          busywork, and systems that don&apos;t talk to each other. A free
          strategy session shows you exactly where — and how to plug it.
        </p>
        <a
          href="https://calendly.com/_outlfy/meeting"
          target="_blank"
          rel="noopener noreferrer"
          className="wc-btn-simple entry-offer__cta"
          onClick={handleClose}
        >
          Get my free strategy session
          <i className="fa-solid fa-arrow-right wc-btn-simple__icon"></i>
        </a>
        <button type="button" className="entry-offer__later" onClick={handleClose}>
          Maybe later
        </button>
      </div>
    </Modal>
  );
};

export default EntryOfferPopup;

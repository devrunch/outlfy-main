"use client";
import { useCallback, useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const SCRIPT_ID = "recaptcha-v3-script";

// Loads the reCAPTCHA v3 script once and exposes execute() to fetch a fresh
// token right before a form submit (v3 tokens expire after ~2 minutes).
export function useRecaptcha() {
  const readyPromise = useRef(null);

  const load = useCallback(() => {
    if (!SITE_KEY) return Promise.resolve();
    if (readyPromise.current) return readyPromise.current;

    readyPromise.current = new Promise((resolve) => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(resolve);
        return;
      }

      const existing = document.getElementById(SCRIPT_ID);
      if (existing) {
        existing.addEventListener("load", () => window.grecaptcha.ready(resolve));
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => window.grecaptcha.ready(resolve);
      document.head.appendChild(script);
    });

    return readyPromise.current;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const execute = useCallback(
    async (action) => {
      if (!SITE_KEY) return null;
      await load();
      return window.grecaptcha.execute(SITE_KEY, { action });
    },
    [load]
  );

  return { execute };
}

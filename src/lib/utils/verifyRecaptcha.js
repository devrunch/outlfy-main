const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const SCORE_THRESHOLD = 0.5;

// Verifies a reCAPTCHA v3 token against the secret key. Must run server-side only.
export async function verifyRecaptcha(token, remoteIp, expectedAction) {
  if (!token) {
    return { success: false, error: "missing-token" };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return { success: false, error: "missing-secret" };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.append("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await res.json();

    if (!data.success) {
      return { success: false, errorCodes: data["error-codes"] };
    }
    if (expectedAction && data.action !== expectedAction) {
      return { success: false, error: "action-mismatch" };
    }
    if (typeof data.score === "number" && data.score < SCORE_THRESHOLD) {
      return { success: false, error: "low-score", score: data.score };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error("reCAPTCHA verification request failed:", error);
    return { success: false, error: "verify-request-failed" };
  }
}

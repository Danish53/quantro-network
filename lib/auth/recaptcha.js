/**
 * Server-side reCAPTCHA v2 verification.
 * If RECAPTCHA_SECRET_KEY is unset, allows requests (dev with Google test keys).
 */
export async function verifyRecaptchaV2(token) {
  if (!token || typeof token !== "string") {
    return false;
  }
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return true;
  }
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

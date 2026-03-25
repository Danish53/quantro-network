import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    hasMongo: Boolean(process.env.MONGODB_URI),
    hasJwt: Boolean(process.env.JWT_SECRET),
    hasRecaptchaSecret: Boolean(process.env.RECAPTCHA_SECRET_KEY),
    hasSmtpHost: Boolean(process.env.SMTP_HOST),
  });
}


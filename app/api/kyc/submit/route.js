import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import User from "@/lib/models/User";

export const runtime = "nodejs";
const USA_ALLOWED = new Set(["US", "USA", "UNITED STATES", "UNITED STATES OF AMERICA", "UNITED STATE"]);

function normalizeCountry(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const submitSchema = z.object({
  docType: z.enum(["national_id", "passport", "license"]),
  docNumber: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  country: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  addressLine1: z.string().trim().min(5).max(160),
  postalCode: z.string().trim().min(3).max(20),
  dateOfBirth: z.string().trim().min(8).max(20),
  ssnLast4: z.string().trim().regex(/^\d{4}$/),
  usResident: z.boolean(),
  hasFrontImage: z.boolean(),
  hasBackImage: z.boolean().optional(),
});

export async function POST(request) {
  const userId = await getAuthUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  if (!parsed.data.hasFrontImage) {
    return NextResponse.json({ error: "Front document image is required" }, { status: 400 });
  }
  const countryNormalized = normalizeCountry(parsed.data.country);
  if (!parsed.data.usResident || !USA_ALLOWED.has(countryNormalized)) {
    return NextResponse.json({ error: "KYC currently supports USA users only for card issuance" }, { status: 400 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.kycStatus = "pending";
  user.kycSubmittedAt = new Date();
  user.kycApprovedAt = null;
  user.kycRejectedReason = "";
  user.kycCountry = parsed.data.country.trim();
  user.kycState = parsed.data.state.trim();
  user.kycCity = parsed.data.city.trim();
  user.kycAddressLine1 = parsed.data.addressLine1.trim();
  user.kycPostalCode = parsed.data.postalCode.trim();
  user.kycDateOfBirth = parsed.data.dateOfBirth.trim();
  user.kycSsnLast4 = parsed.data.ssnLast4.trim();
  user.kycUsResident = parsed.data.usResident;
  await user.save();

  return NextResponse.json({
    ok: true,
    kyc: {
      status: user.kycStatus,
      submittedAt: user.kycSubmittedAt,
      approvedAt: user.kycApprovedAt,
      rejectedReason: user.kycRejectedReason,
      country: user.kycCountry,
      state: user.kycState,
      city: user.kycCity,
      addressLine1: user.kycAddressLine1,
      postalCode: user.kycPostalCode,
      dateOfBirth: user.kycDateOfBirth,
      ssnLast4: user.kycSsnLast4,
      usResident: user.kycUsResident,
    },
  });
}

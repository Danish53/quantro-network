import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { getAuthUserIdFromRequest } from "@/lib/api/authUser";
import User from "@/lib/models/User";
import { reconcileMockKycStatus } from "@/lib/kyc/mockKyc";

export const runtime = "nodejs";
const USA_ALLOWED = new Set(["US", "USA", "UNITED STATES", "UNITED STATES OF AMERICA", "UNITED STATE"]);

function normalizeCountry(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsCountry(value) {
  return USA_ALLOWED.has(normalizeCountry(value));
}

function toKycPayload(user) {
  return {
    status: user.kycStatus ?? "not_submitted",
    submittedAt: user.kycSubmittedAt ?? null,
    approvedAt: user.kycApprovedAt ?? null,
    rejectedReason: user.kycRejectedReason ?? "",
    country: user.kycCountry ?? "",
    state: user.kycState ?? "",
    city: user.kycCity ?? "",
    addressLine1: user.kycAddressLine1 ?? "",
    postalCode: user.kycPostalCode ?? "",
    dateOfBirth: user.kycDateOfBirth ?? "",
    ssnLast4: user.kycSsnLast4 ?? "",
    usResident: user.kycUsResident ?? false,
  };
}

export async function GET(request) {
  const userId = await getAuthUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
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

  await reconcileMockKycStatus(user);
  if (user.kycStatus === "approved") {
    let hasChanges = false;
    if (!user.kycUsResident && (isUsCountry(user.kycCountry) || isUsCountry(user.country))) {
      user.kycUsResident = true;
      hasChanges = true;
    }
    if (user.kycUsResident && !isUsCountry(user.kycCountry)) {
      user.kycCountry = "United States";
      hasChanges = true;
    }
    if (hasChanges) {
      await user.save();
    }
  }
  return NextResponse.json({ kyc: toKycPayload(user) });
}

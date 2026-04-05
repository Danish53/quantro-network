import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/api/requireAdmin";
import User from "@/lib/models/User";
import { effectiveUserRole } from "@/lib/auth/roles";

export const runtime = "nodejs";

export async function DELETE(request, ctx) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const params = await ctx.params;
  const rawId = params?.id;
  if (!rawId || !mongoose.Types.ObjectId.isValid(rawId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  if (rawId === gate.adminId) {
    return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
  }

  try {
    const user = await User.findById(rawId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.deletedAt) {
      return NextResponse.json({ error: "User is already inactive" }, { status: 409 });
    }
    if (effectiveUserRole(user) === "admin") {
      return NextResponse.json({ error: "Administrator accounts cannot be deactivated." }, { status: 403 });
    }
    user.deletedAt = new Date();
    await user.save();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/users DELETE]", e);
    return NextResponse.json({ error: "Could not update user" }, { status: 500 });
  }
}

export async function PATCH(request, ctx) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const params = await ctx.params;
  const rawId = params?.id;
  if (!rawId || !mongoose.Types.ObjectId.isValid(rawId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body?.action !== "reactivate") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const user = await User.findById(rawId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (effectiveUserRole(user) === "admin") {
      return NextResponse.json({ error: "Invalid target" }, { status: 403 });
    }
    if (!user.deletedAt) {
      return NextResponse.json({ error: "User is already active" }, { status: 409 });
    }
    user.deletedAt = null;
    await user.save();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/users PATCH]", e);
    return NextResponse.json({ error: "Could not update user" }, { status: 500 });
  }
}

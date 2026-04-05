/**
 * Set users missing `role` to "user"; upsert admin@gmail.com (bcrypt, role admin).
 * Run: npm run seed:admin
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../lib/models/User.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  const p = join(root, ".env.local");
  if (!existsSync(p)) return;
  const raw = readFileSync(p, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

loadEnvLocal();

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_USERNAME = "quantro_admin";
const ADMIN_PASSWORD = "12345678";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI. Set it or run: npm run seed:admin (reads .env.local).");
  process.exit(1);
}

await mongoose.connect(uri);

const legacy = await User.updateMany(
  { $or: [{ role: { $exists: false } }, { role: null }, { role: "" }] },
  { $set: { role: "user" } },
);
console.log(`Users updated to role=user (were missing role): ${legacy.modifiedCount}`);

const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

let existing = await User.findOne({ email: ADMIN_EMAIL }).select("+password");
if (existing) {
  existing.password = passwordHash;
  existing.role = "admin";
  if (!existing.fullName?.trim()) existing.fullName = "Site Admin";
  if (!existing.phone?.trim()) existing.phone = "0000000000";
  if (!existing.country?.trim()) existing.country = "US";
  await existing.save();
  console.log(`Updated ${ADMIN_EMAIL} — role=admin, password set (bcrypt).`);
} else {
  await User.create({
    fullName: "Site Admin",
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    phone: "0000000000",
    country: "US",
    referral: "",
    password: passwordHash,
    role: "admin",
  });
  console.log(`Created ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD}) — role=admin`);
}

await mongoose.disconnect();
console.log("Done.");
process.exit(0);

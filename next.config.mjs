import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Fixes wrong workspace root when a parent folder has another package-lock.json — env loads from this app. */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

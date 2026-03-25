import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1200;

const globalForMongoose = globalThis;
let cached = globalForMongoose.mongooseCache;

if (!cached) {
  cached = globalForMongoose.mongooseCache = { conn: null, promise: null };
}

export default async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cached.conn) {
    console.log("MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("MongoDB connecting...");
    cached.promise = connectWithRetry();
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully");
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error("MongoDB connection failed::", error);
    throw error;
  }

  return cached.conn;
}

async function connectWithRetry() {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
    } catch (error) {
      lastError = error;
      const shouldRetry = isTransientDnsError(error) && attempt < MAX_RETRIES;

      if (!shouldRetry) {
        throw error;
      }

      console.warn(`MongoDB DNS issue, retrying (${attempt}/${MAX_RETRIES})...`);
      await delay(RETRY_DELAY_MS);
    }
  }

  throw lastError;
}

function isTransientDnsError(error) {
  return error?.code === "ECONNREFUSED" && error?.syscall === "querySrv";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
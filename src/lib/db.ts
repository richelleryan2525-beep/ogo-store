import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Reuse the connection across hot reloads in dev and across invocations in serverless.
declare global {
  // eslint-disable-next-line no-var
  var __ogoMongoose: Cached | undefined;
}

const cached: Cached = global.__ogoMongoose || { conn: null, promise: null };
global.__ogoMongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not set. Copy .env.example to .env and add your MongoDB Atlas connection string.'
    );
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

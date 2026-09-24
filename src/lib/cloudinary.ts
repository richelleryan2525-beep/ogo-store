import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env (see .env.example).'
    );
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  configured = true;
}

export async function uploadImageBuffer(buffer: Buffer, filename: string, mimeType = 'image/jpeg'): Promise<string> {
  ensureConfigured();
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'ogo-products',
    public_id: filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80),
    resource_type: 'image',
    overwrite: false,
    // Cap the longest edge so a huge phone photo doesn't bloat storage/bandwidth.
    transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
  });
  return result.secure_url;
}
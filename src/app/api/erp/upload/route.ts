import { NextRequest, NextResponse } from 'next/server';
import { uploadImageBuffer } from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Please upload a JPEG, PNG, WEBP, GIF or AVIF image.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'That image is larger than 8MB. Please use a smaller file.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBuffer(buffer, file.name || `photo-${Date.now()}`, file.type);

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error('Image upload failed:', err);
    const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

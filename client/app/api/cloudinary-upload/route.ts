import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  // Add authentication check here
  // if (!isAuthenticated(request)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary using server-side SDK
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: 'chronos-hub',
      resource_type: 'auto',
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

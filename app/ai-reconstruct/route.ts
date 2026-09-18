import { NextResponse } from 'next/server';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, ALLOWED_STRUCTURE_TYPES } from '@/lib/validation';
import { processImage } from '@/lib/image';
import { generateReconstruction } from '@/lib/pollinations';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const structureType = formData.get('structureType') as string;
    const context = formData.get('context') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Please select an image first.' }, { status: 400 });
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Unsupported image type.' }, { status: 415 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large.' }, { status: 413 });
    }
    if (!ALLOWED_STRUCTURE_TYPES.includes(structureType)) {
      return NextResponse.json({ success: false, error: 'Invalid structure type.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    let imageBuffer: Buffer;
    try {
      imageBuffer = await processImage(Buffer.from(arrayBuffer));
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Failed to process uploaded image.' }, { status: 400 });
    }

    // Short, punchy, and aggressive prompt to bypass API limits and force reconstruction
    let prompt = `Render a fully complete, undamaged ${structureType}. Replace all broken parts, gaps, and rubble with solid architecture. Make it look 100% newly built.`;

    if (context) {
      prompt += ` ${context}`;
    }

    const generatedImage = await generateReconstruction(imageBuffer, file.type, prompt);

    return NextResponse.json({ success: true, image: generatedImage }, { status: 200 });
  } catch (error: any) {
    console.error('Reconstruction Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Reconstruction failed.' }, { status: 500 });
  }
}
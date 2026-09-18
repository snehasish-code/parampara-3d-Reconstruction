import sharp from 'sharp';

export async function processImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.format) {
    throw new Error('Invalid image format');
  }

  return await image
    .rotate() 
    .resize({
      width: 1024,
      height: 1024,
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFormat('jpeg', { quality: 90 })
    .toBuffer();
}
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

export const ALLOWED_STRUCTURE_TYPES = [
  'Sculpture',
  'Statue',
  'Monument',
  'Building',
  'Temple',
  'Artifact',
  'Other'
];

export function validateImage(file: File): string | null {
  if (!file) return 'Please select an image first.';
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return 'Please upload a valid JPG, PNG, or WEBP image.';
  if (file.size > MAX_FILE_SIZE) return 'Image must be smaller than 10 MB.';
  return null;
}
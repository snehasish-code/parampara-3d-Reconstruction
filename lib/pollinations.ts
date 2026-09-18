export async function generateReconstruction(
  imageBuffer: Buffer,
  mimeType: string,
  prompt: string
): Promise<string> {
  try {
    const formData = new FormData();
    const imageBlob = new Blob([imageBuffer], { type: mimeType });

    formData.append('image', imageBlob, 'input.jpg');
    formData.append('prompt', prompt);
    formData.append('model', 'kontext');
    formData.append('response_format', 'b64_json');

    const response = await fetch('https://gen.pollinations.ai/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Pollinations API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) throw new Error('Pollinations API response did not contain image data');

    return b64.startsWith('data:') ? b64.split(',')[1] : b64;
  } catch (error: any) {
    console.error('Pollinations API Error:', error);
    throw new Error('Failed to generate reconstruction');
  }
}
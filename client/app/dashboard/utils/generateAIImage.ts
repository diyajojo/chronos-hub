interface GenerateImageParams {
  description: string;
  year: string;
  setGeneratingImage: (loading: boolean) => void;
  setAiImageUrl: (url: string) => void;
  setTimeLog: (timeLog: any) => void;
  currentTimeLog: any;
}

// In your generateAIImage.ts file, modify it to use a proxy endpoint:
export const generateAIImage = async ({
  description,
  year,
  setGeneratingImage,
  setAiImageUrl,
  setTimeLog,
  currentTimeLog
}: GenerateImageParams) => {
  try {
    setGeneratingImage(true);
    
    if (!description || !year) {
      throw new Error('Description and Year are required to generate an image');
    }
    
    const response = await fetch('http://localhost:8000/generateAIimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        prompt: description,
        year
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image');
    }
    
    const data = await response.json();
    if (!data.success || !data.imageUrl) {
      throw new Error(data.error || 'Failed to generate image');
    }
    
    // Instead of directly fetching from OpenAI's URL, use your proxy endpoint
    const proxyUrl = `http://localhost:8000/proxy-image?url=${encodeURIComponent(data.imageUrl)}`;
    
    // Set this proxy URL as the AI image URL
    setAiImageUrl(proxyUrl);
    
    // Create a file from the proxied image
    const imageResponse = await fetch(proxyUrl);
    const blob = await imageResponse.blob();
    const file = new File([blob], 'ai-generated-image.png', { type: 'image/png' });
    
    setTimeLog({
      ...currentTimeLog,
      imageFile: file,
      customFileName: `time-travel-${year}`
    });
  } catch (error) {
    console.error('Error generating AI image:', error);
    throw error;
  } finally {
    setGeneratingImage(false);
  }
};
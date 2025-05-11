// generateImage.js
const OpenAI = require('openai');
const { enhancePrompt } = require('./utils/promptgenerate');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateImage(req, res) {
  try {
    const { prompt, year } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Story description is required'
      });
    }

    // Generate enhanced prompt
    const enhancedPrompt = enhancePrompt(year, prompt);
    
    // Final prompt without survival context
    let finalPrompt = enhancedPrompt;
    
    console.log("Enhanced prompt:", finalPrompt);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // Using DALL-E 3 for better quality
      prompt: finalPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });
    
    return res.json({
      success: true,
      imageUrl: response.data[0].url,
      originalPrompt: prompt,
      enhancedPrompt: finalPrompt
    });
  } 
  catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate image',
      message: error.message
    });
  }
}

module.exports = generateImage;
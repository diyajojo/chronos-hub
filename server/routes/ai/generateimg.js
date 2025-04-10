const OpenAI = require('openai');
const { enhancePrompt } = require('./utils/promptUtils');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateImage(req, res) {
  try {
    const { prompt, year, survivalChance } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Generate enhanced prompt
    const enhancedPrompt = enhancePrompt(year, prompt, survivalChance);
    
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
    });
    
    return res.json({
      success: true,
      imageUrl: response.data[0].url,
    });
  } 
  catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate image'
    });
  }
}

module.exports = generateImage;
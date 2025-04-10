const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function rateStory(req, res) {
  try {
    const { year, description, imageUrl, survivalChance } = req.body;
    
    // Base prompt without image
    let prompt = `As a historian and time travel expert, evaluate this time traveler's journey:

TIME PERIOD: ${year}
TRAVELER'S ACCOUNT: ${description}
TRAVELER'S ESTIMATED SURVIVAL CHANCE: ${survivalChance}%

Your task:
1. Analyze the historical accuracy of the account (Do events, people, and details align with known history?)
2. Evaluate the scientific plausibility (Could this occur based on known physics of time travel?)
3. Check for internal consistency (Does the story make logical sense on its own terms?)

Based on your analysis:
- Rate the BELIEVABILITY of this time travel account on a scale of 0-100
- Adjust the SURVIVAL CHANCE based on historical dangers and described scenarios

Reply ONLY with two numbers separated by a comma: believabilityRating,adjustedSurvivalChance`;

    // If an image URL is provided, use GPT-4 Vision API to analyze it
    if (imageUrl && imageUrl.startsWith('http')) {
      try {
        // Call GPT-4 Vision to analyze the image
        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: `Analyze this image that supposedly shows time travel to ${year}. 
                  Consider: Does it look authentic to the time period? Are there anachronisms? 
                  Could this be a genuine photograph from ${year}? 
                  Provide a brief objective analysis.` 
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        });
        
        const imageAnalysis = visionResponse.choices[0].message.content;
        
        // Add image analysis to the main prompt
        prompt = `As a historian and time travel expert, evaluate this time traveler's journey:

TIME PERIOD: ${year}
TRAVELER'S ACCOUNT: ${description}
TRAVELER'S ESTIMATED SURVIVAL CHANCE: ${survivalChance}%
IMAGE ANALYSIS: ${imageAnalysis}

Your task:
1. Analyze the historical accuracy of the account and image (Do events, people, and details align with known history?)
2. Evaluate the scientific plausibility (Could this occur based on known physics of time travel?)
3. Check for internal consistency (Does the story make logical sense on its own terms?)
4. Consider how the image supports or contradicts the account

Based on your analysis:
- Rate the BELIEVABILITY of this time travel account on a scale of 0-100
- Adjust the SURVIVAL CHANCE based on historical dangers and described scenarios

Reply ONLY with two numbers separated by a comma: believabilityRating,adjustedSurvivalChance`;
      } catch (imageError) {
        console.error('Error analyzing image:', imageError);
        // Continue without image analysis if it fails
      }
    }

    // Get the final rating using the appropriate model
    const model = imageUrl && imageUrl.startsWith('http') ? "gpt-4-turbo" : "gpt-3.5-turbo";
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: 0.7,
      max_tokens: 10
    });

    const response = completion.choices[0].message.content.trim();
    
    // Parse the response - handle potential errors in response format
    let rating = 50;
    let adjustedSurvivalChance = survivalChance;
    
    if (response.includes(',')) {
      const [ratingStr, survivalStr] = response.split(',');
      rating = parseInt(ratingStr) || 50;
      adjustedSurvivalChance = parseInt(survivalStr) || survivalChance;
      
      // Ensure values are within range
      rating = Math.max(0, Math.min(100, rating));
      adjustedSurvivalChance = Math.max(0, Math.min(100, adjustedSurvivalChance));
    }

    // Return only the essential data
    res.json({
      success: true,
      rating,
      survivalChance: adjustedSurvivalChance
    });
  } 
  catch (error) 
  {
    console.error('Error rating story:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rate story'
    });
  }
}

module.exports = rateStory;
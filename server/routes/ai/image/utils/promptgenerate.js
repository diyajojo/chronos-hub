
function enhancePrompt(year, description) {
  // Extract key elements from the description
  const keyElements = extractKeyElements(description, year);
  
  // Build an enhanced prompt with visual details
  const enhancedPrompt = `
    A vibrant, humorous illustration showing a time travel scene from the year ${year}.
    Scene depicts: ${keyElements.mainAction}
    Main characters: ${keyElements.characters.join(', ') || 'time travelers'}
    Setting: ${keyElements.location || `time period appropriate for year ${year}`}
    Key elements include: ${keyElements.objects.join(', ')}
    Visual style: Colorful, slightly exaggerated cartoon with clear details and good lighting.
    Include readable text overlay: "${keyElements.textOverlay}"
    Make the image funny, engaging and visually appealing with exaggerated expressions and clear storytelling.
  `.replace(/\s+/g, ' ').trim();
  
  return enhancedPrompt;
}

function extractKeyElements(description, year) {
  // Initialize elements object
  const elements = {
    characters: [],
    location: '',
    objects: [],
    mainAction: '',
    textOverlay: '',
    timeContext: ''
  };
  
  // Extract character names - look for proper nouns
  const nameMatch = description.match(/\b[A-Z][a-z]{2,}\b/g);
  if (nameMatch) {
    // Filter out common non-name words that might be capitalized
    const commonWords = ['The', 'And', 'But', 'Or', 'If', 'When', 'What', 'Where', 'Who', 'How', 'Why', 'Which', 'There', 'Their', 'They'];
    elements.characters = nameMatch.filter(name => !commonWords.includes(name));
  }
  
  // If no character names found, try to identify roles/descriptions
  if (elements.characters.length === 0) {
    const roles = ['man', 'woman', 'person', 'boy', 'girl', 'child', 'teen', 'teenager', 'student', 'professor', 'doctor', 'traveler'];
    roles.forEach(role => {
      if (description.toLowerCase().includes(role)) {
        elements.characters.push(role);
      }
    });
  }
  
  // Extract location - use NLP-like approach
  const locationPatterns = [
    /\bin\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/,  // "in London", "in New York"
    /\bto\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/,  // "to Paris"
    /\bat\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/   // "at Rome"
  ];
  
  for (const pattern of locationPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      elements.location = match[1];
      break;
    }
  }
  
  // If no specific location found, try to detect setting type
  if (!elements.location) {
    const settings = {
      city: ['city', 'downtown', 'urban', 'metropolis'],
      rural: ['village', 'countryside', 'farm', 'rural'],
      nature: ['forest', 'mountain', 'beach', 'ocean', 'river', 'lake'],
      future: ['future', 'futuristic', 'sci-fi', 'spaceship', 'space station'],
      past: ['ancient', 'medieval', 'prehistoric', 'historic']
    };
    
    for (const [type, keywords] of Object.entries(settings)) {
      for (const keyword of keywords) {
        if (description.toLowerCase().includes(keyword)) {
          elements.location = `${keyword} setting`;
          break;
        }
      }
      if (elements.location) break;
    }
  }
  
  // Time period context based on the year
  const yearNum = parseInt(year);
  if (!isNaN(yearNum)) {
    if (yearNum < 0) elements.timeContext = "ancient/prehistoric";
    else if (yearNum < 500) elements.timeContext = "ancient world";
    else if (yearNum < 1400) elements.timeContext = "medieval period";
    else if (yearNum < 1700) elements.timeContext = "renaissance era";
    else if (yearNum < 1900) elements.timeContext = "industrial revolution";
    else if (yearNum < 1950) elements.timeContext = "early 20th century";
    else if (yearNum < 2000) elements.timeContext = "late 20th century";
    else if (yearNum < 2100) elements.timeContext = "contemporary/near future";
    else elements.timeContext = "futuristic";
  }
  
  // If still no location, use time context
  if (!elements.location && elements.timeContext) {
    elements.location = `${elements.timeContext} ${yearNum < 2000 ? 'historical' : 'futuristic'} setting`;
  }
  
  // Extract notable objects - build a comprehensive list of common objects to detect
  const potentialObjects = [
    // Tech devices
    'phone', 'smartphone', 'computer', 'laptop', 'tablet', 'watch', 'headphones', 'earbuds',
    // Transportation
    'car', 'vehicle', 'bike', 'bicycle', 'motorcycle', 'train', 'plane', 'aircraft', 'ship', 'boat',
    // Food items
    'food', 'meal', 'breakfast', 'lunch', 'dinner', 'snack', 'drink', 'coffee', 'tea',
    // Specific cultural foods
    'pizza', 'burger', 'sandwich', 'pasta', 'noodles', 'rice', 'bread', 'cake', 'cookie', 'dosa', 'curry',
    // Time travel elements
    'time machine', 'portal', 'wormhole', 'device', 'gadget', 'invention', 'experiment',
    // Common items
    'book', 'paper', 'pen', 'pencil', 'bag', 'backpack', 'chair', 'table', 'desk', 'door', 'window'
  ];
  
  potentialObjects.forEach(obj => {
    if (description.toLowerCase().includes(obj.toLowerCase())) {
      elements.objects.push(obj);
    }
  });
  
  // If specific objects aren't found, look for general categories
  if (elements.objects.length === 0) {
    // Check for general object categories
    const categoryKeywords = {
      'technology': ['tech', 'device', 'electronic', 'digital', 'screen'],
      'clothing': ['wear', 'dress', 'cloth', 'fashion', 'outfit', 'costume'],
      'food': ['eat', 'food', 'meal', 'cuisine', 'dish', 'taste', 'flavor', 'cook'],
      'transportation': ['ride', 'drive', 'vehicle', 'transport']
    };
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (description.toLowerCase().includes(keyword)) {
          elements.objects.push(category);
          break;
        }
      }
    }
  }
  
  // Get main action from the story by identifying key verbs and themes
  const actionVerbs = [
    'teleported', 'traveled', 'jumped', 'transported', 'visited', 'arrived', 
    'discovered', 'explored', 'encountered', 'experienced', 'witnessed', 'observed',
    'shocked', 'surprised', 'amazed', 'frightened', 'confused'
  ];
  
  for (const verb of actionVerbs) {
    if (description.toLowerCase().includes(verb)) {
      elements.mainAction = description.substring(
        Math.max(0, description.toLowerCase().indexOf(verb) - 30),
        Math.min(description.length, description.toLowerCase().indexOf(verb) + 60)
      );
      break;
    }
  }
  
  // If no specific action found, create a generic time travel scenario
  if (!elements.mainAction) {
    elements.mainAction = `time traveler experiencing ${elements.timeContext || year} with ${elements.objects.length > 0 ? elements.objects.join(' and ') : 'surprising elements from different time periods'}`;
  }
  
  // Create a fitting text overlay
  if (description.length > 0) {
    // Try to create a catchy phrase based on the story content
    if (description.toLowerCase().includes('time') && description.toLowerCase().includes('travel')) {
      const foodItems = ['dosa', 'pizza', 'burger', 'sandwich', 'noodles', 'pasta', 'curry'];
      const foundFood = foodItems.find(food => description.toLowerCase().includes(food));
      
      if (foundFood) {
        elements.textOverlay = `Time Travel ${foundFood.charAt(0).toUpperCase() + foundFood.slice(1)}: One Bite Changes Everything!`;
      } else {
        elements.textOverlay = `Time Travel Adventure: ${year}!`;
      }
    } else if (description.toLowerCase().includes('future')) {
      elements.textOverlay = `Welcome to ${year}: The Future Awaits!`;
    } else if (description.toLowerCase().includes('past')) {
      elements.textOverlay = `Back to ${year}: History Comes Alive!`;
    } else {
      // Generic but catchy time travel text
      elements.textOverlay = `Time Jump to ${year}: When Worlds Collide!`;
    }
  } else {
    elements.textOverlay = `Time Travel to ${year}`;
  }
  
  return elements;
}

module.exports = { enhancePrompt };
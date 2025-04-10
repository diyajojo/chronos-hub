function enhancePrompt(year, description, survivalChance) {
  let era = '';
  const yearNum = parseInt(year);
  
  // Determine the time period for appropriate styling
  if (yearNum < 0) {
    era = 'prehistoric or ancient';
  } else if (yearNum < 500) {
    era = 'ancient Roman or early medieval';
  } else if (yearNum < 1400) {
    era = 'medieval';
  } else if (yearNum < 1700) {
    era = 'renaissance';
  } else if (yearNum < 1900) {
    era = 'industrial revolution';
  } else if (yearNum < 1950) {
    era = 'early 20th century';
  } else if (yearNum < 2000) {
    era = 'late 20th century';
  } else if (yearNum < 2100) {
    era = 'near future';
  } else if (yearNum < 3000) {
    era = 'futuristic';
  } else {
    era = 'far future utopian/dystopian';
  }
  
  let survivalContext = '';
  if (survivalChance < 30) {
    survivalContext = 'extremely dangerous, chaotic, threatening environment';
  } else if (survivalChance < 60) {
    survivalContext = 'challenging, risky, uncertain outcome';
  } else if (survivalChance < 85) {
    survivalContext = 'moderately safe but with visible hazards';
  } else {
    survivalContext = 'relatively safe, controlled environment';
  }
  
  return `Time traveler visiting the year ${year}, ${era} period: ${description}. 
Scene depicts ${survivalContext} with survival chance of ${survivalChance}%. 
Detailed cinematic scene with dramatic lighting, vivid colors, and high contrast. 
Include period-appropriate architecture, technology, and clothing. 
Mix of realistic and slightly exaggerated elements to create a memorable, believable yet slightly whimsical time travel experience.`;
}

module.exports = { enhancePrompt };

const getRating = async (year: string, description: string, imageUrl: string, survivalChance: number) => {
  try {
    const response = await fetch('http://localhost:8000/rateStory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year,
        description,
        imageUrl,
        survivalChance,
      }),
    });
    const data = await response.json();
    return data.success ? { rating: data.rating, survivalChance: data.survivalChance } : null;
  } catch (error) {
    console.error('Error getting rating:', error);
    return null;
  }
};

export default getRating;
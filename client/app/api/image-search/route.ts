import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
    console.error('Missing API credentials');
    return NextResponse.json({ error: 'Search configuration error' }, { status: 500 });
  }

  try {
    console.log('Fetching images for query:', query);
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google API error:', data);
      throw new Error(data.error?.message || 'Google API error');
    }

    if (!data.items?.length) {
      return NextResponse.json({ items: [] });
    }

    const items = data.items.map((item: any) => ({
      url: item.link,
      thumbnail: item.image.thumbnailLink,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

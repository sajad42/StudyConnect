const UNSPLASH_ACCESS_KEY = 'uqBghdSiD9kBj208VZoe3dHuTeE38P68MO_2UHdvQTw';

export const getUnsplashImage = async (query, groupId, width = 400, height = 200) => {
  try {
    const page = (groupId % 3) + 1; // Reduce to pages 1-3 for better results
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&page=${page}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    const data = await response.json();
    // console.log(`Query: "${query}", Page: ${page}, Results:`, data.results?.length || 0);
    
    // If no results, try a fallback search
    if (!data.results || data.results.length === 0) {
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=study&per_page=10&page=1`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      const fallbackData = await fallbackResponse.json();
      const fallbackIndex = groupId % (fallbackData.results?.length || 1);
      return fallbackData.results?.[fallbackIndex]?.urls?.regular || '/default-image.jpg';
    }
    
    const imageIndex = groupId % data.results.length;
    return data.results[imageIndex]?.urls?.regular || '/default-image.jpg';
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return '/default-image.jpg';
  }
};

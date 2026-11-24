const UNSPLASH_ACCESS_KEY = "uqBghdSiD9kBj208VZoe3dHuTeE38P68MO_2UHdvQTw";
const FALLBACK_IMAGE = "/og-image.png";
const CACHE_PREFIX = "studysync_img_";

export const getUnsplashImage = async (query, groupId) => {
  const cacheKey = `${CACHE_PREFIX}${groupId}_${query || "study"}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {
    // Ignore storage quota/privacy errors
  }

  try {
    const safeQuery = (query && query.trim()) || "study";
    const page = (Number(groupId || 0) % 3) + 1;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(safeQuery)}&per_page=10&page=${page}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return FALLBACK_IMAGE;
    }

    const data = await response.json();
    let imageUrl = FALLBACK_IMAGE;

    if (!data.results || data.results.length === 0) {
      const fallbackResponse = await fetch(
        "https://api.unsplash.com/search/photos?query=university+study&per_page=10&page=1",
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackIndex = Number(groupId || 0) % (fallbackData.results?.length || 1);
        imageUrl = fallbackData.results?.[fallbackIndex]?.urls?.small || FALLBACK_IMAGE;
      }
    } else {
      const imageIndex = Number(groupId || 0) % data.results.length;
      imageUrl = data.results[imageIndex]?.urls?.small || FALLBACK_IMAGE;
    }

    try {
      sessionStorage.setItem(cacheKey, imageUrl);
    } catch {
      // Ignore storage errors
    }

    return imageUrl;
  } catch {
    return FALLBACK_IMAGE;
  }
};

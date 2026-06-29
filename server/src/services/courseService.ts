interface CacheEntry {
  data: any;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 3600 * 1000; // 1 hour in ms

export const fetchPlaylistDetails = async (playlistId: string) => {
  const cacheKey = `playlist_${playlistId}`;
  
  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (Date.now() < entry.expiry) {
      return entry.data;
    }
    cache.delete(cacheKey); // Expired
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    throw new Error('YOUTUBE_API_KEY is not configured properly in .env');
  }

  // 1. Fetch Playlist Info
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`;
  const playlistResponse = await fetch(playlistUrl);
  const playlistData = (await playlistResponse.json()) as any;
  
  if (!playlistResponse.ok) {
     throw new Error(`YouTube API Error: ${playlistData.error?.message || 'Failed to fetch playlist'}`);
  }

  if (!playlistData.items || playlistData.items.length === 0) {
     throw new Error('Playlist not found');
  }
  const playlistInfo = playlistData.items[0];

  // 2. Fetch Playlist Items (Videos)
  let videos: any[] = [];
  let nextPageToken = '';
  
  do {
    const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    const itemsResponse = await fetch(itemsUrl);
    const itemsData = (await itemsResponse.json()) as any;
    
    if (!itemsResponse.ok) {
       throw new Error(`YouTube API Error: ${itemsData.error?.message || 'Failed to fetch playlist items'}`);
    }

    // Filter out private/deleted videos (they typically lack snippets or have specific titles)
    const validVideos = itemsData.items.filter((item: any) => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video');
    videos = [...videos, ...validVideos];
    
    nextPageToken = itemsData.nextPageToken || '';
  } while (nextPageToken);

  const result = {
     id: playlistInfo.id,
     title: playlistInfo.snippet.title,
     description: playlistInfo.snippet.description,
     channelTitle: playlistInfo.snippet.channelTitle,
     thumbnails: playlistInfo.snippet.thumbnails,
     videos: videos.map(v => ({
         id: v.contentDetails.videoId,
         title: v.snippet.title,
         description: v.snippet.description,
         thumbnails: v.snippet.thumbnails,
         position: v.snippet.position
     }))
  };

  cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL });
  return result;
}

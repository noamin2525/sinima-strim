import { API_BASE_URL, API_ACCESS_TOKEN } from '../constants.ts';
import { Media, MediaDetails, MediaType, Genre, PaginatedResponse } from '../types.ts';

interface FetchOptions {
  method: string;
  headers: {
    accept: string;
    Authorization: string;
  };
}

const options: FetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_ACCESS_TOKEN}`
  }
};

const fetchData = async <T,>(endpoint: string): Promise<T> => {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_BASE_URL}/${endpoint}${separator}language=he-IL`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getTrending = async (mediaType: MediaType = MediaType.All, timeWindow: 'day' | 'week' = 'week'): Promise<Media[]> => {
  const data = await fetchData<PaginatedResponse<Media>>(`trending/${mediaType}/${timeWindow}`);
  // Filter out people from trending results, as they don't fit the Media interface well and can cause errors.
  return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
};

export const getGenres = async (mediaType: MediaType.Movie | MediaType.TV): Promise<{ genres: Genre[] }> => {
    return await fetchData<{ genres: Genre[] }>(`genre/${mediaType}/list`);
}

export const getPopular = async (mediaType: MediaType.Movie | MediaType.TV, page: number = 1, genreId?: number): Promise<PaginatedResponse<Media>> => {
    const endpoint = genreId 
        ? `discover/${mediaType}?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
        : `${mediaType}/popular?page=${page}`;
    
    const data = await fetchData<PaginatedResponse<Media>>(endpoint);
    // Manually add media_type since the API doesn't return it on this endpoint
    return { 
        ...data, 
        results: data.results.map(item => ({ ...item, media_type: mediaType }))
    };
}

export const getTopRated = async (mediaType: MediaType.Movie | MediaType.TV, page: number = 1, genreId?: number): Promise<PaginatedResponse<Media>> => {
    const endpoint = genreId 
        ? `discover/${mediaType}?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=200&page=${page}`
        : `${mediaType}/top_rated?page=${page}`;
    
    const data = await fetchData<PaginatedResponse<Media>>(endpoint);
    // Manually add media_type since the API doesn't return it on this endpoint
    return {
        ...data,
        results: data.results.map(item => ({ ...item, media_type: mediaType }))
    };
}


export const getMediaDetails = async (mediaType: MediaType.Movie | MediaType.TV, id: number): Promise<MediaDetails> => {
    return await fetchData<MediaDetails>(`${mediaType}/${id}`);
}

export const searchMedia = async (query: string): Promise<Media[]> => {
    if (!query) return [];
    const data = await fetchData<PaginatedResponse<Media>>(`search/multi?query=${encodeURIComponent(query)}`);
    // Filter out people from search results
    return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
}

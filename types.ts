
// Fix: Moved MediaType enum before the interfaces that use it to allow referencing it.
export enum MediaType {
  Movie = 'movie',
  TV = 'tv',
  All = 'all',
}

export interface Genre {
  id: number;
  name: string;
}

export interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  // Fix: Updated media_type to use the MediaType enum for better type safety and consistency.
  media_type: MediaType.Movie | MediaType.TV;
  genre_ids: number[];
}

export interface MediaDetails extends Media {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  tagline: string;
}
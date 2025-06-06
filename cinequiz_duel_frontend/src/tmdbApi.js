//
// TMDb API integration utility for CineQuiz Duel
//

const TMDB_API_KEY = '5bc67d3b06aecbd18121a3cbbc16eb59';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

/**
 * Helper to fetch with error handling.
 */
async function fetchTMDb(endpoint, params = {}) {
  // Add API key to params
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`TMDb API error: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

// PUBLIC_INTERFACE
/**
 * Fetch a list of movies (discover).
 * @param {object} options - Additional query params (e.g., with_genres, sort_by, region, language)
 * @returns {Promise<object>} Movies data
 */
export async function fetchMovies(options = {}) {
  return fetchTMDb('/discover/movie', options);
}

// PUBLIC_INTERFACE
/**
 * Fetch details of a specific movie by ID.
 * @param {number|string} movieId
 * @param {object} options - Additional params (e.g., language)
 * @returns {Promise<object>} Movie details
 */
export async function fetchMovieDetails(movieId, options = {}) {
  return fetchTMDb(`/movie/${movieId}`, options);
}

// PUBLIC_INTERFACE
/**
 * Fetch credits (cast, crew) for a movie.
 * @param {number|string} movieId
 * @param {object} options
 * @returns {Promise<object>} Credits object with cast and crew
 */
export async function fetchMovieCredits(movieId, options = {}) {
  return fetchTMDb(`/movie/${movieId}/credits`, options);
}

// PUBLIC_INTERFACE
/**
 * Fetch the poster full URL from poster path.
 * @param {string} posterPath - Path returned by API (poster_path)
 * @param {string} size - (e.g., 'w500', 'original'). Default: 'w500'
 * @returns {string|null} Full image URL, or null if no path
 */
export function getPosterUrl(posterPath, size = 'w500') {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${posterPath}`;
}

// PUBLIC_INTERFACE
/**
 * Search movies by title or keyword.
 * @param {string} query - Movie name, keyword, etc.
 * @param {object} options - Additional search params
 * @returns {Promise<object>} Search results
 */
export async function searchMovies(query, options = {}) {
  if (!query) throw new Error('Missing search query');
  return fetchTMDb('/search/movie', { query, ...options });
}

// PUBLIC_INTERFACE
/**
 * Fetch trending movies (daily or weekly).
 * @param {'day'|'week'} timeWindow
 * @param {object} options
 * @returns {Promise<object>} Trending movies
 */
export async function fetchTrendingMovies(timeWindow = 'week', options = {}) {
  return fetchTMDb(`/trending/movie/${timeWindow}`, options);
}

// PUBLIC_INTERFACE
/**
 * Fetch single movie images (backdrops, posters).
 * @param {number|string} movieId
 * @param {object} options
 * @returns {Promise<object>} {backdrops, posters, ...}
 */
export async function fetchMovieImages(movieId, options = {}) {
  return fetchTMDb(`/movie/${movieId}/images`, options);
}

// PUBLIC_INTERFACE
/**
 * Fetch similar movies for quiz options or suggestions.
 * @param {number|string} movieId
 * @param {object} options
 * @returns {Promise<object>} Similar movies
 */
export async function fetchSimilarMovies(movieId, options = {}) {
  return fetchTMDb(`/movie/${movieId}/similar`, options);
}

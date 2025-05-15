import axios from 'axios';

const API_KEY = 'b160f17cde01237a734f1ec04d308dda';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 5000, // 5 seconds timeout
});

const handleError = (error) => {
  if (error.response) {
    // Server responded with a status code outside 2xx
    console.error('API Error:', error.response.status, error.response.data);
    throw new Error(error.response.data.status_message || 'API request failed');
  } else if (error.request) {
    // Request made but no response received
    console.error('API Error: No response received');
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request
    console.error('API Error:', error.message);
    throw new Error('Failed to make request. Please try again.');
  }
};

export const fetchTrending = async (page = 1, timeWindow = 'week') => {
  try {
    const { data } = await api.get(`/trending/all/${timeWindow}`, { 
      params: { page } 
    });
    return {
      results: data.results || [], // Ensure we always return an array
      totalPages: data.total_pages > 500 ? 500 : data.total_pages,
      currentPage: data.page,
      totalResults: data.total_results || 0
    };
  } catch (error) {
    handleError(error);
    return { results: [], totalPages: 1, currentPage: 1, totalResults: 0 };
  }
};

export const fetchMovies = async (page = 1) => {
  try {
    const { data } = await api.get('/movie/popular', { params: { page } });
    return {
      results: data.results,
      totalPages: data.total_pages,
      currentPage: data.page,
    };
  } catch (error) {
    handleError(error);
  }
};

export const fetchTvShows = async (page = 1) => {
  try {
    const { data } = await api.get('/tv/popular', { params: { page } });
    return {
      results: data.results,
      totalPages: data.total_pages,
      currentPage: data.page,
    };
  } catch (error) {
    handleError(error);
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const { data } = await api.get(`/movie/${id}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchTvShowDetails = async (id) => {
  try {
    const { data } = await api.get(`/tv/${id}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const searchContent = async (query, page = 1) => {
  try {
    const { data } = await api.get('/search/multi', {
      params: { query, page },
    });
    return {
      results: data.results,
      totalPages: data.total_pages,
      currentPage: data.page,
    };
  } catch (error) {
    handleError(error);
  }
};
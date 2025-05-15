import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Grid, 
  Typography, 
  Box, 
  Pagination, 
  Alert,
  CircularProgress 
} from '@mui/material';
import MovieCard from './MovieCard';
import { fetchMovies } from '../services/api';

const Movies = () => {
  const [moviesData, setMoviesData] = useState({
    results: [],
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies(page);
      setMoviesData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (event, value) => {
    fetchData(value);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Popular Movies
      </Typography>
      
      {loading && moviesData.results.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {moviesData.results.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard item={movie} type="movie" />
              </Grid>
            ))}
            {loading && moviesData.results.length > 0 && (
              Array.from(new Array(4)).map((_, index) => (
                <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard isLoading />
                </Grid>
              ))
            )}
          </Grid>
          
          {moviesData.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={moviesData.totalPages > 500 ? 500 : moviesData.totalPages} // TMDB API limits to 500 pages
                page={moviesData.currentPage}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Movies;
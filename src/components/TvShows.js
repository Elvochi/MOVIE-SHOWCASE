import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Pagination, 
  Alert,
  CircularProgress 
} from '@mui/material';
import MovieCard from './MovieCard';
import { fetchTvShows } from '../services/api';

const TvShows = () => {
  const [tvShowsData, setTvShowsData] = useState({
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
      const data = await fetchTvShows(page);
      setTvShowsData(data);
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
        Popular TV Shows
      </Typography>
      
      {loading && tvShowsData.results.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {tvShowsData.results.map((show) => (
              <Grid item key={show.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard item={show} type="tvshow" />
              </Grid>
            ))}
            {loading && tvShowsData.results.length > 0 && (
              Array.from(new Array(4)).map((_, index) => (
                <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard isLoading />
                </Grid>
              ))
            )}
          </Grid>
          
          {tvShowsData.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={tvShowsData.totalPages > 500 ? 500 : tvShowsData.totalPages}
                page={tvShowsData.currentPage}
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

export default TvShows;
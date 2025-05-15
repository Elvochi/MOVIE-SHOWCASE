import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Alert,
  CircularProgress 
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import { fetchTrending } from '../services/api';

const Home = () => {
  const [trendingData, setTrendingData] = useState({
    results: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const getTrending = async () => {
      try {
        setTrendingData(prev => ({ ...prev, loading: true, error: null }));
        const data = await fetchTrending();
        setTrendingData({
          results: data?.results || [],
          loading: false,
          error: null
        });
      } catch (error) {
        setTrendingData({
          results: [],
          loading: false,
          error: error.message
        });
      }
    };
    getTrending();
  }, []);

  if (trendingData.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{trendingData.error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trending This Week
      </Typography>
      
      {trendingData.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {trendingData.results.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard 
                item={item} 
                type={item.media_type === 'tv' ? 'tvshow' : 'movie'} 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Home;
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Pagination,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Stack,
  Skeleton
} from '@mui/material';
import MovieCard from './MovieCard';
import { fetchTrending } from '../services/api';

const Trending = () => {
  const [trendingData, setTrendingData] = useState({
    results: [],
    totalPages: 1,
    currentPage: 1,
    totalResults: 0
  });
  const [timeWindow, setTimeWindow] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState('all'); // 'all', 'movie', 'tv'

  const fetchData = async (page = 1, window = timeWindow, type = mediaType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrending(page, window);
      
      // Filter results by media type if not 'all'
      const filteredResults = type === 'all' 
        ? data.results 
        : data.results.filter(item => item.media_type === type);
      
      setTrendingData({
        ...data,
        results: filteredResults,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeWindow, mediaType]);

  const handlePageChange = (event, value) => {
    fetchData(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTimeWindowChange = (event, newValue) => {
    setTimeWindow(newValue === 0 ? 'week' : 'day');
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    setTrendingData(prev => ({ ...prev, currentPage: 1 }));
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => fetchData()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" component="h1">
          Trending
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tabs 
            value={timeWindow === 'week' ? 0 : 1} 
            onChange={handleTimeWindowChange}
            sx={{ minHeight: 'auto' }}
          >
            <Tab label="This Week" sx={{ py: 0, minHeight: 'auto' }} />
            <Tab label="Today" sx={{ py: 0, minHeight: 'auto' }} />
          </Tabs>
          
          <Stack direction="row" spacing={1}>
            <Chip 
              label="All" 
              onClick={() => handleMediaTypeChange('all')}
              color={mediaType === 'all' ? 'primary' : 'default'}
              variant={mediaType === 'all' ? 'filled' : 'outlined'}
            />
            <Chip 
              label="Movies" 
              onClick={() => handleMediaTypeChange('movie')}
              color={mediaType === 'movie' ? 'primary' : 'default'}
              variant={mediaType === 'movie' ? 'filled' : 'outlined'}
            />
            <Chip 
              label="TV Shows" 
              onClick={() => handleMediaTypeChange('tv')}
              color={mediaType === 'tv' ? 'primary' : 'default'}
              variant={mediaType === 'tv' ? 'filled' : 'outlined'}
            />
          </Stack>
        </Box>
      </Box>

      {loading && trendingData.results.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {trendingData.totalResults.toLocaleString()} results
          </Typography>
          
          {trendingData.results.length === 0 ? (
            <Alert severity="info">
              No trending {mediaType === 'all' ? 'content' : mediaType + 's'} found. Try a different filter.
            </Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {trendingData.results.map((item) => (
                  <Grid item key={`${item.id}-${item.media_type}`} xs={12} sm={6} md={4} lg={3}>
                    <MovieCard
                      item={item}
                      type={item.media_type === 'tv' ? 'tvshow' : 'movie'}
                    />
                  </Grid>
                ))}
                
                {loading && trendingData.results.length > 0 && (
                  Array.from(new Array(4)).map((_, index) => (
                    <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
                      <MovieCard isLoading />
                    </Grid>
                  ))
                )
              }
              </Grid>

              {trendingData.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={trendingData.totalPages}
                    page={trendingData.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    disabled={loading}
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Trending;
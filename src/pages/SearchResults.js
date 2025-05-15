import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Grid, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Pagination, 
  Alert,
  CircularProgress 
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import { searchContent } from '../services/api';

const SearchResults = () => {
  const { query } = useParams();
  const [resultsData, setResultsData] = useState({
    results: [],
    totalPages: 1,
    currentPage: 1,
  });
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchContent(query, page);
      setResultsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchData();
    }
  }, [query]);

  const handlePageChange = (event, newValue) => {
    fetchData(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const filteredResults = resultsData.results.filter(item => {
    if (value === 0) return true; // All
    if (value === 1) return item.media_type === 'movie';
    if (value === 2) return item.media_type === 'tv';
    return true;
  });

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
        Search Results for "{query}"
      </Typography>
      
      <Tabs value={value} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All" />
        <Tab label="Movies" />
        <Tab label="TV Shows" />
      </Tabs>

      {loading && resultsData.results.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {filteredResults.length === 0 ? (
            <Typography>No results found</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {filteredResults.map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                    <MovieCard 
                      item={item} 
                      type={item.media_type === 'tv' ? 'tvshow' : 'movie'} 
                    />
                  </Grid>
                ))}
                {loading && resultsData.results.length > 0 && (
                  Array.from(new Array(4)).map((_, index) => (
                    <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
                      <MovieCard isLoading />
                    </Grid>
                  ))
                )}
              </Grid>
              
              {resultsData.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={resultsData.totalPages > 500 ? 500 : resultsData.totalPages}
                    page={resultsData.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    disabled={loading}
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

export default SearchResults;
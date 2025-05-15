import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Chip, 
  Stack, 
  Divider, 
  Paper, 
  Alert,
  CircularProgress,
  Skeleton 
} from '@mui/material';
import { fetchMovieDetails } from '../services/api';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getMovieDetails();
  }, [id]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (loading || !movie) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flexShrink: 0 }}>
            <Skeleton variant="rectangular" width={300} height={450} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={60} />
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Skeleton variant="rounded" width={80} height={32} />
              <Skeleton variant="rounded" width={100} height={32} />
              <Skeleton variant="rounded" width={100} height={32} />
            </Stack>
            <Skeleton variant="text" height={100} />
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" width="20%" height={40} />
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" width={80} height={32} />
              ))}
            </Stack>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flexShrink: 0 }}>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'
            }
            alt={movie.title}
            style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
          />
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            {movie.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={movie.release_date?.substring(0, 4) || 'N/A'} />
            <Chip label={`${movie.runtime} min`} />
            <Chip label={`Rating: ${movie.vote_average?.toFixed(1)}`} />
          </Stack>
          <Typography variant="body1" paragraph>
            {movie.overview}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Genres
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {movie.genres?.map((genre) => (
              <Chip key={genre.id} label={genre.name} />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default MovieDetail;
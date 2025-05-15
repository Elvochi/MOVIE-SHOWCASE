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
import { fetchTvShowDetails } from '../services/api';

const TvShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTvShowDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTvShowDetails(id);
        setShow(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getTvShowDetails();
  }, [id]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (loading || !show) {
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
              <Skeleton variant="rounded" width={120} height={32} />
              <Skeleton variant="rounded" width={120} height={32} />
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
            <Skeleton variant="text" width="20%" height={40} />
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {[1, 2].map((i) => (
                <Skeleton key={i} variant="rounded" width={120} height={32} />
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
              show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'
            }
            alt={show.name}
            style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
          />
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            {show.name}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={show.first_air_date?.substring(0, 4) || 'N/A'} />
            <Chip label={`Seasons: ${show.number_of_seasons}`} />
            <Chip label={`Episodes: ${show.number_of_episodes}`} />
            <Chip label={`Rating: ${show.vote_average?.toFixed(1)}`} />
          </Stack>
          <Typography variant="body1" paragraph>
            {show.overview}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Genres
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {show.genres?.map((genre) => (
              <Chip key={genre.id} label={genre.name} />
            ))}
          </Stack>
          <Typography variant="h6" gutterBottom>
            Networks
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {show.networks?.map((network) => (
              <Chip 
                key={network.id} 
                label={network.name}
                avatar={network.logo_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${network.logo_path}`} 
                    alt={network.name}
                    style={{ width: 24, height: 24 }}
                  />
                ) : undefined}
              />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default TvShowDetail;
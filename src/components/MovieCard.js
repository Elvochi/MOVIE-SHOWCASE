import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardMedia, CardContent, Typography, CardActionArea, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';

const MovieCard = ({ item, type, isLoading }) => {
  if (isLoading) {
    return (
      <Card sx={{ maxWidth: 345, height: '100%' }}>
        <Skeleton variant="rectangular" height={500} />
        <CardContent>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    );
  }

  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} to={`/${type}/${item.id}`} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="500"
          image={imageUrl}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

MovieCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
  }),
  type: PropTypes.oneOf(['movie', 'tvshow']).isRequired,
  isLoading: PropTypes.bool,
};

MovieCard.defaultProps = {
  isLoading: false,
};

export default MovieCard;
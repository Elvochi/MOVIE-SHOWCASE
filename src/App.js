import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Movies from './components/Movies';
import TvShows from './components/TvShows';
import MovieDetail from './pages/MovieDetail';
import TvShowDetail from './pages/TvShowDetail';
import SearchResults from './pages/SearchResults';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tvshow/:id" element={<TvShowDetail />} />
          <Route path="/search/:query" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import "./movieApp.css";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list",
          {
            params: {
              api_key: "cfc460f0907aef3591ef558f87083829",
            },
          }
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: "cfc460f0907aef3591ef558f87083829",
              sort_by: sortBy,
              page: 1,
              with_genres: selectedGenre,
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: "cfc460f0907aef3591ef558f87083829",
            query: searchQuery,
          },
        }
      );

      let results = response.data.results;

      if (selectedGenre) {
        results = results.filter((movie) =>
          movie.genre_ids.includes(Number(selectedGenre))
        );
      }

      if (sortBy === "popularity.desc") {
        results.sort((a, b) => b.popularity - a.popularity);
      } else if (sortBy === "popularity.asc") {
        results.sort((a, b) => a.popularity - b.popularity);
      } else if (sortBy === "vote_average.desc") {
        results.sort((a, b) => b.vote_average - a.vote_average);
      } else if (sortBy === "vote_average.asc") {
        results.sort((a, b) => a.vote_average - b.vote_average);
      } else if (sortBy === "release_date.desc") {
        results.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
      } else if (sortBy === "release_date.asc") {
        results.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
      }

      setMovies(results);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  return (
    <div>
      <h1>MovieStore</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Movie...."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={handleSearchSubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>

      <div className="filters">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>

        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="movie-wrapper">
        {movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p>Release: {movie.release_date}</p>
              <p>Rating: {movie.vote_average}</p>
              {expandedMovieId === movie.id ? (
                <>
                  <p>{movie.overview}</p>
                  <button onClick={() => setExpandedMovieId(null)}>
                    Show Less
                  </button>
                </>
              ) : (
                <>
                  <p>{movie.overview?.substring(0, 150)}...</p>
                  <button onClick={() => setExpandedMovieId(movie.id)}>
                    Read More
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

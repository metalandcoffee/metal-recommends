import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 *
 * Test Cases:
 * Tora
 * Doja Cat
 * Cult of Luna
 * Opeth
 * Parcels
 * Lil Nas X
 */

/**
 * Search Bar Component.
 */
const SearchBar = ({ onSubmit }) => {
  // Track current search term locally until form is submitted.
  const [localTerm, setLocalTerm] = useState('');
  const handleChange = (e) => {
    setLocalTerm(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localTerm);
  };
  return (
    <form onSubmit={handleSubmit}>
      <SearchIcon />
      <input
        type="text"
        id="s"
        value={localTerm}
        onChange={handleChange}
        placeholder="Metal Recommends..."
      />
    </form>
  );
};

const SearchIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
    </svg>
  );
};

/**
 * Display Results Component.
 */
const Results = ({ term }) => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (!term) {
      return;
    }

    /**
     * Get aimiliar artists based on search term (artist).
     *
     * Similar Artists Endpoint.
     * @link https://www.last.fm/api/show/artist.getSimilar
     * @link http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${term.toLowerCase()}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=9
     */
    const getArtists = async () => {/* insert code here */};

    /**
     * Get top album based on given artist.
     *
     * Top Albums by Given Artist Endpoint.
     * @link https://www.last.fm/api/show/artist.getTopAlbums
     * @link http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=1
     *
     * @param {string} artist
     */
    const getTopAlbum = async (artist) => {/* insert code here */};

    /**
     * Call APIs and properly set artists state variable.
     * 
     * Hint: Mapping for data restructuring
     * {
          name: artist.name,
          albumTitle:
            0 < album?.topalbums?.album?.length
              ? album.topalbums.album[0].name
              : 'N/A',
          image:
            album?.topalbums?.album?.[0] && '' !== album.topalbums.album[0].image[3]['#text']
              ? album.topalbums.album[0].image[3]['#text']
              : 'https://via.placeholder.com/300',
        }
     */
    const fetchAndSetResults = async () => {/* insert code here */};

    fetchAndSetResults().catch(console.error);
  }, [term]);
  return (
    <ul id="results">
      {0 < artists.length ? (
        artists.map((artist) => {
          return (
            <li key={artist.name}>
              <img src={artist.image} alt={artist.albumTitle} />
              <p>{artist.name}</p>
              <p>{artist.albumTitle}</p>
            </li>
          );
        })
      ) : term ? (
        <p>No results for {term}</p>
      ) : (
        <p>
          Type in an artist to receive album recommendations from similar
          artists✨
        </p>
      )}
    </ul>
  );
};

/**
 * App Entrypoint Component.
 */
const App = () => {
  const [term, setTerm] = useState('');
  const updateSearchTerm = (term) => {
    setTerm(term);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="screen-reader-text">Metal Recommends...</h1>
        <SearchBar onSubmit={updateSearchTerm} />
      </header>
      <Results term={term} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

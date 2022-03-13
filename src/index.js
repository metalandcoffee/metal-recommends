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
      <input type="text" id="s" value={localTerm} onChange={handleChange} />
    </form>
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

    const getArtists = async () => {
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${term.toLowerCase()}&api_key=${
          process.env.REACT_APP_LAST_FM_API_KEY
        }&format=json&limit=9`
      );
      const resultsPromise = response.json();
      return resultsPromise;
    };
    const getAlbum = async (artist) => {
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=1`
      );
      const resultsPromise = response.json();
      return resultsPromise;
    };

    const fetchAndSetResults = async () => {
      const results = await getArtists();
      const artists = results.similarartists.artist;
      const artistsTopAlbum = await Promise.all(
        artists.map(async (artist) => {
          const album = await getAlbum(artist);
          return {
            name: artist.name,
            albumTitle:
              0 < album?.topalbums?.album?.length
                ? album.topalbums.album[0].name
                : 'N/A',
            image:
            album?.topalbums?.album?.[0] && '' !== album.topalbums.album[0].image[3]['#text']
                ? album.topalbums.album[0].image[3]['#text']
                : 'https://via.placeholder.com/300',
          };
        })
      );
      setArtists(artistsTopAlbum);
    };

    fetchAndSetResults().catch(console.error);
  }, [term]);
  return (
    <ul id="results">
      {0 < artists.length
        ? artists.map((artist) => {
            return (
              <li key={artist.name}>
                <img src={artist.image} alt={artist.albumTitle} />
                <p>{artist.name}</p>
                <p>{artist.albumTitle}</p>
              </li>
            );
          })
        : 'Type in an artist to receive album recommendations from similar artists✨'}
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
        <h1>Metal Recommends...</h1>
      </header>
      <SearchBar onSubmit={updateSearchTerm} />
      <Results term={term} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

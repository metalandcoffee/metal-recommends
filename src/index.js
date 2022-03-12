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
 * Lil Nas
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
  const [artists, setArtists] = useState('Type in an artist to receive recommendations✨');
  useEffect(() => {
    if (!term) {
      return;
    }

    const getArtists = async () => {
      const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${term.toLowerCase()}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=5`);
      const resultsPromise = response.json();
      return resultsPromise;
    }
    const getAlbums = async (artist) => {
      const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=1`);
      const resultsPromise = response.json();
      return resultsPromise;
    }
    // @link https://stackoverflow.com/questions/65655885/why-does-using-async-await-in-map-function-still-return-promises-and-not-the-res
    const setAlbumForArtists = async (results) => {
      const artists = results.similarartists.artist;
      const albums = await Promise.all(
        artists.map(async artist => {
          const album = await getAlbums(artist);
          return album;
        })
      );
      console.log(albums);
      // let artistsTopAlbum = artists.map(async (artist) => {
      //   const data = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=1`)
      //     .then(response => response.json());
      //   return {
      //     name: artist.name,
      //     albumTitle: undefined !== data.topalbums && 0 < data.topalbums.album.length ? data.topalbums.album[0].name : 'N/A',
      //     image: undefined !== data.topalbums && 0 < data.topalbums.album.length ? data.topalbums.album[0].image[3]['#text'] : 'https://via.placeholder.com/300'
      //   };
      //});
      //return await Promise.all(artistsTopAlbum);
    }

    console.log(term);
    const fetchData = async () => {
      const results = await getArtists();
      setAlbumForArtists(results);
      
      //setArtists(await getArtists());
    }

    fetchData().catch(console.error);
  }, [term]);
  console.log(artists);
  return (
    <ul id="results">{Array.isArray(artists) ? artists.map(artist => {
      return (
        <li key={artist.name}>
          <img src={artist.image} alt={artist.albumTitle} />
          <p>{artist.name}</p>
          <p>{artist.albumTitle}</p>
        </li>

      )
    }) : artists}</ul>
  )
}

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

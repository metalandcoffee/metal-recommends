import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Helper function to get top album artwork for queried artists.
// @link https://stackoverflow.com/questions/65655885/why-does-using-async-await-in-map-function-still-return-promises-and-not-the-res
async function setAlbumArtworks(artists) {
  let artistsTopAlbum = await artists.map( async (artist) => {
    const data = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist.name}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=1`)
    .then(response => response.json())
    .then(data => (data));
    //console.log(topAlbum);
    return {
      name: artist.name,
      albumTitle: undefined === data.topalbums ? data.topalbums.album[0].name : 'N/A',
      image: data.topalbums.album[0].image[3]['#text']
    };
  });
  artistsTopAlbum = await Promise.all(artistsTopAlbum);
  console.log(artistsTopAlbum);
  return artistsTopAlbum;
}

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
    console.log(term);
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${term.toLowerCase()}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=5`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const formattedArtists = async () => {
          const artists = await setAlbumArtworks(data.similarartists.artist);
          setArtists(artists);
        }
        formattedArtists().catch(console.error);
      });
  }, [term]);

  return (
    <div id="results">{Array.isArray(artists) ? artists.map(artist => {
      return (
        <li key={artist.name}>
          <img src={artist.image} alt={artist.albumTitle} />
          <p>{artist.name}</p>
          <p>{artist.albumTitle}</p>
        </li>
        
      )
    }) : artists}</div>
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

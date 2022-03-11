import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

const Results = ({ term }) => {
  const [artists, setArtists] = useState('Type in an artist to receive recommendations✨');
  useEffect(() => {
    if (!term) {
      return;
    }
    console.log(term);
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${term.toLowerCase()}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json&limit=20`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setArtists(data.similarartists.artist);
      });
  }, [term]);
  return (
    <div id="results">{Array.isArray(artists) ? artists.map( artist => {
      return (
        <>
          <p>{ artist.name }</p>
          <img src={artist.image[1]['#text']} alt="" />
        </>
      )
    }) : artists }</div>
  )
}

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

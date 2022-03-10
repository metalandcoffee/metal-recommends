import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const SearchBar = ({ onChange }) => {
  // Track current search term locally until form is submitted.
  const [localTerm, setLocalTerm] = useState('');
  const handleChange = (e) => {
    setLocalTerm(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(localTerm);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="s" value={localTerm} onChange={handleChange} />
    </form>
  );
};

const App = () => {
  const [term, setTerm] = useState('');
  console.log(term);
  const updateSearchTerm = (term) => {
    setTerm(term);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Metal Recommends...</h1>
      </header>
      <SearchBar term={term} onChange={updateSearchTerm} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

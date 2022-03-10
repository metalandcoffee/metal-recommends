import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const SearchBar = ({ term, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return <input type="text" id="s" value={term} onChange={handleChange} />;
};

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
      <SearchBar term={term} onChange={updateSearchTerm} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

import React, { useState } from "react";
import "../styles/SearchBar.css"; // Import CSS file
import SearchFilter from "./SearchFilter";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Serial Number...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button type="button" className="clear-btn" onClick={handleClear}>
            ✕
          </button>
        )}
        <button type="submit" className="search-btn">🔍</button>
      </form>
      <SearchFilter />  
    </div>
    
  );
};

export default SearchBar;

import React, { useState } from "react";
import "../styles/SearchBar.css"; // Import CSS file
import SearchFilter from "./SearchFilter";

interface SearchBarProps {
  placeholder?: string;
  handleSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Serial Number...", handleSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery("");
    handleSearch("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4 search-container w-full search-container">
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

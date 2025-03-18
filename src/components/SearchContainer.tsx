import SearchBar from "./SearchBar"
import "../styles/SearchContainer.css"
import SearchFilter from "./SearchFilter";

interface SearchContainerProps {
  handleSearch: (query:string) => void;
}

const SearchContainer = ({ handleSearch}: SearchContainerProps) => {

  return (
    <div className="search-container">
      <SearchBar onSearch={handleSearch}/>
s
    </div>
  )
}

export default SearchContainer

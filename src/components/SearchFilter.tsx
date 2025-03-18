import { useState } from "react";

interface searchFilterProps {

}

const SearchFilter = ({}:searchFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const regions = ["Aveiro", "Porto", "Lisbon"];

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        Region ▼
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {regions.map((region) => (
            <li key={region} className="dropdown-item">
              {region}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchFilter

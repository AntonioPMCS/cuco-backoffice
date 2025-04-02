import SearchBar from "../components/SearchBar"
import { Outlet } from "react-router-dom"

const Devices = () => {

  const handleSearch = (query:string) => {
    console.log("Search query: "+query)
  }
  return (
    <div className="flex flex-col justify-between items-center gap-5">
      <SearchBar handleSearch={handleSearch} />
      <Outlet />
    </div>
  ) 
}

export default Devices

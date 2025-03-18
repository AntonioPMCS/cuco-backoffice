import SearchBar from "../components/SearchBar"
import DevicesTable from "../components/DevicesTable"

const Devices = () => {

  const handleSearch = (query:string) => {
    console.log("Search query: "+query)
  }
  return (
    <div>
      <SearchBar handleSearch={handleSearch} />
      <DevicesTable />
    </div>
  ) 
}

export default Devices

import SearchBar from "../components/SearchBar"
import DeviceManager from "../components/DeviceManager"

const Devices = () => {

  const handleSearch = (query:string) => {
    console.log("Search query: "+query)
  }
  return (
    <div className="flex flex-col justify-between items-center gap-4">
      <SearchBar handleSearch={handleSearch} />
      <DeviceManager />
    </div>
  ) 
}

export default Devices

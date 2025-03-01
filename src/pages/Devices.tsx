import SearchBar from "../components/SearchBar"

const Devices = () => {

  const handleSearch = (query:string) => {
    console.log("Search query: "+query)
  }
  return (
    <div>
      <SearchBar onSearch={handleSearch}/>
    </div>
  )
}

export default Devices

import SearchContainer from "../components/SearchContainer"
import DevicesTable from "../components/DevicesTable"

const Devices = () => {

  const handleSearch = (query:string) => {
    console.log("Search query: "+query)
  }
  return (
    <div>
      <SearchContainer handleSearch={handleSearch} />
      <DevicesTable />
    </div>
  )
}

export default Devices

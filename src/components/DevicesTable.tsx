import "../styles/DevicesTable.css"
import useBlockchain from '../hooks/useBlockchain'

const DevicesTable = () => {

  const { fetchedDevices } = useBlockchain();

  return (
    <div className="table-container">
      <table className="devices-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Admin Region</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {fetchedDevices.map((device) => (
            <tr key={device.sn}>
              <td>{device.sn}</td>
              <td>{device.region}</td>
              <td>{device.locked ? "Locked" : "Unlocked"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DevicesTable

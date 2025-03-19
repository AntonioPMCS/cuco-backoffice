import "../styles/DevicesTable.css"
import useBlockchain from '../hooks/useBlockchain'
import { truncateMiddle } from "../utils";

const DevicesTable = () => {

  const { fetchedDevices } = useBlockchain();

  return (
    <div className="table-container">
      <table className="devices-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Customer</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {fetchedDevices.map((device) => (
            <tr key={device.sn}>
              <td>{truncateMiddle(device.sn)}</td>
              <td>{device.customer}</td>
              <td>{device.locked ? "Locked" : "Unlocked"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DevicesTable

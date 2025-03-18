import { useState } from "react"
import { devices } from "../../mocks/deviceList";

export interface DeviceType {
  sn: string,
  region: string,
  locked: boolean,
}

const useBlockchain = () => {
  const [fetchedDevices, setFetchedDevices] = useState<Array<DeviceType>>(devices);

  return { fetchedDevices }
}

export default useBlockchain

import { useCallback, useState } from "react"
import { devices } from "../../mocks/deviceList";

export interface DeviceType {
  sn: string,
  customer: string,
  locked: boolean,
}

const useBlockchain = () => {
  const [fetchedDevices, setFetchedDevices] = useState<Array<DeviceType>>(devices);

  const fetchDevices = useCallback(async() => {
    /*setLoading(true);
    setError(null); --> implement error handling later */

    try {
      //const response = await fetch()
    } catch (error) {

    }
  })

  return { fetchedDevices }
}

export default useBlockchain

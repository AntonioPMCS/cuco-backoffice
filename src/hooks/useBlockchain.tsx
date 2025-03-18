import { useCallback, useState, useEffect } from "react"
import { devices } from "../../mocks/deviceList";
import { useWalletProviders } from "./useWalletProviders";
import { Contract, ethers } from "ethers";

export interface DeviceType {
  sn: string,
  customer: string,
  locked: boolean,
}

const useBlockchain = () => {
  const { ethersProvider } = useWalletProviders();
  const [fetchedDevices, setFetchedDevices] = useState<Array<DeviceType>>(devices);

  const fetchDevices = useCallback(async() => {
    /*setLoading(true);
    setError(null); --> implement error handling later */
    try {
      if (!ethersProvider) return;
      console.log("Fetching device state...")
      const contractABI = [
        "function deviceState() public view returns (uint256)"
      ];
      const contractAddress = import.meta.env.VITE_DEVICE_ADDRESS; // Replace with your contract's address
      const contract = new Contract(contractAddress, contractABI, ethersProvider);
      const data = await contract.deviceState();
      console.log("State: ", data);
    } catch (error) {
      console.log(error);
    }
  }, [ethersProvider])

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { fetchedDevices }
}

export default useBlockchain

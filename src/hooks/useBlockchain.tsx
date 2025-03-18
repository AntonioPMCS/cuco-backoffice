import { useCallback, useState, useEffect } from "react"
import { devices } from "../../mocks/deviceList";
import { useWalletProviders } from "./useWalletProviders";
import { Contract } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";

export interface DeviceType {
  sn: string,
  customer: string,
  locked: boolean,
}

const useBlockchain = () => {
  const { ethersProvider } = useWalletProviders();
  const [fetchedDevices, setFetchedDevices] = useState<Array<DeviceType>>(devices);
  
  const getBalance = async (address:string) => {
    if (!ethersProvider) return null;
    return await ethersProvider.getBalance(address);
  }
  const fetchDevices = useCallback(async() => {
    /*setLoading(true);
    setError(null); --> implement error handling later */
    try {
      if (!ethersProvider) return;
      console.log("Fetching devices..")
      const contractAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_ADDRESS; // Replace with your contract's address
      const contract = new Contract(contractAddress, CuCoBlockchain.abi, ethersProvider);
      const rootCustomer:string = (await contract.getCustomers())[0];
      console.log("Root Customer: ", rootCustomer)
      const devices:string[] = await contract.getDevicesUnderCustomer(rootCustomer);
      console.log("Devices: ", devices);
    } catch (error) {
      console.log(error);
    }
  }, [ethersProvider])

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { fetchedDevices, getBalance }
}

export default useBlockchain

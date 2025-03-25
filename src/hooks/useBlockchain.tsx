import { useCallback, useState, useEffect } from "react"
import { useWalletProviders } from "./useWalletProviders";
import { Contract } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Device from "../../abi/Device.json";

export interface DeviceType {
  sn: string,
  customer: string,
  locked: boolean,
}

const useBlockchain = () => {
  const { ethersProvider, chainId } = useWalletProviders();
  const [fetchedDevices, setFetchedDevices] = useState<Array<DeviceType>>([]);

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

      // For each device address we get its members and create an object
      // Fetch all device instances concurrently and wait for them to resolve
      const deviceObjects: Array<DeviceType> = await Promise.all(
        devices.map((deviceAddress) => fetchDeviceInstance(deviceAddress))
      );
      console.log("Device Objects: ", deviceObjects);
      setFetchedDevices(deviceObjects);

    } catch (error) {
      console.log(error);
    }
  }, [ethersProvider, chainId])

  const fetchDeviceInstance = async (address: string): Promise<DeviceType> => {
    const deviceContract = new Contract(address, Device.abi, ethersProvider);
    return {
      sn: await deviceContract.sn(),
      customer: await deviceContract.customer(),
      locked: await deviceContract.locked(),
    };
  };

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { fetchedDevices, getBalance }
}

export default useBlockchain

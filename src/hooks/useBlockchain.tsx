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

  // A helper function that returns a promise that rejects after a timeout.
  const timeoutPromise = (ms: number) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );


  const fetchDevices = useCallback(async() => {
    /*setLoading(true);
    setError(null); --> implement error handling later */
    if (!ethersProvider) return;
    let contractAddress;
    const network = (await ethersProvider.getNetwork()).name
    switch (network) {
      case "sepolia":
        contractAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_SEPOLIA;
        break;
      default:
        contractAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_LOCALHOST;
        break;
    }
    let contract:Contract, rootCustomer:string;
    try { // Fetch rootCustomer 
      console.log("Fetching devices...")
      contract = new Contract(contractAddress, CuCoBlockchain.abi, ethersProvider);
      // Timeout logic below is because BrowserProvider doesn't timeout with a localhost node
      rootCustomer = (await Promise.race([
        contract.getCustomers().then(customers => customers[0]),
        timeoutPromise(10000)
      ])) as string;
      console.log("Root Customer: ", rootCustomer);
    } catch (error) {
      console.error("Unable to fetch rootCustomer");
      console.error(error);
      setFetchedDevices([]);
      return;
    }

    try {
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
      setFetchedDevices([]);
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

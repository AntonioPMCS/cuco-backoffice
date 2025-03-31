import { useState, useCallback } from "react";
import { Contract } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Device from "../../abi/Device.json";
import { DeviceType } from "../context/BlockchainContext";

export const useDevices = (ethersProvider: any, chainId: any) => {
  const [devices, setDevices] = useState<DeviceType[]>([]);

    // A helper function that returns a promise that rejects after a timeout.
    const timeoutPromise = (ms: number) => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), ms)
    );

  const fetchDevices = useCallback(async () => {
    if (!ethersProvider) return;
    let contractAddress;
    const network = (await ethersProvider.getNetwork()).name;
    switch (network) {
      case "sepolia":
        contractAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_SEPOLIA;
        break;
      default:
        contractAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_LOCALHOST;
        break;
    }
    let contract: Contract, rootCustomer: string;
    try {
      console.log("Fetching devices...");
      contract = new Contract(contractAddress, CuCoBlockchain.abi, ethersProvider);
      rootCustomer = (await Promise.race([
        contract.getCustomers().then((customers: any[]) => customers[0]),
        timeoutPromise(10000),
      ])) as string;
      console.log("Root Customer: ", rootCustomer);
    } catch (error) {
      console.error("Unable to fetch rootCustomer", error);
      setDevices([]);
      return;
    }

    try {
      // Fetch all device instances concurrently
      const deviceAddresses: string[] = await contract.getDevicesUnderCustomer(rootCustomer);
      const deviceObjects: Array<DeviceType> = await Promise.all(
        deviceAddresses.map((address) => fetchDeviceInstance(address))
      );
      setDevices(deviceObjects);
    } catch (error) {
      console.error(error);
      setDevices([]);
    }
  }, [ethersProvider, chainId]);

  const fetchDeviceInstance = async (address: string): Promise<DeviceType> => {
    const deviceContract = new Contract(address, Device.abi, ethersProvider);
    return {
      sn: await deviceContract.sn(),
      customer: await deviceContract.customer(),
      locked: await deviceContract.locked(),
    };
  };

  // More device actions (create, update, etc.) can be added here.

  return { devices, fetchDevices };
};

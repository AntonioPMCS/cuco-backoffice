import { useState, useCallback } from "react";
import { Contract, Signer, TransactionResponse, Interface } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Device from "../../abi/Device.json";
import { DeviceType } from "../context/BlockchainContext";
import { useWalletProviders } from "./useWalletProviders";

export const useDevices = () => {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const {chainId, ethersProvider} = useWalletProviders()

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
      address: await deviceContract.getAddress(),
      sn: await deviceContract.sn(),
      customer: await deviceContract.customer(),
      locked: await deviceContract.locked(),
      metadata: await deviceContract.metadata(),
    };
  };

  // More device actions (create, update, etc.) can be added here.

  const addDevice = useCallback(async (_sn:string, _customer: string, _metadata:string) => {
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
    try {
      console.log("Adding new device...");
      const signer:Signer = await ethersProvider.getSigner(); // Get the connected account
      const contract:Contract = new Contract(contractAddress, CuCoBlockchain.abi, signer);
      const tx:TransactionResponse = await contract.createDevice(_customer, _sn, _metadata);
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("Transaction confirmed:", receipt);
        const logs = receipt.logs;
        const cucoInterface = new Interface(CuCoBlockchain.abi);
        const parsedLog = cucoInterface.parseLog(logs[logs.length-1]); //last log is event emitted
        console.log(parsedLog);
        const newDeviceAddress:string = parsedLog?.args.deviceAddress;
        setDevices([...devices, await (fetchDeviceInstance(newDeviceAddress))]);
      } else {
        throw Error("Transaction receipt differs from expected");
      }
      
    } catch (error) {
      console.error("Unable to create device", error);
      return;
    }
  }, [ethersProvider, chainId])

  return { devices, fetchDevices, addDevice };
};

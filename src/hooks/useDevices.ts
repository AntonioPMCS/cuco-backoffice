import { useState, useCallback } from "react";
import { Contract, Signer, TransactionResponse, Interface, Provider } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Device from "../../abi/Device.json";
import { DeviceType } from "../context/BlockchainContext";
import { useWalletProviders } from "./useWalletProviders";
import { batchCalls } from "./useBatchCalls";

export const useDevices = () => {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const {chainId, ethersProvider} = useWalletProviders();

  // A helper function that returns a promise that rejects after a timeout.
  const timeoutPromise = (ms: number) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );

  // A helper to return the CUCo contract on current network
  const getCuco = async (ethersProvider:Provider) => {

    let cucoAddress;
    const network = (await ethersProvider.getNetwork()).name;
    switch (network) {
      case "sepolia":
        cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_SEPOLIA;
        break;
      default:
        cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_LOCALHOST;
        break;
    }
    return cucoAddress;
  }

  const fetchDevices = useCallback(async () => {
    if (!ethersProvider) return;
    const cucoAddress = await getCuco(ethersProvider);
    let contract: Contract, rootCustomer: string;
    try {
      console.log("Fetching devices...");
      contract = new Contract(cucoAddress, CuCoBlockchain.abi, ethersProvider);
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
      const deviceAddresses: string[] = await contract.getDevicesUnderCustomer(rootCustomer);
      const deviceObjects: Array<DeviceType> = await _fetchDeviceInstances(deviceAddresses);
      setDevices(deviceObjects);
    } catch (error) {
      console.error(error);
      setDevices([]);
    }
  }, [ethersProvider, chainId]);


  const _fetchDeviceInstances = async(deviceAddresses: string[]): Promise<DeviceType[]> => {
    // Batch calls to fetch device instances
    const fnNames = ["sn", "customer", "deviceState", "metadata", "visible"];
    const results = await batchCalls(ethersProvider, deviceAddresses, fnNames, "Device");
    const deviceObjects: Array<DeviceType> = deviceAddresses.map((address, index) => ({
      address,
      sn: results[index * fnNames.length] as string,
      customer: results[index * fnNames.length + 1] as string,
      deviceState: results[index * fnNames.length + 2] as number,
      metadata: results[index * fnNames.length + 3] as string,
      visible: results[index * fnNames.length + 4] as boolean
    }));
    return deviceObjects;
  }

  const fetchDeviceInstance = async (address: string): Promise<DeviceType> => {
    const deviceContract = new Contract(address, Device.abi, ethersProvider);
    return {
      address: await deviceContract.getAddress(),
      sn: await deviceContract.sn(),
      customer: await deviceContract.customer(),
      deviceState: await deviceContract.deviceState(),
      metadata: await deviceContract.metadata(),
      visible: await deviceContract.visible()
    };
  };

  // More device actions (create, update, etc.) can be added here.

  const setDeviceState = useCallback(async (_newState:number, _address:string) => {
    if (!ethersProvider) return;
    const cucoAddress = await getCuco(ethersProvider);
    try {
      
      console.log("Editing device state...");
      const signer:Signer = await ethersProvider.getSigner(); // Get the connected account
      const contract:Contract = new Contract(cucoAddress, CuCoBlockchain.abi, signer);
      const tx:TransactionResponse = await contract.setDeviceState(_newState, _address);
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("Transaction confirmed:", receipt);
        const logs = receipt.logs;
        const deviceInterface = new Interface(Device.abi);
        const parsedLog = deviceInterface.parseLog(logs[logs.length-1]); //last log is event emitted
        console.log(parsedLog);
        if (!parsedLog || parsedLog.args['1'] === undefined) {
          throw Error("Could not parse newDeviceState from log");
        }
        const newDeviceState:number = parsedLog?.args['1'];
        console.log("New device state: ", newDeviceState);
        // Update the device state locally after successful blockchain update
        setDevices((prevDevices) =>
          prevDevices.map((device) => {
            if (device.address === _address) {
              return { ...device, deviceState: newDeviceState };
            }
            return device;
          })
        );
        console.log("Updated device state locally");

      } else {
        throw Error("Transaction receipt differs from expected");
      }
      
    } catch (error) {
      console.error("Unable to create device", error);
      return;
    }
  }, [ethersProvider, chainId])

  const addDevice = useCallback(async (customer: string, sn:string, metadata:string) => {
    if (!ethersProvider) return;
    const cucoAddress = await getCuco(ethersProvider);
    try {
      const signer:Signer = await ethersProvider.getSigner(); // Get the connected account
      const contract:Contract = new Contract(cucoAddress, CuCoBlockchain.abi, signer);
      const tx:TransactionResponse = await contract.createDevice(customer, sn, metadata);
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

  const toggleDeviceVisible = useCallback(async (_deviceAddress: string) => {
    if (!ethersProvider) return;
    const cucoAddress = await getCuco(ethersProvider);
    try {
      const signer:Signer = await ethersProvider.getSigner(); // Get the connected account
      const contract:Contract = new Contract(cucoAddress, CuCoBlockchain.abi, signer);
      const tx:TransactionResponse = await contract.toggleDeviceVisible(_deviceAddress);
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("Transaction confirmed:", receipt);
        const logs = receipt.logs;
        const cucoInterface = new Interface(CuCoBlockchain.abi);
        const parsedLog = cucoInterface.parseLog(logs[logs.length-1]); //last log is event emitted
        console.log(parsedLog);
        const newDeviceVisibility:boolean = parsedLog?.args.newDeviceState;
        setDevices(devices.map((device) => {
          if (device.address == _deviceAddress) {
            return { ...device, visible: newDeviceVisibility};
          }
          return device;
        }));
      } else {
        throw Error("Transaction receipt differs from expected");
      }
      
    } catch (error) {
      console.error("Unable to create device", error);
      return;
    }
  }, [ethersProvider, chainId])

  return { devices, fetchDevices, addDevice, setDeviceState, toggleDeviceVisible };
};

import { useState, useCallback } from "react";
import { Contract, TransactionResponse, Interface } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Device from "../../abi/Device.json";
import { DeviceType } from "../context/CucoContext";
import { useWalletProviders } from "./useWalletProviders";
import { batchCalls } from "./useBatchCalls";

export const useDevices = (cucoContract?: Contract | null) => {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const {chainId, ethersProvider} = useWalletProviders();

  // A helper function that returns a promise that rejects after a timeout.
  const timeoutPromise = (ms: number) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );

  const fetchDevices = useCallback(async () => {
    if (!ethersProvider) return;
    if (!cucoContract) {
      console.log("CucoContract is null at fetchDevices"); 
      return;
    }
    let rootCustomer: string;
    try {
      console.log("Fetching devices...");
      rootCustomer = (await Promise.race([
        cucoContract.getCustomers().then((customers: any[]) => customers[0]),
        timeoutPromise(10000),
      ])) as string;
      console.log("Root Customer: ", rootCustomer);
    } catch (error) {
      console.error("Unable to fetch rootCustomer", error);
      setDevices([]);
      return;
    }

    try {
      const deviceAddresses: string[] = await cucoContract.getDevicesUnderCustomer(rootCustomer);
      const deviceObjects: Array<DeviceType> = await _fetchDeviceInstances(deviceAddresses);
      setDevices(deviceObjects);
    } catch (error) {
      console.error(error);
      setDevices([]);
    }
  }, [ethersProvider, chainId, cucoContract]);


  const _fetchDeviceInstances = async(deviceAddresses: string[]): Promise<DeviceType[]> => {
    // Batch calls to fetch device instances
    const fnNames = ["sn", "customer", "deviceState", "metadata", "visible"];
    const results = await batchCalls(ethersProvider, deviceAddresses, fnNames, "Device");
    const deviceObjects: Array<DeviceType> = deviceAddresses.map((address, index) => ({
      address,
      sn: results[index * fnNames.length] as string,
      customer: results[index * fnNames.length + 1] as string,
      deviceState: results[index * fnNames.length + 2] as number,
      metadataURI: results[index * fnNames.length + 3] as string,
      visible: results[index * fnNames.length + 4] as boolean,
      IT: "", //installationText
      BT: "", //blockText
      BW: "", //blockWarning
      TW: 0, //toleranceWindow
      MaxUC: 0,
      ticketlifetime: 0
    }));
    return deviceObjects;
  }

  const fetchDeviceInstance = async (address: string): Promise<DeviceType> => {
    const deviceContract = new Contract(address, Device.abi, ethersProvider);
    // We defer IPFS fetching to the Device page to speed up loading.
    return {
      address: await deviceContract.getAddress(),
      sn: await deviceContract.sn(),
      customer: await deviceContract.customer(),
      deviceState: await deviceContract.deviceState(),
      metadataURI: await deviceContract.metadata(),
      visible: await deviceContract.visible(),
      IT: "",
      BT: "",
      BW: "",
      TW: 0,
      MaxUC: 0,
      ticketlifetime: 0
    };
  };

  // More device actions (create, update, etc.) can be added here.

  const setDeviceState = useCallback(async (_newState:number, _address:string) => {
    if (!ethersProvider || !cucoContract) {
      console.log("CucoContract or ethersProvider is null at setDeviceState");
      return;
    } 
    try {
      
      console.log("Editing device state...");
      const tx:TransactionResponse = await cucoContract.setDeviceState(_newState, _address);
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
      console.error("Unable to change device state", error);
      return;
    }
  }, [ethersProvider, chainId, cucoContract])

  const addDevice = useCallback(async (customer: string, sn:string, metadata:string) => {
    if (!ethersProvider || !cucoContract) {
      console.log("CucoContract or ethersProvider is null at addDevice");
      return;
    }
    try {
      const tx:TransactionResponse = await cucoContract.createDevice(customer, sn, metadata);
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
  }, [ethersProvider, chainId, cucoContract])

  const toggleDeviceVisible = useCallback(async (_deviceAddress: string) => {
    if (!ethersProvider || !cucoContract) {
      console.log("CucoContract or ethersProvider is null at toggleDeviceVisible");
      return;
    }
    try {
      const tx:TransactionResponse = await cucoContract.toggleDeviceVisible(_deviceAddress);
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
  }, [ethersProvider, chainId, cucoContract])

  // Skeleton: set device metadata URI (no implementation yet)
  const setDeviceMetadataURI = useCallback(async (_address: string, _metadataURI: string) => {
    if (!ethersProvider || !cucoContract) {
      console.log("CucoContract or ethersProvider is null at toggleDeviceVisible");
      return;
    }
    try {
      const tx:TransactionResponse = await cucoContract.setDeviceMetadataURI(_metadataURI, _address);
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("Transaction confirmed:", receipt);
        const logs = receipt.logs;
        const cucoInterface = new Interface(CuCoBlockchain.abi);
        const parsedLog = cucoInterface.parseLog(logs[logs.length-1]); //last log is event emitted
        console.log(parsedLog);
        const newMetadataURI:string = parsedLog?.args.newUri;
        setDevices(devices.map((device) => {
          if (device.address == _address) {
            return { ...device, metadataURI: newMetadataURI};
          }
          return device;
        }));
      } else {
        throw Error("Transaction receipt differs from expected");
      }
    } catch (error) {
      console.error("Unable to set device metadata URI", error);
      return;
    }
  }, [ethersProvider, chainId, cucoContract])

  return { devices, fetchDevices, addDevice, setDeviceState, toggleDeviceVisible, setDeviceMetadataURI };
};

import { useState, useCallback } from "react";
import { Contract, Signer, TransactionResponse, Interface, FallbackProvider, ZeroAddress as ZEROADDRESS} from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Customer from "../../abi/Customer.json";
import { CustomerType } from "../context/CucoContext";
import { useWalletProviders } from "./useWalletProviders";
import { batchCalls } from "./useBatchCalls";

export const useCustomers = (cucoContract?: Contract | null) => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const {chainId, ethersProvider} = useWalletProviders();

  const timeoutPromise = (ms: number) =>
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms));

  const fetchCustomers = useCallback(async () => {
    if (!ethersProvider) return;
    if (!cucoContract) return;
    let customerAddresses: string[];
    try {
      console.log("Fetching customers...");
      customerAddresses = (await Promise.race([
        cucoContract.getCustomers(),
        timeoutPromise(10000),
      ])) as string[];
    } catch (error) {
      console.error("Unable to fetch customers", error);
      setCustomers([]);
      return;
    }
    try {
      const fnNames = ["parent", "name", "getAuthorizedUsers","getDeviceMetadata"];
      const results = await batchCalls(ethersProvider, customerAddresses, fnNames, "Customer");
      const customerObjects: Array<CustomerType> = customerAddresses.map((address, index) => ({
        address,
        name: results[index * fnNames.length + 1] as string,
        parent: results[index * fnNames.length] as string,
        parentName: "",
        authorizedUsers: results[index * fnNames.length + 2] as string[],
        deviceMetadata: results[index * fnNames.length + 3] as string
      }));

      const customerObjectsWithParentNames = customerObjects.map(customer => ({
        ...customer,
        parentName: fetchParentName(customer.parent, customerObjects)
      }));
      
      setCustomers(customerObjectsWithParentNames);
    } catch (error) {
      console.error(error);
      setCustomers([]);
    }
  }, [ethersProvider, chainId, cucoContract]);


  const fetchParentName = (parentAddress: string, customers: Array<CustomerType>): string => {
    if (parentAddress == ZEROADDRESS) return "";
    else {
        const parentCustomer = customers.find(customer => customer.address == parentAddress);
        return parentCustomer? parentCustomer.name : "";
      }
  }


  const fetchCustomerInstance = async (address: string): Promise<CustomerType> => {
    const customerContract = new Contract(address, Customer.abi, ethersProvider);
    try { 
      const parentAddress = await customerContract.parent();
      let parentName:string;
      if (parentAddress == "0x0000000000000000000000000000000000000000") {
        parentName = ""
      } else {
        const parentContract = new Contract(parentAddress, Customer.abi, ethersProvider);
        parentName = await parentContract.name()
      }
    
      const authorizedUsers:string[] = await customerContract.getAuthorizedUsers();
      return {
        name: await customerContract.name(),
        parent: parentAddress,
        parentName: parentName,
        address,
        authorizedUsers: authorizedUsers,
        deviceMetadata: await customerContract.getDeviceMetadata()
      };

    } catch (error) {
      console.log(error)
      throw Error(error as string);
    } 
  };

  // Additional customer actions (edit, create, etc.) can be added here.
  const addAdmin = useCallback(async (_customerAddress: string, _newAdmin:string) => {
    try {
      if (!ethersProvider) return;
      if (ethersProvider instanceof FallbackProvider) {
        throw Error("Connect to your wallet")
      }
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
      // TODO: Abstract getting and checking signer and providers
      const signer:Signer = await ethersProvider.getSigner(); // Get the connected account
      const contract:Contract = new Contract(contractAddress, CuCoBlockchain.abi, signer);
      const tx:TransactionResponse = await contract.authorizeUser(_customerAddress, _newAdmin);
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("Transaction confirmed:", receipt);
        // Get the customer and append new user to its authorizedUsers array
        setCustomers(customers.map( (customer) => {
          if (customer.address == _customerAddress) {
            return {...customer, authorizedUsers: [...customer.authorizedUsers, _newAdmin] }
          }
          return customer;
        }));
      } else {
        throw Error("Transaction receipt differs from expected");
      }
    } catch (error) {
      console.error("Unable to create customers", error);
      return;
    }
  }, [ethersProvider, chainId, customers])

  const createCustomer = useCallback(async (_parentAddress: string, _name:string, _deviceMetadata:string) => {
    if (!ethersProvider || !cucoContract) {
      console.log("CucoContract or ethersProvider is null at createCustomer");
      return;
    }

    try {
      const tx:TransactionResponse = await cucoContract.createCustomer(_parentAddress, _name, _deviceMetadata);
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      if (receipt) {
        console.log("Transaction confirmed:", receipt);
        const logs = receipt.logs;
        const cucoInterface = new Interface(CuCoBlockchain.abi);
        const parsedLog = cucoInterface.parseLog(logs[2]);
        console.log(parsedLog);
        const newCustomerAddress:string = parsedLog?.args.customerAddress;
        setCustomers([...customers, await (fetchCustomerInstance(newCustomerAddress))]);
      } else {
        throw Error("Transaction receipt differs from expected");
      }
      
    } catch (error) {
      console.error("Unable to create customers", error);
      return;
    }
  }, [ethersProvider, chainId, cucoContract, customers])

  return { customers, fetchCustomers, createCustomer, addAdmin };
};

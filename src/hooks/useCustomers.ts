import { useState, useCallback } from "react";
import { Contract, Signer, TransactionResponse, Interface } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Customer from "../../abi/Customer.json";
import { CustomerType } from "../context/BlockchainContext";
import { useWalletProviders } from "./useWalletProviders";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const {chainId, ethersProvider} = useWalletProviders()

  const timeoutPromise = (ms: number) =>
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms));

  const fetchCustomers = useCallback(async () => {
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
    let contract: Contract, customerAddresses: string[];
    try {
      console.log("Fetching customers...");
      contract = new Contract(contractAddress, CuCoBlockchain.abi, ethersProvider);
      customerAddresses = (await Promise.race([
        contract.getCustomers(),
        timeoutPromise(10000),
      ])) as string[];
    } catch (error) {
      console.error("Unable to fetch customers", error);
      setCustomers([]);
      return;
    }
    try {
      const customerObjects: Array<CustomerType> = await Promise.all(
        customerAddresses.map((address) => fetchCustomerInstance(address))
      );
      setCustomers(customerObjects);
    } catch (error) {
      console.error(error);
      setCustomers([]);
    }
  }, [ethersProvider, chainId]);

  const fetchCustomerInstance = async (address: string): Promise<CustomerType> => {
    const customerContract = new Contract(address, Customer.abi, ethersProvider);
    try { 
      const parentAddress = await customerContract.parent()
      const parentContract = new Contract(address, Customer.abi, ethersProvider);
      
      const authorizedUsers:string[] = await customerContract.getAuthorizedUsers();

      return {
        name: await customerContract.name(),
        parent: parentAddress,
        parentName: await parentContract.name(),
        address,
        authorizedUsers: authorizedUsers
      };

    } catch (error) {
      console.log(error)
      throw Error(error as string);
    } 
  };

  // Additional customer actions (edit, create, etc.) can be added here.

  const createCustomer = useCallback(async (_parentAddress: string, _name:string) => {
    if (!ethersProvider) return;
    console.log(ethersProvider)
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
      console.log("Creating customer...");
      const signer:Signer = await ethersProvider.getSigner(); // Get the connected account
      const contract:Contract = new Contract(contractAddress, CuCoBlockchain.abi, signer);
      const tx:TransactionResponse = await contract.createCustomer(_parentAddress, _name);
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
  }, [ethersProvider, chainId])

  return { customers, fetchCustomers, createCustomer };
};

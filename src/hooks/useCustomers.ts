import { useState, useCallback } from "react";
import { Contract } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Customer from "../../abi/Customer.json";
import { CustomerType } from "../context/BlockchainContext";

export const useCustomers = (ethersProvider: any, chainId: any) => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);

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
    return {
      name: await customerContract.name(),
      parent: await customerContract.parent(),
      address,
    };
  };

  // Additional customer actions (edit, create, etc.) can be added here.

  const createCustomer = useCallback(async (_parentAddress: string, _name:string) => {
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
    let contract: Contract, newCustomerAddress: string;
    try {
      console.log("Creating customer...");
      contract = new Contract(contractAddress, CuCoBlockchain.abi, ethersProvider);
      newCustomerAddress = (await Promise.race([
        contract.createCustomer(_parentAddress, _name),
        timeoutPromise(10000),
      ])) as string;
      setCustomers([...customers, await (fetchCustomerInstance(newCustomerAddress))]);
    } catch (error) {
      console.error("Unable to create customers", error);
      return;
    }
  }, [ethersProvider, chainId])

  return { customers, fetchCustomers, createCustomer };
};

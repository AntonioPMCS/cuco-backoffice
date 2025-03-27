import { useCallback, useEffect, useState} from "react";
import WalletContext from "./WalletContext";
import { Contract, ethers } from "ethers";
import { BrowserProvider } from "ethers";
import BlockchainContext, { CustomerType, DeviceType } from "./BlockchainContext";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";
import Device from "../../abi/Device.json";
import Customer from "../../abi/Customer.json";



const BlockchainProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { ethersProvider, chainId } = useWalletProviders();
  const [fetchedDevices, setFetchedDevices] = useState<Array<DeviceType>>([]);
  const [fetchedCustomers, setFetchedCustomers] = useState<Array<CustomerType>>([]);

  // A helper function that returns a promise that rejects after a timeout.
  const timeoutPromise = (ms: number) => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );

  // FETCH DEVICES
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
        contract.getCustomers().then((customers) => customers[0]),
        timeoutPromise(10000),
      ])) as string;
      console.log("Root Customer: ", rootCustomer);
    } catch (error) {
      console.error("Unable to fetch rootCustomer");
      console.error(error);
      setFetchedDevices([]);
      return;
    }

    try {
      const devices: string[] = await contract.getDevicesUnderCustomer(rootCustomer);
      console.log("Devices: ", devices);

      // Fetch all device instances concurrently
      const deviceObjects: Array<DeviceType> = await Promise.all(
        devices.map((deviceAddress) => fetchDeviceInstance(deviceAddress))
      );
      console.log("Device Objects: ", deviceObjects);
      setFetchedDevices(deviceObjects);
    } catch (error) {
      console.log(error);
      setFetchedDevices([]);
    }
  }, [ethersProvider, chainId]);

  // Fetch Single Device
  const fetchDeviceInstance = async (address: string): Promise<DeviceType> => {
    const deviceContract = new Contract(address, Device.abi, ethersProvider);
    return {
      sn: await deviceContract.sn(),
      customer: await deviceContract.customer(),
      locked: await deviceContract.locked(),
    };
  };

  // Fetch once on mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);


  // FETCH CUSTOMERS

  const fetchCustomers = useCallback(async() => {
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
    let contract:Contract, customers:string[];
    try { // Fetch customer array 
      console.log("Fetching customers...")
      contract = new Contract(contractAddress, CuCoBlockchain.abi, ethersProvider);
      // Timeout logic below is because BrowserProvider doesn't timeout with a localhost node
      customers = (await Promise.race([
        contract.getCustomers(),
        timeoutPromise(10000)
      ])) as string[];
      console.log("Customers: ", customers);
    } catch (error) {
      console.error("Unable to fetch customers");
      console.error(error);
      setFetchedCustomers([]);
      return;
    }

    try {
      // For each customer address we get its members and create an object
      // Fetch all customer instances concurrently and wait for them to resolve
      const customerObjects: Array<CustomerType> = await Promise.all(
        customers.map((customerAddress) => fetchCustomerInstance(customerAddress))
      );
      console.log("Customer Objects: ", customerObjects);
      setFetchedCustomers(customerObjects); 
    } catch (error) {
      console.log(error);
      setFetchedCustomers([]);
    }
  }, [ethersProvider, chainId])

  // Fetch a single Customer
  const fetchCustomerInstance = async (address: string): Promise<CustomerType> => {
    const customerContract = new Contract(address, Customer.abi, ethersProvider);
    return {
      name: await customerContract.name(),
      parent: await customerContract.parent(),
      address: address,
    };
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <BlockchainContext.Provider value={{ fetchedDevices, refetchDevices: fetchDevices, fetchedCustomers, refetchCustomers: fetchCustomers }}>
      {children}
    </BlockchainContext.Provider>
  );





  // Effect to fetch device data from the blockchain
  useEffect(() => {
    if (!fetchedDevices) {
      console.log("MetaMask not installed; using read-only default Provider")
      setEthersProvider(ethers.getDefaultProvider("sepolia") as BrowserProvider);
      return;
    }
    console.log("Initializing Ethers")
    console.log(selectedWallet)
    const provider = selectedWallet.provider;
    // Initialize Ethers provider from selected provider
    const ethersProvider = new ethers.BrowserProvider(provider);
    console.log(ethersProvider)
    setEthersProvider(ethersProvider);

    // Fetch the current chain ID
    provider
      .request({ method: "eth_chainId" })
      .then((chainId) => setChainId(chainId as string))
      .catch(console.error);

    // Listen for chain changes (only if `on` exists)
    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      // Reflect network changes in the provider object v
      setEthersProvider(new ethers.BrowserProvider(provider)); 
      //window.location.reload(); //Recommended by MetaMask
    };

    if (provider.on) {
      provider.on("chainChanged", handleChainChanged);
    }

    return () => {
      // What do to when the component unmounts?
    };
  }, [selectedWallet])

  const connectWallet = useCallback(
    async (providerWithInfo: EIP6963ProviderDetail) => {
      try {
        const accounts = (await providerWithInfo.provider.request ({
          method: "eth_requestAccounts",
        })) as string[]
        setSelectedWallet(providerWithInfo)
        setselectedAccount(accounts?.[0])

        const chainId = (await providerWithInfo.provider.request({
          method: "eth_chainId"
        })) as string;
        setChainId(chainId);
      } catch (error) {
        console.error("Failed to connect to provider:", error)
      }
    }, [providers]
  )

  return (
    <WalletContext.Provider value={{ 
      providers,
      selectedWallet,
      ethersProvider,
      selectedAccount,
      chainId,
      connectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export default BlockchainProvider;
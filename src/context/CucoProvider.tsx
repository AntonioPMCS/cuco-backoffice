import { useEffect, useState, useCallback } from "react";
import CucoContext from "./CucoContext";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { useDevices } from "@/hooks/useDevices";
import { useCustomers } from "@/hooks/useCustomers";
import { Contract } from "ethers";
import CuCoBlockchain from "../../abi/CuCoBlockchain.json";


const CucoProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { ethersProvider } = useWalletProviders();
  const [cucoContract, setCucoContract] = useState<Contract | null>(null);
  const { devices, fetchDevices, addDevice, setDeviceState, toggleDeviceVisible } = useDevices(cucoContract);
  const { customers, fetchCustomers, createCustomer, addAdmin } = useCustomers(cucoContract);

  
  const fetchCuco = useCallback(async () => {
    if (!ethersProvider) return;
    
    try {
      // Get network to determine which contract address to use
      const network = await ethersProvider.getNetwork();
      let cucoAddress;
      
      switch (network.name) {
        case "sepolia":
          cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_SEPOLIA;
          break;
        default:
          cucoAddress = import.meta.env.VITE_CUCOBLOCKCHAIN_LOCALHOST;
          break;
      }
      
      // Try to get signer for write operations
      try {
        const signer = await ethersProvider.getSigner();
        setCucoContract(new Contract(cucoAddress, CuCoBlockchain.abi, signer));
      } catch (error) {
        // If no signer available, use provider for read-only operations
        console.log("No signer available, using read-only provider");
        setCucoContract(new Contract(cucoAddress, CuCoBlockchain.abi, ethersProvider));
      }
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  }, [ethersProvider]);

  // Initialize contract when provider changes
  useEffect(() => {
    if (!ethersProvider) return;
    fetchCuco();
  }, [fetchCuco]);
  
  // Fetch data once contract is ready
  useEffect(() => {
    if (!ethersProvider || !cucoContract) return;

    fetchDevices();
    fetchCustomers();   
  }, [cucoContract, fetchDevices, fetchCustomers, ethersProvider]);


  return (
    <CucoContext.Provider 
      value={{ 
        cucoContract,
        fetchCuco: fetchCuco,
        fetchedDevices: devices,
        refetchDevices: fetchDevices, 
        addDevice,
        setDeviceState,
        toggleDeviceVisible,
        fetchedCustomers: customers,
        refetchCustomers: fetchCustomers,
        createCustomer,
        addAdmin
      }}
    >
      {children}
    </CucoContext.Provider>
  );
};

export default CucoProvider;

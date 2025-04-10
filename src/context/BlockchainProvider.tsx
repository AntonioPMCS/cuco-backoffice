import { useEffect } from "react";
import BlockchainContext from "./BlockchainContext";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { useDevices } from "@/hooks/useDevices";
import { useCustomers } from "@/hooks/useCustomers";


const BlockchainProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { ethersProvider } = useWalletProviders();
  const { devices, fetchDevices, addDevice, setDeviceState, toggleDeviceVisible } = useDevices();
  const { customers, fetchCustomers, createCustomer, addAdmin } = useCustomers();
  // Fetch data once on mount or when provider changes.
  useEffect(() => {
    fetchDevices();
    fetchCustomers();
  }, [fetchDevices, fetchCustomers, ethersProvider]);


  return (
    <BlockchainContext.Provider 
      value={{ 
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
    </BlockchainContext.Provider>
  );
};

export default BlockchainProvider;
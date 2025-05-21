import { useEffect } from "react";
import CucoContext from "./CucoContext";
import { useWalletProviders } from "@/hooks/useWalletProviders";
import { useDevices } from "@/hooks/useDevices";
import { useCustomers } from "@/hooks/useCustomers";


const CucoProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const { ethersProvider } = useWalletProviders();
  const { devices, fetchDevices, addDevice, setDeviceState, toggleDeviceVisible } = useDevices();
  const { customers, fetchCustomers, createCustomer, addAdmin } = useCustomers();
  // Fetch data once on mount or when provider changes.
  useEffect(() => {
    if (!ethersProvider) return;
    fetchDevices();
    fetchCustomers();
  }, [fetchDevices, fetchCustomers, ethersProvider]);


  return (
    <CucoContext.Provider 
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
    </CucoContext.Provider>
  );
};

export default CucoProvider;
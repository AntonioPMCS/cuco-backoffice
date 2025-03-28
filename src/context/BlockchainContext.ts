import { createContext } from "react";

export interface DeviceType {
  sn: string,
  customer: string,
  locked: boolean,
}

export interface CustomerType {
  name: string,
  parent: string,
  address: string;
}


type BlockchainContextType = { // The context is an array of providers
  fetchedDevices: Array<DeviceType>;
  refetchDevices: () => void;
  fetchedCustomers: Array<CustomerType>;
  refetchCustomers: () => void;
};


const BlockchainContext = createContext<BlockchainContextType>({
    // Default context
    fetchedDevices: [],
    refetchDevices: () => {},
    fetchedCustomers: [],
    refetchCustomers: () => {}
});

export default BlockchainContext;

import { createContext } from "react";

export interface DeviceType {
  sn: string,
  customer: string,
  locked: boolean,
}

export interface CustomerType {
  name: string,
  parent: string,
  parentName: string,
  address: string;
  authorizedUsers: string[];
}


type BlockchainContextType = { // The context is an array of providers
  fetchedDevices: Array<DeviceType>;
  refetchDevices: () => void;
  fetchedCustomers: Array<CustomerType>;
  refetchCustomers: () => void;
  createCustomer: (_parentAddress:string, _name:string) => void;
};


const BlockchainContext = createContext<BlockchainContextType>({
    // Default context
    fetchedDevices: [],
    refetchDevices: () => {},
    fetchedCustomers: [],
    refetchCustomers: () => {},
    createCustomer: () => {}
});

export default BlockchainContext;

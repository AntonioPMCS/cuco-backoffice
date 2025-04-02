import { createContext } from "react";

export interface DeviceType {
  address: string,
  sn: string,
  customer: string,
  locked: number,
  metadata: string,
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
  addDevice: (_sn:string, _customer:string, _metadata:string) => void;
  setDeviceState: (_state:number, _address:string) => void;
  fetchedCustomers: Array<CustomerType>;
  refetchCustomers: () => void;
  createCustomer: (_parentAddress:string, _name:string) => void;
};


const BlockchainContext = createContext<BlockchainContextType>({
    // Default context
    fetchedDevices: [],
    refetchDevices: () => {},
    addDevice: () => {},
    setDeviceState: () => {},
    fetchedCustomers: [],
    refetchCustomers: () => {},
    createCustomer: () => {}
});

export default BlockchainContext;

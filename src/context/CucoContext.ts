import { createContext } from "react";

export interface DeviceType {
  address: string,
  sn: string,
  customer: string,
  deviceState: number,
  metadata: string,
  visible: boolean
}

export interface CustomerType {
  name: string,
  parent: string,
  parentName: string,
  address: string;
  authorizedUsers: string[];
}


type CucoContextType = { // The context is an array of providers
  fetchedDevices: Array<DeviceType>;
  refetchDevices: () => void;
  addDevice: (_customer:string, _sn:string, _metadata:string) => void;
  setDeviceState: (_state:number, _address:string) => void;
  toggleDeviceVisible: (_address:string) => void;
  fetchedCustomers: Array<CustomerType>;
  refetchCustomers: () => void;
  createCustomer: (_parentAddress:string, _name:string) => void;
  addAdmin: (_customerAddress:string, _newAdmin:string) => void;
};


const CucoContext = createContext<CucoContextType>({
    // Default context
    fetchedDevices: [],
    refetchDevices: () => {},
    addDevice: () => {},
    setDeviceState: () => {},
    toggleDeviceVisible: () => {},
    fetchedCustomers: [],
    refetchCustomers: () => {},
    createCustomer: () => {},
    addAdmin: () => {},
});

export default CucoContext;
